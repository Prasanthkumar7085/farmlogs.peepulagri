import { useEffect, useRef, useState } from "react";
import styles from "./addSupportForm.module.css";
import { Button, Chip, CircularProgress, Fab, Typography } from "@mui/material";
import { useSelector } from "react-redux";

// Icons
import KeyboardVoiceRoundedIcon from '@mui/icons-material/KeyboardVoiceRounded';
import FiberManualRecordRoundedIcon from '@mui/icons-material/FiberManualRecordRounded';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import uploadFileToS3 from "../../../../lib/services/LogsService/uploadFileToS3InLog";
import addAttachmentsService from "../../../../lib/services/SupportService/addAttachmentsService";
import AlertComponent from "@/components/Core/AlertComponent";

const SupportRecording = ({ setAudioDetailsAfterUpload }: any) => {

    const accessToken = useSelector((state: any) => state.auth.userDetails?.access_token);


    const [permission, setPermission] = useState(false);
    const mediaRecorder = useRef<any>(null);
    const [recordingStatus, setRecordingStatus] = useState("inactive");
    const [stream, setStream] = useState<any>(null);
    const [audioChunks, setAudioChunks] = useState([]);
    const [audio, setAudio] = useState<any>(null);

    const [alertMessage, setAlertMessage] = useState<string>("");
    const [alertType, setAlertType] = useState<boolean>(false);
    const [loadingOnMicUpload, setLoadingOnMicUpload] = useState<boolean>(false);


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

    useEffect(() => {
        if (!permission) {
            getMicrophonePermission();
        }
    }, []);


    const startRecording = async () => {
        restartTimer();
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
        resetTimer();
        setIsRunning(false);
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


    const removeAudio = () => {
        setAudio(null);
        setAudioDetailsAfterUpload({});
    }

    const [timeInSeconds, setTimeInSeconds] = useState(1);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        let timerInterval: any;

        if (isRunning && timeInSeconds >= 0) {
            timerInterval = setInterval(() => {
                setTimeInSeconds((prevTime) => prevTime + 1);
            }, 1000);
        } else if (timeInSeconds === 0) {
            clearInterval(timerInterval);
        }

        return () => clearInterval(timerInterval);
    }, [isRunning, timeInSeconds]);

    const toggleTimer = () => {
        setIsRunning((prevState) => !prevState);
    };

    const resetTimer = () => {
        setTimeInSeconds(0);
        setIsRunning(false);
    };
    const restartTimer = () => {
        setTimeInSeconds(0);
        setIsRunning(true);
    };

    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;



    return (
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

            <div style={{ display: "flex", gap: "10px" }}>
                <div className={styles.voiceRecording}>
                    {recordingStatus === "recording" ? (
                        isRunning ? <Fab size="small" color="success" aria-label="Stop Recording" onClick={toggleTimer}>
                            <PauseIcon />
                        </Fab> :
                            <Fab size="small" color="primary" aria-label="Stop Recording" onClick={toggleTimer}>
                                <PlayArrowIcon />
                            </Fab>
                    ) : null}
                </div>

                <div className={styles.voiceRecording}>
                    {recordingStatus === "recording" ? (
                        <Fab size="small" color="error" aria-label="Stop Recording" onClick={stopRecording}>
                            <StopIcon />
                        </Fab>
                    ) : null}

                    {recordingStatus === "recording" ? (
                        <Chip label={formattedTime} variant="outlined" />
                    ) : null}
                    {recordingStatus === "recording" ? (
                        <Typography color="success">Stop Recording</Typography>
                    ) : null}
                </div>
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
                        onClick={removeAudio}
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
            <AlertComponent
                alertMessage={alertMessage}
                alertType={alertType}
                setAlertMessage={setAlertMessage}
            />
        </div>
    )
}

export default SupportRecording;