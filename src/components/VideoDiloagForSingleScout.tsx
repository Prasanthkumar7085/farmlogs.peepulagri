import React, { useEffect, useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
    IconButton,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import styles from "./view-logs-container.module.css"
import CloseIcon from '@mui/icons-material/Close';
import { useSwipeable } from 'react-swipeable';
import ReactPanZoom from "react-image-pan-zoom-rotate";

const VideoDialogForScout = ({ open, onClose, mediaArray, index, data }: any) => {

    const [currentIndex, setCurrentIndex] = useState(0);
    const [zoomLevel, setZoomLevel] = useState(1); // Default zoom level
    const [description, setDescription] = useState<any>()
    const [isZoom, setISZoom] = useState<any>()


    useEffect(() => {
        setCurrentIndex(index);

    }, [index])


    const playNext = () => {
        document
            .getElementById(`${currentIndex - 1}`)
            ?.scrollIntoView({ behavior: "smooth" });
        const nextIndex = (currentIndex + 1) % mediaArray?.length;
        setCurrentIndex(nextIndex);
    };

    const playPrevious = () => {
        document
            .getElementById(`${currentIndex - 1}`)
            ?.scrollIntoView({ behavior: "smooth" });
        const prevIndex = currentIndex === 0 ? mediaArray.length - 1 : currentIndex - 1;
        setCurrentIndex(prevIndex);
    };

    const handleClose = () => {
        if (index) {
            setCurrentIndex(index);
            onClose();

        }
        else {
            setCurrentIndex(0);
            onClose();

        }
    };

    const getKey = (e: any) => {

        if (e.keyCode == 37) {
            playPrevious();
        } else if (e.keyCode == 39) {
            playNext();
        } else if (e.keyCode == 27) {
            handleClose();
        }

    }

    // Define swipe handlers
    const handlers = useSwipeable({
        onSwipedLeft: playNext,
        onSwipedRight: playPrevious,
    });


    const handleZoomIn = () => {
        setZoomLevel(zoomLevel + 0.1); // Increase the zoom level
    };

    const handleZoomOut = () => {
        setZoomLevel(Math.max(1, zoomLevel - 0.1)); // Decrease the zoom level, with a minimum of 1
    };

    const zoomIn = () => {
        setISZoom(true)

    };

    const zoomOut = () => {
        if (zoomLevel > 0.1) {
            const img: any = document.querySelector('.zoom-image');
            if (img) {
                img.style.transform = `scale(${zoomLevel - 0.1})`;
                setZoomLevel(zoomLevel - 0.1);
            }
        }
    };

    return (
        <Dialog
            autoFocus
            onKeyDown={getKey}
            open={open}
            fullWidth
            sx={{
                background: "#0000008f",
                '& .MuiPaper-root': {
                    margin: "0 !important",
                    width: "95%",
                    background: "#ffffff00",
                    boxShadow: "none !important",
                    height: "calc(100% - 140px)",
                    maxWidth: "400px !important"
                },
                '& .MuiTypography-root': {
                    textAlign: "right",
                    color: "#fff"
                },
                '& .MuiDialogContent-root': {

                    // position: "relative !important",
                    padding: "0rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden"
                },
                '& .MuiDialogActions-root ': {
                    justifyContent: "center !important"
                }
            }}>
            <IconButton onClick={handleClose} sx={{ padding: "0" }}>
                <CloseIcon sx={{ color: "#fff" }} />
            </IconButton>
            <DialogTitle>
            </DialogTitle>
            <DialogContent>
                <div {...handlers} style={{ width: "100%" }}>

                    <IconButton className={styles.positionLeftImg} onClick={playPrevious} disabled={mediaArray?.length <= 1}>
                        <NavigateBeforeIcon sx={{ color: "#fff" }} />

                    </IconButton>
                    {mediaArray?.length > 0 && (
                        <div className={styles.scoutDailogImg}>
                            {mediaArray[currentIndex]?.type?.includes('video') ? (
                                <video controls width="100%" height="auto" autoPlay key={currentIndex}>
                                    <source src={mediaArray[currentIndex]?.url} type={mediaArray[currentIndex]?.type} />
                                    Your browser does not support the video tag.
                                </video>
                            ) : mediaArray[currentIndex]?.type?.includes('application') ?
                                <iframe src={mediaArray[currentIndex]?.url} width="100%" height="100%"></iframe>

                                : (
                                    <>

                                        {isZoom ?
                                            <ReactPanZoom
                                                image={mediaArray[currentIndex]?.url}
                                                alt="Image alt text"
                                            /> :
                                            <img
                                                className="zoom-image"
                                                src={mediaArray[currentIndex]?.url}
                                                alt={`Image ${currentIndex + 1}`}
                                                style={{ transform: `scale(${zoomLevel})` }}
                                                onClick={zoomIn}
                                            />}
                                    </>
                                )}

                        </div>
                    )}
                    <IconButton className={styles.positionRightImg} onClick={playNext} disabled={mediaArray?.length <= 1}>
                        <NavigateNextIcon sx={{ color: "#fff" }} />
                    </IconButton>

                </div>

            </DialogContent>
            <div
                style={{
                    width: "100%",
                    justifyContent: "center",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        gap: "10px",
                        width: "100%",
                        overflow: "auto",
                    }}
                >
                    {mediaArray?.length
                        ? mediaArray?.map((item: any, index: any) => {
                            return (
                                <div
                                    key={index}
                                    id={`${index}`}
                                    autoFocus={index == currentIndex}
                                    onClick={() => setCurrentIndex(index)}
                                    style={{ cursor: "pointer" }}
                                    className={
                                        index == currentIndex
                                            ? styles.activeImage
                                            : styles.inactiveImage
                                    }
                                >
                                    {item.type.includes("video") ?
                                        <img
                                            src="/videoimg.png"
                                            alt={`Image ${index + 1}`}
                                            height={"100px"}
                                            width={"100px"}
                                        />
                                        :
                                        item.type.includes("image") ?
                                            <img
                                                src={item?.url} // Change this to use the mediaArray
                                                alt={`Image ${index + 1}`}
                                                height={"100px"}
                                                width={"100px"}
                                            />
                                            : <img
                                                src="/pdf-icon.png"
                                                alt={`Image ${index + 1}`}
                                                height={"80px"}
                                                width={"100px"}
                                            />}
                                </div>
                            );
                        })
                        : ""}
                </div>
            </div>
            <DialogActions>

                <Typography variant="caption" display="block" align="center">
                    {currentIndex + 1} of {mediaArray?.length}
                </Typography>

            </DialogActions>
            {data?.description ?
                <div style={{ display: "block" }}>
                    <Typography variant='caption'><span style={{ color: "red" }}>Description:-</span>{data?.description}</Typography>
                </div> : ""}
        </Dialog>
    );
};

export default VideoDialogForScout;
