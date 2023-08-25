import Typography from "@mui/material/Typography";
import { useState, useRef } from "react";
import Attachments from "./../../AddLogs/attachments";
import FooterActionButtons from "@/components/AddLogs/footer-action-buttons";
import AddSupportQueryDetails from "./AddSupportQueryDetails";

const AddSupportForm = () => {


    const [permission, setPermission] = useState(false);
    const mediaRecorder = useRef<any>(null);
    const [recordingStatus, setRecordingStatus] = useState("inactive");
    const [stream, setStream] = useState<any>(null);
    const [audioChunks, setAudioChunks] = useState([]);
    const [audio, setAudio] = useState(null);

    const [query, setQuery] = useState<string>('');
    const [categories, setCategories] = useState<string>('');
    const [description, setDescription] = useState<string>('');



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

    return (
        <div style={{ border: "1px solid", display: "flex", flexDirection: "row", justifyContent: "center" }}>
            <div style={{ display: "flex", flexDirection: "row", width: "60%" }}>
                <AddSupportQueryDetails
                    query={query}
                    categories={categories}
                    description={description}
                    setQuery={setQuery}
                    setCategories={setCategories}
                    setDescription={setDescription}
                />

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
                            <div className="audio-container">
                                <audio src={audio} controls></audio>
                                <a download href={audio} type='.mp3'>
                                    Download Recording
                                </a>
                            </div>
                        ) : null}
                    </div>
                    <div>
                        <Typography variant='subtitle2'>Upload Images</Typography>
                        <Attachments />
                    </div>
                    <div>
                        <FooterActionButtons />
                    </div>
                </div>
            </div>
        </div>
    )
}


export default AddSupportForm;