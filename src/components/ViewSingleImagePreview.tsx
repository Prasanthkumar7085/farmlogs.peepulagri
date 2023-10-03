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

const ViewSingleImagePreview = ({ open, onClose, media, index }: any) => {

    // console.log(media.url);

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        setCurrentIndex(index);
    }, [index]);



    const handleClose = () => {
        setCurrentIndex(-1);
        onClose();
    };

    const getKey = (e: any) => {

        if (e.keyCode == 27) {
            handleClose();
        }

    }
    return (
        <Dialog
            autoFocus
            onKeyDown={getKey}
            open={open}
            onClose={handleClose}
            fullWidth
            sx={{
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
                {/* <IconButton className={styles.positionLeftImg} onClick={playPrevious} disabled={mediaArray.length <= 1}>
                    <NavigateBeforeIcon sx={{ color: "#fff" }} />
                </IconButton> */}
                {media && (
                    <div className={styles.scoutDailogImg}>
                        {media?.type?.includes('video') ? (
                            <video controls width="100%" height="auto" autoPlay key={currentIndex}>
                                <source src={media?.url} type={media?.type} />
                                Your browser does not support the video tag.
                            </video>
                        ) : (
                            <img
                                loading='lazy'
                                src={media?.url} // Change this to use the mediaArray
                                alt={`Image ${currentIndex + 1}`}
                            />
                        )}

                    </div>
                )}
                {/* <IconButton className={styles.positionRightImg} onClick={playNext} disabled={mediaArray.length <= 1}>
                    <NavigateNextIcon sx={{ color: "#fff" }} />
                </IconButton> */}
            </DialogContent>
            {/* <DialogActions>
                <Typography variant="caption" display="block" align="center">
                    {currentIndex + 1} of {mediaArray.length}
                </Typography>
            </DialogActions> */}
        </Dialog>
    );
};

export default ViewSingleImagePreview;
