import React, { useState, useRef } from 'react';

const CameraCapture = () => {
    const videoRef: any = useRef(null);
    const canvasRef: any = useRef(null);
    const [photoData, setPhotoData] = useState(null);

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
            <button onClick={startCamera}>Start Camera</button>
            <button onClick={takePhoto}>Take Photo</button>
            <div>
                <video ref={videoRef} autoPlay />
            </div>

            <div>
                <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>
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
