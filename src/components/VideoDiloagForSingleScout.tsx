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

const VideoDialogForScout = ({ open, onClose, mediaArray, index }: any) => {

    console.log(index)
    const [currentIndex, setCurrentIndex] = useState(0);




    const playNext = () => {
        const nextIndex = (currentIndex + 1) % mediaArray.length;
        setCurrentIndex(nextIndex);
    };

    const playPrevious = () => {
        const prevIndex = currentIndex === 0 ? mediaArray.length - 1 : currentIndex - 1;
        setCurrentIndex(prevIndex);
    };

    const handleClose = () => {
        setCurrentIndex(0);
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth sx={{
            background: "#0000008f",
            '& .MuiPaper-root': {
                margin: "0 !important",
                width: "95%",
                background: "#ffffff00",
                boxShadow: "none !important",
                height: "calc(100% - 140px)"
            },
            '& .MuiTypography-root': {
                textAlign: "right",
                color: "#fff"
            },
            '& .MuiDialogContent-root': {
                padding: "1rem"
            },
            '& .MuiDialogActions-root ': {
                justifyContent: "center !important"
            }
        }}>
            <DialogTitle>
                <IconButton onClick={handleClose} sx={{ padding: "0" }}>
                    <CloseIcon sx={{ color: "#fff" }} />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <IconButton className={styles.positionLeftImg} onClick={playPrevious} disabled={mediaArray.length <= 1}>
                    <NavigateBeforeIcon sx={{ color: "#fff" }} />
                </IconButton>
                {mediaArray.length > 0 && (
                    <div className={styles.scoutDailogImg}>
                        {mediaArray[currentIndex]?.type?.slice(0, 4) == 'vide' ? (
                            <video controls width="100%" height="auto" autoPlay key={currentIndex}>
                                <source src={mediaArray[currentIndex]?.url} type={mediaArray[currentIndex]?.type} />
                                Your browser does not support the video tag.
                            </video>
                        ) : (
                            <img
                                src={mediaArray[currentIndex]?.url} // Change this to use the mediaArray
                                alt={`Image ${currentIndex + 1}`}
                            />
                        )}

                    </div>
                )}
                <IconButton className={styles.positionRightImg} onClick={playNext} disabled={mediaArray.length <= 1}>
                    <NavigateNextIcon sx={{ color: "#fff" }} />
                </IconButton>
            </DialogContent>
            <DialogActions>
                <Typography variant="caption" display="block" align="center">
                    {currentIndex + 1} of {mediaArray.length}
                </Typography>



            </DialogActions>
        </Dialog>
    );
};

export default VideoDialogForScout;
