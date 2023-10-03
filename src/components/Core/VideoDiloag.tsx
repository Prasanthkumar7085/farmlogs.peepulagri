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


const VideoDialog = ({ open, onClose, mediaArray, index }: any) => {

    const [currentIndex, setCurrentIndex] = useState(0);
    const [imageArray, setImageArray] = useState<any[]>([]);

    useEffect(() => {
        if (open) {
            const newArray = [].concat(
                ...mediaArray?.map((item: any) =>
                    item.attachments.map((attachment: any) => ({
                        type: attachment.type,
                        src: attachment.url
                    }))
                )
            );
            console.log(newArray)
            setImageArray(newArray);
            if (index) {
                let arryindex = newArray.findIndex((item: any) => item.src == index)
                setCurrentIndex(arryindex)
            }
        }

    }, [open, mediaArray]);

    const playNext = () => {
        const nextIndex = (currentIndex + 1) % imageArray.length;
        setCurrentIndex(nextIndex);
    };

    const playPrevious = () => {
        const prevIndex = currentIndex === 0 ? imageArray.length - 1 : currentIndex - 1;
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
                {imageArray.length > 0 && (
                    <div>
                        {imageArray[currentIndex]?.type?.slice(0, 4) == 'vide' ? (
                            <video controls width="100%" height="auto" autoPlay key={currentIndex}>
                                <source src={imageArray[currentIndex]?.src} type={imageArray[currentIndex]?.type} />
                                Your browser does not support the video tag.
                            </video>
                        ) : (
                            <img
                                src={imageArray[currentIndex]?.src} // Change this to use the imageArray
                                alt={`Image ${currentIndex + 1}`}
                                style={{ maxWidth: '100%' }}
                            />
                        )}
                        <Typography variant="caption" display="block" align="center">
                            {currentIndex + 1} of {imageArray.length}
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

export default VideoDialog;
