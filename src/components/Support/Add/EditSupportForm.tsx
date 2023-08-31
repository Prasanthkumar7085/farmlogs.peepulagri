import { AddSupportPayload } from "@/types/supportTypes";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import editSupportService from "../../../../lib/services/SupportService/editSupportService";
import getSupportByIdService from "../../../../lib/services/SupportService/getSupportByIdService";
import AddSupportQueryDetails from "./AddSupportQueryDetails";
import { Button, Chip, CircularProgress, Fab, Grid, Typography } from "@mui/material";
import FooterActionButtons from "../../AddLogs/footer-action-buttons";
import SupportAttachments from "../SupportAttachments";
import addAttachmentsService from "../../../../lib/services/SupportService/addAttachmentsService";
import uploadFileToS3 from "../../../../lib/services/LogsService/uploadFileToS3InLog";
import { useSelector } from "react-redux";
import AlertComponent from "../../Core/AlertComponent";
import styles from "./addSupportForm.module.css";


// Icons
import KeyboardVoiceRoundedIcon from '@mui/icons-material/KeyboardVoiceRounded';
import GraphicEqRoundedIcon from '@mui/icons-material/GraphicEqRounded';
import FiberManualRecordRoundedIcon from '@mui/icons-material/FiberManualRecordRounded';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const EditSupportForm = () => {

    const router: any = useRouter();

    const accessToken = useSelector((state: any) => state.auth.userDetails.userDetails?.access_token);




    const [permission, setPermission] = useState(false);
    const mediaRecorder = useRef<any>(null);
    const [recordingStatus, setRecordingStatus] = useState("inactive");
    const [stream, setStream] = useState<any>(null);
    const [audioChunks, setAudioChunks] = useState([]);
    const [audio, setAudio] = useState<any>(null);
    const [supportOneDetails, setSupportOneDetails] = useState<any>();
    const [loadingOnMicUpload, setLoadingOnMicUpload] = useState<boolean>(false);
    const [loadingOnImagesUpload, setLoadingOnImagesUpload] = useState<boolean>(false);

    const [query, setQuery] = useState<string>(supportOneDetails?.title);
    const [categories, setCategories] = useState<Array<string>>();
    const [description, setDescription] = useState<string>('');

    const [supportDetails, setSupportDetails] = useState<Partial<AddSupportPayload>>();

    const [files, setFiles] = useState<any>([]);
    const [filesDetailsAfterUpload, setFilesDetailsAfterUpload] = useState<any>([]);
    const [audioDetailsAfterUpload, setAudioDetailsAfterUpload] = useState<any>({});


    const [alertMessage, setAlertMessage] = useState<string>("");
    const [alertType, setAlertType] = useState<boolean>(false);



    useEffect(() => {
        setQuery(supportOneDetails?.title);
        setCategories(supportOneDetails?.categories);
        setDescription(supportOneDetails?.description);
    }, [supportOneDetails]);

    useEffect(() => {
        collectSupportData();
    }, [query, categories, description, filesDetailsAfterUpload]);

    useEffect(() => {
        getOneSupportDetails();
    }, [router]);


    const uploadAudio = async () => {
        setLoadingOnMicUpload(true);
        try {
            let audioResponseAfterUpload = {};

            const res = await fetch(audio);
            const blob = await res.blob();
            const sizeInBytes = blob.size;
            const blobName = blob.name || "audio_blob.wav";
            const blobType = "audio/wav";

            let ob = {
                original_name: blobName,
                type: blobType,
                size: sizeInBytes,
            };
            const response = await addAttachmentsService(
                { attachments: [ob] },
                accessToken
            );
            if (response.success) {
                const { target_url, ...rest } = response.data[0];
                let uploadResponse: any = await uploadFileToS3(target_url, blob);
                console.log(uploadResponse);

                if (uploadResponse.ok) {
                    setAlertMessage("Audio Uploaded Successful!");
                    setAlertType(true);
                    audioResponseAfterUpload = { ...rest };
                    setAudioDetailsAfterUpload(audioResponseAfterUpload);
                } else {
                    setAlertMessage("Audio Uploaded Failed!");
                    setAlertType(false);
                }
            }
        } catch (err: any) {
            console.error(err);
        } finally {
            setLoadingOnMicUpload(false);
        }
    };


    const collectSupportData = () => {
        const array = supportOneDetails?.attachments;
        console.log(array);
        console.log(filesDetailsAfterUpload);

        let attachmentsArray: any = [];

        if (array) {
            if (Object.keys(audioDetailsAfterUpload).length) {
                attachmentsArray = [...filesDetailsAfterUpload, ...array, audioDetailsAfterUpload]
            } else {
                attachmentsArray = [...filesDetailsAfterUpload, ...array]
            }
        } else {
            if (Object.keys(audioDetailsAfterUpload).length) {
                attachmentsArray = [...filesDetailsAfterUpload, audioDetailsAfterUpload]
            } else {
                attachmentsArray = [...filesDetailsAfterUpload]
            }
        }

        let supportData: Partial<AddSupportPayload> = {
            title: query,
            description: description,
            categories: categories,
            status: "OPEN",
            attachments: [...attachmentsArray]

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



    const onChangeFile = (e: any, check = false) => {
        setFiles(e.target.files);

        // if (check) {
        //     let arrayForResponse: any = [...filesDetailsAfterUpload];

        //     let tempFiles = e.target.files;

        //     let array: any = []
        //     Array.from(tempFiles).forEach((item: any, index: number) => (
        //         arrayForResponse.map((mapItem: any, mapIndex: number) => {
        //             if (mapItem.original_name == item.name) {
        //                 array.push(item);
        //             }
        //         })
        //     ))
        //     console.log(array);

        //     setFilesDetailsAfterUpload([...array])

        // }

    }
    const uploadFiles = async () => {
        setLoadingOnImagesUpload(true);
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
                if (uploadResponse.ok) {
                    setAlertMessage("Attachment(s) Uploaded Successful!");
                    setAlertType(true);
                    const { target_url, ...rest } = response[index];
                    arrayForResponse.push({ ...rest, size: tempFilesStorage[index].size });
                } else {
                    setAlertMessage("Attachment(s) Uploaded Failed!");
                    setAlertType(false);
                }
                const { target_url, ...rest } = response[index];
                arrayForResponse.push({ ...rest, size: tempFilesStorage[index].size });
            }
        }
        setFilesDetailsAfterUpload(arrayForResponse);

        setLoadingOnImagesUpload(false);
    }


    return (
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>

            {router?.query?.support_id && supportOneDetails?.title ?

                <div className={styles.addSupportForm}>
                    <Grid container direction="row" justifyContent="center" spacing={3}>
                        <Grid item xs={12} sm={10} md={6}>
                            <AddSupportQueryDetails
                                query={query}
                                categories={categories}
                                description={description}
                                setQuery={setQuery}
                                setCategories={setCategories}
                                supportOneDetails={supportOneDetails}
                                setDescription={setDescription}
                            />
                        </Grid>

                        <Grid item xs={12} sm={10} md={6}>
                            <div style={{ display: "flex", flexDirection: "column", width: "100%", justifyContent: "center" }}>
                                <Typography variant='subtitle2'
                                    style={{
                                        fontFamily: "Inter",
                                        fontWeight: "600",
                                        color: "var(--gray-700)",
                                        marginBlock: "4px",
                                    }}>
                                    Mic
                                </Typography>
                                <div className={styles.audioControls}>
                                    <div className={styles.voiceRecording}>
                                        {!permission ? (
                                            <Fab size="small" color="error" aria-label="Get Microphone" onClick={getMicrophonePermission}>
                                                <KeyboardVoiceRoundedIcon />
                                            </Fab>
                                        ) : null}
                                        {!permission ? (
                                            <Typography color="error">Get Microphone</Typography>
                                        ) : null}
                                    </div>

                                    <div className={styles.voiceRecording}>
                                        {permission && recordingStatus === "inactive" ? (
                                            <Fab size="small" color="primary" aria-label="Start Recording" onClick={startRecording}>
                                                <FiberManualRecordRoundedIcon />
                                            </Fab>
                                        ) : null}
                                        {permission && recordingStatus === "inactive" ? (
                                            <Typography color="primary">Start Recording</Typography>
                                        ) : null}
                                    </div>

                                    <div className={styles.voiceRecording}>
                                        {recordingStatus === "recording" ? (
                                            <Fab size="small" color="success" aria-label="Stop Recording" onClick={stopRecording}>
                                                <GraphicEqRoundedIcon />
                                            </Fab>
                                        ) : null}

                                        {recordingStatus === "recording" ? (
                                            <Chip label="01" variant="outlined" />
                                        ) : null}
                                        {recordingStatus === "recording" ? (
                                            <Typography color="success">Stop Recording</Typography>
                                        ) : null}
                                    </div>

                                    <div className={styles.recordedAudio}>
                                        {audio ? (
                                            <div>
                                                <audio
                                                    src={audio}
                                                    controls
                                                    controlsList="nodownload"
                                                ></audio>
                                                {/* <a download="recording.mp3" href={audio} type="audio/mpeg" >
                                                            Download Recording
                                                        </a> */}
                                            </div>
                                        ) : null}
                                        {audio ? (
                                            <Button
                                                disabled={!audio}
                                                onClick={uploadAudio}
                                                size="small"
                                                sx={{ paddingInline: "0", minWidth: "auto" }}
                                            >
                                                <DeleteForeverIcon color="error" />
                                            </Button>

                                        ) : null}
                                        {audio ? (
                                            <Button
                                                disabled={!audio}
                                                variant="contained"
                                                onClick={uploadAudio}
                                                size="small"
                                                sx={{ width: "100px", fontWeight: "600" }}
                                            >
                                                {loadingOnMicUpload ? (
                                                    <CircularProgress size="1.5rem" sx={{ color: " white" }} />
                                                ) : (
                                                    "Upload"
                                                )}
                                            </Button>

                                        ) : null}
                                    </div>
                                </div>
                                <div>
                                    <Typography variant='subtitle2'>Upload Images</Typography>
                                    <SupportAttachments
                                        onChangeFile={onChangeFile}
                                        uploadFiles={uploadFiles}
                                        files={files}
                                        loadingOnImagesUpload={loadingOnImagesUpload}
                                    />
                                </div>
                                <div>
                                    <FooterActionButtons editLog={editSupport} />
                                    <AlertComponent
                                        alertMessage={alertMessage}
                                        alertType={alertType}
                                        setAlertMessage={setAlertMessage}
                                    />
                                </div>
                            </div>
                        </Grid>

                    </Grid>
                </div> : ""}

        </div >
    )
}


export default EditSupportForm;
