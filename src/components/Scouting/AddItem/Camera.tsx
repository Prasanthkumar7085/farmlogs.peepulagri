// src/components/Camera.js
import React, { useState, useRef, useEffect } from 'react';
import styles from "./camera.module.css";
import { Button, IconButton, Tooltip } from '@mui/material';
import CameraIcon from '@mui/icons-material/Camera';
import VideocamIcon from '@mui/icons-material/Videocam';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import ClearIcon from '@mui/icons-material/Clear';
function Camera({ openCamera, captureCloseCamera, captureCameraVedio }: any) {
    const [stream, setStream] = useState<any>(null);
    const [mediaRecorder, setMediaRecorder] = useState<any>(null);
    const videoRef: any = useRef(null);
    const chunks: any = useRef([]);

    const [capturedImageUrl, setCapturedImageUrl] = useState<any>(null);
    const [capturedVideoUrl, setCapturedVideoUrl] = useState<any>(null);
    const [captureVedioBlob, setCaptureVedioBlob] = useState<any>()


    useEffect(() => {
        if (openCamera == true) {
            startCamera()
        }
    }, [])

    const startCamera = async () => {
        setCapturedImageUrl(null)
        setCapturedVideoUrl(null)
        try {
            const constraints = {
                video: { facingMode: { exact: 'environment' } }, // Specify the back camera
            };
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
            // constraints
            setStream(mediaStream);
            videoRef.current.srcObject = mediaStream;
        } catch (error) {
            console.error('Error accessing camera:', error);
        }
    };

    const stopCamera = () => {
        console.log(capturedVideoUrl)
        if (stream) {
            stream.getTracks().forEach((track: any) => track.stop());
            setStream(null);
        }
        if (mediaRecorder) {
            mediaRecorder.stop();
            setMediaRecorder(null);
        }
    };

    const startRecording = () => {
        if (stream) {
            const recorder = new MediaRecorder(stream);
            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunks.current.push(event.data);
                }
            };
            recorder.onstop = () => {
                const videoBlob = new Blob(chunks.current, { type: 'video/webm' });
                chunks.current = [];
                const videoUrl = URL.createObjectURL(videoBlob);
                setCapturedVideoUrl(videoUrl)
                setCaptureVedioBlob(videoBlob)
                // You can now use `videoUrl` to display or save the recorded video.
            };
            recorder.start();
            setMediaRecorder(recorder);
        }
    };

    const stopRecording = () => {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
        }
        videoRef.current.srcObject = null;


    };

    const capturePhoto = () => {
        if (stream) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx: any = canvas.getContext('2d');
            ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            const imageUrl = canvas.toDataURL('image/jpeg');
            stopCamera()
            setCapturedImageUrl(imageUrl);
            // You can now use `imageUrl` to display or save the captured image.
        }
    };

    return (
        <div >
            {!capturedImageUrl && !capturedVideoUrl ?
                <div style={{
                    position: "relative",
                    width: "100%",
                    // paddingBottom: "54.77%",
                }}>
                    <video ref={videoRef} autoPlay muted style={{

                        width: "100%",
                        height: "70vh"
                    }} />
                </div> : ""
            }

            <div className={styles.capturingIcons}>
                {stream && !capturedImageUrl && !capturedVideoUrl ? (
                    <>
                        {mediaRecorder?.state !== 'recording' ? <IconButton onClick={stopCamera}>
                            < ClearIcon sx={{ fontSize: "2.5rem", color: "#ff0000" }} />
                        </IconButton> : ""}

                        {mediaRecorder?.state !== 'recording' ? <IconButton onClick={capturePhoto}><CameraIcon sx={{ fontSize: "2.5rem", color: "#2e58c4" }} /></IconButton> : ""}
                    </>
                ) : (
                    <IconButton onClick={startCamera}><CameraAltIcon sx={{ fontSize: "2.5rem", color: "#2e58c4" }} /></IconButton>
                )}
                {mediaRecorder && mediaRecorder.state === 'recording' ? (
                    <Tooltip title="Stop Recording">
                        <IconButton onClick={stopRecording}> < ClearIcon sx={{ fontSize: "2.5rem", color: "#ff0000" }} /></IconButton></Tooltip>
                ) : (
                    <IconButton onClick={startRecording}><VideocamIcon sx={{ fontSize: "3rem", color: "#2e58c4" }} /></IconButton>
                )}
            </div>

            {
                capturedImageUrl &&
                <div>
                    <img src={capturedImageUrl} alt="Captured" style={{ width: "100%" }} />
                    <div className={styles.ofterCaptureBtns}>
                        <button className={styles.retakeBtn} onClick={startCamera}>Retake</button>
                        <button className={styles.uploadBtn} onClick={() => {
                            captureCloseCamera(false, capturedImageUrl)
                            stopCamera()
                        }}>Upload</button>
                    </div>
                </div>
            }



            {
                capturedVideoUrl && (
                    <div>
                        <video controls>
                            <source src={capturedVideoUrl} type="video/webm" />
                        </video>
                        <div className={styles.ofterCaptureBtns}>
                            <button className={styles.retakeBtn} onClick={startCamera}>Retake</button>
                            <button className={styles.uploadBtn} onClick={() => {
                                captureCameraVedio(false, captureVedioBlob)
                                stopCamera()
                            }}>Upload</button>
                        </div>
                    </div>
                )
            }

        </div >
    );
}

export default Camera;
