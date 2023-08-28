import Typography from "@mui/material/Typography";
import { useState, useRef, useEffect } from "react";
import Attachments from "./../../AddLogs/attachments";
import FooterActionButtons from "@/components/AddLogs/footer-action-buttons";
import AddSupportQueryDetails from "./AddSupportQueryDetails";
import { AddSupportPayload } from "@/types/supportTypes";
import addSupportService from "../../../../lib/services/SupportService/addSupportService";
import { Button } from "@mui/material";
import { useRouter } from "next/router";

const AddSupportForm = () => {

    const router: any = useRouter()

    const [permission, setPermission] = useState(false);
    const mediaRecorder = useRef<any>(null);
    const [recordingStatus, setRecordingStatus] = useState("inactive");
    const [stream, setStream] = useState<any>(null);
    const [audioChunks, setAudioChunks] = useState([]);
    const [audio, setAudio] = useState(null);
    const [supportOneDetails, setSupportOneDetails] = useState<any>()

    const [query, setQuery] = useState<string>(supportOneDetails?.title ? supportOneDetails?.title : "");
    const [categories, setCategories] = useState<Array<string>>();
    const [description, setDescription] = useState<string>('');

    const [supportDetails, setSupportDetails] = useState<Partial<AddSupportPayload>>()

    useEffect(() => {
        collectSupportData();
    }, [query, categories, description]);

    const collectSupportData = () => {
        let supportData: Partial<AddSupportPayload> = {
            title: query,
            description: description,
            categories: categories,
            attachments: [],
            status: "OPEN",
            support_id: "SUPPORT123"
        }
        setSupportDetails(supportData)
    }

    const getMicrophonePermission = async () => {
        if ("MediaRecorder" in window) {
            try {
                const streamData: any = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: false,
                });
                setPermission(true);
                setStream(streamData);
            } catch (err: any) {
                alert(err.message);
            }
        } else {
            alert("The MediaRecorder API is not supported in your browser.");
        }
    };

    const startRecording = async () => {
        setRecordingStatus("recording");
        //create new Media recorder instance using the stream
        const media = new MediaRecorder(stream);
        //set the MediaRecorder instance to the mediaRecorder ref
        mediaRecorder.current = media;
        //invokes the start method to start the recording process
        mediaRecorder.current.start();
        let localAudioChunks: any = [];
        mediaRecorder.current.ondataavailable = (event: any) => {
            if (typeof event.data === "undefined") return;
            if (event.data.size === 0) return;
            localAudioChunks.push(event.data);
        };
        setAudioChunks(localAudioChunks);
    };

    const stopRecording = () => {
        setRecordingStatus("inactive");
        //stops the recording instance
        mediaRecorder.current.stop();
        mediaRecorder.current.onstop = () => {
            //creates a blob file from the audiochunks data
            const audioBlob = new Blob(audioChunks);
            //creates a playable URL from the blob file.
            const audioUrl: any = URL.createObjectURL(audioBlob);
            setAudio(audioUrl);
            setAudioChunks([]);
        };
    };

    const addSupport = async () => {
        try {
            const response = await addSupportService(supportDetails);
        } catch (err: any) {
            console.error(err);

        }
    }

    const uploadAudio = () => {

    }



    return (
        <div style={{ border: "1px solid", display: "flex", flexDirection: "row", justifyContent: "center" }}>
            <div style={{ display: "flex", flexDirection: "row", width: "60%" }}>
                <AddSupportQueryDetails
                    query={query}
                    categories={categories}
                    description={description}
                    setQuery={setQuery}
                    setCategories={setCategories}
                    setDescription={setDescription} supportOneDetails={supportOneDetails} />

                <div style={{ display: "flex", flexDirection: "column", width: "50%", justifyContent: "center" }}>
                    <Typography variant='subtitle2'>Mic</Typography>

                    <div className="audio-controls">
                        {!permission ? (
                            <button onClick={getMicrophonePermission} type="button">
                                Get Microphone
                            </button>
                        ) : null}
                        {permission && recordingStatus === "inactive" ? (
                            <button onClick={startRecording} type="button">
                                Start Recording
                            </button>
                        ) : null}
                        {recordingStatus === "recording" ? (
                            <button onClick={stopRecording} type="button">
                                Stop Recording
                            </button>
                        ) : null}

                        {audio ? (
                            <div>
                                <audio src={audio} controls controlsList="nodownload"></audio>
                                {/* <a download="recording.mp3" href={audio} type="audio/mpeg" >
                                    Download Recording
                                </a> */}
                            </div>
                        ) : null}

                        <Button disabled={!audio} variant="contained" onClick={uploadAudio}>
                            Upload
                        </Button>
                    </div>
                    <div>
                        <Typography variant='subtitle2'>Upload Images</Typography>
                        <Attachments />

                    </div>
                    <div>
                        <FooterActionButtons addLogs={addSupport} />
                    </div>
                </div>
            </div>
        </div>
    )
}


export default AddSupportForm;