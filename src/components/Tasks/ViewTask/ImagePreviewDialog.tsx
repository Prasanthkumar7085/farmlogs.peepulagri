import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  IconButton,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import styles from "./image-preview.module.css";
import CloseIcon from "@mui/icons-material/Close";
import { useSwipeable } from "react-swipeable";

const ImagePreviewDialog = ({
  open,
  onClose,
  mediaArray,
  index,
  setImagePreviewIndex,
}: any) => {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [indexForThumbnail, setIndexForThumnails] = useState(-1);

  useEffect(() => {
    setCurrentIndex(index);
  }, [index]);

  const playNext = () => {
    document
      .getElementById(`${currentIndex + 1}`)
      ?.scrollIntoView({ behavior: "smooth" });

    const nextIndex = currentIndex + 1;

    if (nextIndex < mediaArray?.length) {
      setCurrentIndex(nextIndex);
    }
  };

  const playPrevious = () => {
    document
      .getElementById(`${currentIndex - 1}`)
      ?.scrollIntoView({ behavior: "smooth" });

    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleClose = () => {
    setImagePreviewIndex(-1);
    if (index) {
      setCurrentIndex(index);
      onClose();
    } else {
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
  };

  // Define swipe handlers
  const handlers = useSwipeable({
    onSwipedLeft: playNext,
    onSwipedRight: playPrevious,
  });

  return (
    <Dialog
      autoFocus
      onKeyDown={getKey}
      open={open}
      fullWidth
      sx={{
        background: "#0000008f",
        "& .MuiPaper-root": {
          margin: "0 !important",
          width: "95%",
          background: "#ffffff00",
          boxShadow: "none !important",
          height: "100%",
          maxWidth: "100%",
        },
        "& .MuiTypography-root": {
          textAlign: "right",
          color: "#fff",
        },
        "& .MuiDialogContent-root": {
          // position: "relative !important",
          padding: "0rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        },
        "& .MuiDialogActions-root ": {
          justifyContent: "center !important",
        },
      }}
    >
      <DialogTitle>
        <IconButton onClick={handleClose} sx={{ padding: "0" }}>
          <CloseIcon sx={{ color: "#fff" }} />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <div {...handlers} style={{ width: "95%" }}>
          <IconButton
            className={styles.positionLeftImg}
            onClick={playPrevious}
            disabled={mediaArray?.length <= 1}
          >
            <NavigateBeforeIcon sx={{ color: "#fff" }} />
          </IconButton>
          {mediaArray?.length > 0 && (
            <div className={styles.scoutDailogImg}>
              {mediaArray[currentIndex]?.type?.includes("video") ? (
                <video
                  controls
                  width="100%"
                  height="auto"
                  autoPlay
                  key={currentIndex}
                >
                  <source
                    src={mediaArray[currentIndex]?.url}
                    type={mediaArray[currentIndex]?.type}
                  />
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
          <IconButton
            className={styles.positionRightImg}
            onClick={playNext}
            disabled={mediaArray?.length <= 1}
          >
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
            overflow: "scroll",
            justifyContent: "center",
          }}
        >
          {mediaArray?.length
            ? mediaArray?.map((item: any, index: any) => {
                return (
                  <div
                    id={`${index}`}
                    autoFocus={index == currentIndex}
                    key={index}
                    onClick={() => {
                      setCurrentIndex(index);
                    }}
                    style={{ cursor: "pointer" }}
                    className={
                      index == currentIndex
                        ? styles.activeImage
                        : styles.inactiveImage
                    }
                  >
                    {!item?.type?.includes("video") ? (
                      <img
                        src={item?.url} // Change this to use the mediaArray
                        alt={`Image ${index + 1}`}
                        height={"100px"}
                        width={"100px"}
                      />
                    ) : (
                      <img
                        src={"/videoimg.png"} // Change this to use the mediaArray
                        alt={`Image ${index + 1}`}
                        height={"100px"}
                        width={"100px"}
                      />
                    )}
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
    </Dialog>
  );
};

export default ImagePreviewDialog;
