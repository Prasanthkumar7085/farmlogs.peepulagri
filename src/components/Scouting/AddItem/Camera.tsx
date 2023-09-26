import React, { useState, useRef, useEffect } from 'react';

const CameraCapture = ({ openCamera, captureCloseCamera }: any) => {
    const videoRef: any = useRef(null);
    const canvasRef: any = useRef(null);
    const [photoData, setPhotoData] = useState(null);

    useEffect(() => {
        if (openCamera == true) {
            startCamera()
        }
    }, [])

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoRef.current.srcObject = stream;
        } catch (error) {
            console.error('Error accessing camera:', error);
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

    return (
        <div>
            <div >
                <video ref={videoRef} autoPlay style={{ width: "100%", height: "100vh" }} />
            </div>

            <div >
                <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>
            <button onClick={takePhoto}>Take Photo</button>
            <button onClick={() => {
                captureCloseCamera(false)
                location.reload()
            }}>Close</button>

            {photoData && (
                <div>
                    <h2>Captured Photo</h2>
                    <img src={photoData} alt="Captured" />
                </div>
            )}
        </div>
    );
};

export default CameraCapture;
