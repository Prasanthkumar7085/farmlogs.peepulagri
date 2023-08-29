import Typography from "@mui/material/Typography";
import { useState, useRef, useEffect } from "react";
import FooterActionButtons from "@/components/AddLogs/footer-action-buttons";
import AddSupportQueryDetails from "./AddSupportQueryDetails";
import { AddSupportPayload } from "@/types/supportTypes";
import addSupportService from "../../../../lib/services/SupportService/addSupportService";
import addAttachmentsService from "../../../../lib/services/SupportService/addAttachmentsService";
import uploadFileToS3 from "../../../../lib/services/LogsService/uploadFileToS3InLog";
import styles from "./addSupportForm.module.css";
import { Button, CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import SupportAttachments from "@/components/AddLogs/SupportAttachments";
import AlertComponent from "@/components/Core/AlertComponent";

const AddSupportForm = () => {

    const router: any = useRouter()

    const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InBlZXB1bEBnbWFpbC5jb20iLCJpZCI6IjY0ZGM2NDNmOThhNzUyM2FkODA5ZDM1YyIsInBhc3N3b3JkIjoiJDJiJDEwJHlMQWZyVlBydlNaVUFCc21ReUYuV3VpbnF6bjU5bmpqY3pmLjFpcnZ4cUMxZ3daVm9LV2ppIiwiaWF0IjoxNjkyNjAyMjY5LCJleHAiOjE2OTc3ODYyNjl9.M8thgp9qQqLcBs0HxZ5uFw7P1dlY0UEUrmMrQXzXyRg'

    const [permission, setPermission] = useState(false);
    const mediaRecorder = useRef<any>(null);
    const [recordingStatus, setRecordingStatus] = useState("inactive");
    const [stream, setStream] = useState<any>(null);
    const [audioChunks, setAudioChunks] = useState([]);
    const [audio, setAudio] = useState<any>(null);
    const [supportOneDetails, setSupportOneDetails] = useState<any>()

    const [query, setQuery] = useState<string>(supportOneDetails?.title ? supportOneDetails?.title : "");
    const [categories, setCategories] = useState<Array<string>>();
    const [description, setDescription] = useState<string>('');
    const [files, setFiles] = useState<any>([]);
    const [filesDetailsAfterUpload, setFilesDetailsAfterUpload] = useState<any>([]);
    const [audioDetailsAfterUpload, setAudioDetailsAfterUpload] = useState<any>({});

    const [supportDetails, setSupportDetails] = useState<Partial<AddSupportPayload>>()

    useEffect(() => {
        collectSupportData();
    }, [query, categories, description, filesDetailsAfterUpload, audioDetailsAfterUpload]);

    const collectSupportData = () => {
        let supportData: Partial<AddSupportPayload> = {
            title: query,
            description: description,
            categories: categories,
            attachments: [...filesDetailsAfterUpload, audioDetailsAfterUpload],
            status: "OPEN",
            support_id: "SUPPORT1232"
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
            if (response.success) {
                setAlertMessage('Add Support Successful!');
                setAlertType(true);
                setTimeout(() => {
                    router.back();
                }, 1000)
            } else {
                setAlertMessage('Add Support Failed!');
                setAlertType(false);
            }
        } catch (err: any) {
            console.error(err);

        }
    }


    const [alertMessage, setAlertMessage] = useState<string>('');
    const [alertType, setAlertType] = useState<boolean>(false);
    const [loadingOnMicUpload, setLoadingOnMicUpload] = useState<boolean>(false);
    const [loadingOnImagesUpload, setLoadingOnImagesUpload] = useState<boolean>(false);

    const uploadAudio = async () => {
        setLoadingOnMicUpload(true);
        try {

            let audioResponseAfterUpload = {};

            const res = await fetch(audio);
            const blob = await res.blob();
            const sizeInBytes = blob.size;
            const blobName = blob.name || 'audio_blob.wav';
            const blobType = 'audio/wav';

            let ob = {
                original_name: blobName,
                type: blobType,
                size: sizeInBytes
            }
            const response = await addAttachmentsService({ attachments: [ob] }, accessToken);
            if (response.success) {
                const { target_url, ...rest } = response.data[0]
                let uploadResponse: any = await uploadFileToS3(target_url, blob);
                if (uploadResponse.ok) {
                    setAlertMessage('Audio Uploaded Successful!');
                    setAlertType(true);
                    audioResponseAfterUpload = { ...rest };
                    setAudioDetailsAfterUpload(audioResponseAfterUpload);
                } else {
                    setAlertMessage('Audio Uploaded Failed!');
                    setAlertType(false);
                }
            }
        } catch (err: any) {
            console.error(err);
        } finally {
            setLoadingOnMicUpload(false);
        }

    }





    const onChangeFile = (e: any) => {
        setFiles(e.target.files);
    }
    const uploadFiles = async () => {
        setLoadingOnImagesUpload(true);
        let tempFilesStorage = Array.from(files).map((item: any) => { return { original_name: item.name, type: item.type, size: item.size } });

        const response = await addAttachmentsService({ attachments: tempFilesStorage }, accessToken);
        if (response.success) {
            await postAllImages(response.data, tempFilesStorage);
        }
        setLoadingOnImagesUpload(false);
    }

    const postAllImages = async (response: any, tempFilesStorage: any) => {
        let arrayForResponse: any = [];

        for (let index = 0; index < response.length; index++) {
            let uploadResponse: any = await uploadFileToS3(response[index].target_url, files[index]);
            if (uploadResponse.ok) {
                setAlertMessage('Attachment(s) Uploaded Successful!');
                setAlertType(true);
                const { target_url, ...rest } = response[index];
                arrayForResponse.push({ ...rest, size: tempFilesStorage[index].size });
            } else {
                setAlertMessage('Attachment(s) Uploaded Failed!');
                setAlertType(false);
            }
        }
        setFilesDetailsAfterUpload(arrayForResponse);
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

                        <Button disabled={!audio} variant="contained" onClick={uploadAudio} sx={{ minWidth: '100px', maxWidth: "100px" }}>
                            {loadingOnMicUpload ?
                                <CircularProgress size="1.5rem" sx={{ color: " white" }} />
                                : 'Upload'}
                        </Button>
                    </div>
                    <div>
                        <Typography variant='subtitle2'>Upload Images</Typography>
                        <SupportAttachments onChangeFile={onChangeFile} uploadFiles={uploadFiles} files={files} loadingOnImagesUpload={loadingOnImagesUpload} />

                    </div>
                    <div>
                        <FooterActionButtons addLogs={addSupport} />
                        <AlertComponent alertMessage={alertMessage} alertType={alertType} setAlertMessage={setAlertMessage} />
                    </div>
                </div>
            </div>

        </div>
    )
}


export default AddSupportForm;