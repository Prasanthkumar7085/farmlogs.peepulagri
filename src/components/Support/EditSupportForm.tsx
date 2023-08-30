import { AddSupportPayload } from "@/types/supportTypes";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import editSupportService from "../../../lib/services/SupportService/editSupportService";
import getSupportByIdService from "../../../lib/services/SupportService/getSupportByIdService";
import AddSupportQueryDetails from "./Add/AddSupportQueryDetails";
import { Typography } from "@mui/material";
import FooterActionButtons from "../AddLogs/footer-action-buttons";
import SupportAttachments from "../AddLogs/SupportAttachments";
import addAttachmentsService from "../../../lib/services/SupportService/addAttachmentsService";
import uploadFileToS3 from "../../../lib/services/LogsService/uploadFileToS3InLog";
import { useSelector } from "react-redux";


const EditSupportForm = () => {

    const router: any = useRouter();

    const accessToken = useSelector((state: any) => state.auth.userDetails.userDetails?.access_token);




    const [permission, setPermission] = useState(false);
    const mediaRecorder = useRef<any>(null);
    const [recordingStatus, setRecordingStatus] = useState("inactive");
    const [stream, setStream] = useState<any>(null);
    const [audioChunks, setAudioChunks] = useState([]);
    const [audio, setAudio] = useState(null);
    const [supportOneDetails, setSupportOneDetails] = useState<any>()

    const [query, setQuery] = useState<string>(supportOneDetails?.title);
    const [categories, setCategories] = useState<Array<string>>();
    const [description, setDescription] = useState<string>('');

    const [supportDetails, setSupportDetails] = useState<Partial<AddSupportPayload>>();

    const [files, setFiles] = useState<any>([]);
    const [filesDetailsAfterUpload, setFilesDetailsAfterUpload] = useState<any>([]);


    useEffect(() => {
        setQuery(supportOneDetails?.title);
        setCategories(supportOneDetails?.categories);
        setDescription(supportOneDetails?.description);
    }, [supportOneDetails]);

    useEffect(() => {

        collectSupportData();

    }, [query, categories, description]);

    useEffect(() => {
        getOneSupportDetails();
    }, [router]);

    const collectSupportData = () => {
        const array = supportOneDetails?.attachments;
        let supportData: Partial<AddSupportPayload> = {
            title: query,
            description: description,
            categories: categories,
            status: "OPEN",
            attachments: array ? [...filesDetailsAfterUpload, ...array] : filesDetailsAfterUpload

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


    const editSupport = async () => {
        try {
            const response = await editSupportService(supportDetails, router?.query?.support_id);
        collectSupportData();
        } catch (err: any) {
            console.error(err);

        }
    }

    const getOneSupportDetails = async () => {
        try {
            const response = await getSupportByIdService(router?.query?.support_id);
            setSupportOneDetails(response?.data);

        } catch (err: any) {
            console.error(err);

        }
    }



    const onChangeFile = (e: any) => {
        setFiles(e.target.files);
    }
    const uploadFiles = async () => {
        let tempFilesStorage = Array.from(files).map((item: any) => { return { original_name: item.name, type: item.type, size: item.size } });

        const response = await addAttachmentsService({ attachments: tempFilesStorage }, accessToken);
        if (response.success) {
            await postAllImages(response.data, tempFilesStorage);
        }

    }

    const postAllImages = async (response: any, tempFilesStorage: any) => {
        let arrayForResponse: any = [];

        for (let index = 0; index < response.length; index++) {
            let uploadResponse: any = await uploadFileToS3(response[index].target_url, files[index]);

            if (uploadResponse.ok) {
                const { target_url, ...rest } = response[index];
                arrayForResponse.push({ ...rest, size: tempFilesStorage[index].size });
            }
        }
        setFilesDetailsAfterUpload(arrayForResponse);


    }


    return (
        <div style={{ border: "1px solid", display: "flex", flexDirection: "row", justifyContent: "center" }}>
            {router?.query?.support_id && supportOneDetails?.title ?

                <div style={{ display: "flex", flexDirection: "row", width: "60%" }}>
                    <AddSupportQueryDetails
                        query={query}
                        categories={categories}
                        description={description}
                        setQuery={setQuery}
                        setCategories={setCategories}
                        supportOneDetails={supportOneDetails}
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
                            <SupportAttachments onChangeFile={onChangeFile} uploadFiles={uploadFiles} files={files} />
                        </div>
                        <div>
                            <FooterActionButtons editLog={editSupport} />
                        </div>
                    </div>
                </div> : ""}
        </div>
    )
}


export default EditSupportForm;