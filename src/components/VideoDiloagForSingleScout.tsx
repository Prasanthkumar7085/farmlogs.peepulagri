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
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>Media Dialog</DialogTitle>
            <DialogContent>
                {mediaArray.length > 0 && (
                    <div>
                        {mediaArray[currentIndex]?.type?.slice(0, 4) == 'vide' ? (
                            <video controls width="100%" height="auto" autoPlay key={currentIndex}>
                                <source src={mediaArray[currentIndex]?.url} type={mediaArray[currentIndex]?.type} />
                                Your browser does not support the video tag.
                            </video>
                        ) : (
                            <img
                                src={mediaArray[currentIndex]?.url} // Change this to use the mediaArray
                                alt={`Image ${currentIndex + 1}`}
                                style={{ maxWidth: '100%' }}
                            />
                        )}
                        <Typography variant="caption" display="block" align="center">
                            {currentIndex + 1} of {mediaArray.length}
                        </Typography>
                    </div>
                )}
            </DialogContent>
            <DialogActions>
                <IconButton onClick={playPrevious} disabled={mediaArray.length <= 1}>
                    <NavigateBeforeIcon />
                </IconButton>
                <IconButton onClick={playNext} disabled={mediaArray.length <= 1}>
                    <NavigateNextIcon />
                </IconButton>
                <Button onClick={handleClose} variant="outlined" color="secondary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default VideoDialogForScout;
