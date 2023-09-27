import React, { useState, useRef, useEffect } from 'react';

const CameraCapture = ({ openCamera, captureCloseCamera }: any) => {
    const videoRef: any = useRef(null);
    const canvasRef: any = useRef(null);
    const [photoData, setPhotoData] = useState(null);
    let start = openCamera;
    let mediaStream: MediaStream | null = null; // Store the media stream


    useEffect(() => {
        if (openCamera == true) {
            startCamera()
        }
        else {
            stopCamera(); // Stop the camera when it's turned off
        }
    }, [openCamera])

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoRef.current.srcObject = stream;
            mediaStream = stream; // Store the media stream reference
        } catch (error) {
            console.error('Error accessing camera:', error);
        }
    };
    const stopCamera = () => {

        if (mediaStream) {
            mediaStream.getTracks().forEach((track) => {
                track.stop(); // Stop all tracks in the media stream
            });
            mediaStream = null; // Clear the media stream reference
            videoRef.current.srcObject = null; // Set the video element's srcObject to null

        }
    };

    const takePhoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert the canvas image to data URL
        const dataURL = canvas.toDataURL('image/jpeg');
        setPhotoData(dataURL);
    };
    const handleCloseCamera = () => {
        if (openCamera) {
            stopCamera(); // Stop the camera when closing
            captureCloseCamera(false, photoData)

        }
    };

    return (
        <div>
            {openCamera ?
                <video ref={videoRef} autoPlay style={{ width: "100%", height: "100vh" }} />
                : ""}

            <div >
                <canvas ref={start == true ? canvasRef : null} style={{ display: 'none' }} />
            </div>
            {photoData ?
                <button onClick={() => {
                    captureCloseCamera(false, photoData)
                    start = false
                }}>Upload</button> :
                <button onClick={takePhoto}>Take Photo</button>
            }

            <button onClick={handleCloseCamera}>Close</button>


            {
                photoData && (
                    <div>
                        <h2>Captured Photo</h2>
                        <img src={photoData} alt="Captured" />
                    </div>
                )
            }
        </div >
    );
};

export default CameraCapture;
