import timePipe from '@/pipes/timePipe';
import CloseIcon from '@mui/icons-material/Close';
import {
  Chip,
  Dialog,
  DialogContent,
  IconButton,
  Typography
} from '@mui/material';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import ReactPanZoom from "react-image-pan-zoom-rotate";
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { useSwipeable } from 'react-swipeable';
import styles from "./view-logs-container.module.css";
import SellIcon from '@mui/icons-material/Sell';
import { Markup } from "interweave";

const VideoDialogForScout = ({ open, onClose, mediaArray, index, data, captureImageDilogOptions, captureSlideImagesIndex }: any) => {

  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1); // Default zoom level
  const [description, setDescription] = useState<any>()
  const [isZoom, setISZoom] = useState<any>()
  const [showMore, setShowMore] = useState<any>(false)



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
        "& .MuiPaper-root": {
          margin: "0 !important",
          width: "100%",
          background: "#ffffff00",
          boxShadow: "none !important",
          height: "calc(100% - 10px)",
          maxWidth: "400px !important",
          maxHeight: "100vh",
        },
        "& .MuiTypography-root": {
          color: "#fff",
        },
        "& .MuiDialogContent-root": {
          // position: "relative !important",
          padding: "0rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        },
        "& .MuiDialogActions-root ": {
          justifyContent: "center !important",
        },
      }}
    >
      <IconButton onClick={handleClose} sx={{ width: "100%", display: "flex", justifyContent: "flex-end !important" }}>
        <CloseIcon sx={{ color: "#fff", height: "32px", width: "32px" }} />
      </IconButton>
      <DialogContent>
        <div style={{ width: "100%" }}>
          <Carousel
            selectedItem={currentIndex}
            onChange={(index) => {
              console.log("llkjlhgffdzxc")
              // captureImageDilogOptions(mediaArray[index]);
              setCurrentIndex(index);
              captureSlideImagesIndex(index);
            }}
            swipeable={true}
          >
            {mediaArray?.length > 0 &&
              mediaArray.map((item: any, index: any) => (
                <div className={styles.scoutDailogImg} key={index}>
                  {item.type?.includes("video") ? (
                    <video
                      controls
                      width="100%"
                      height="auto"
                      autoPlay
                      key={index}
                    >
                      <source src={item.url} type={item.type} />
                      Your browser does not support the video tag.
                    </video>
                  ) : item.type?.includes("application") ? (
                    <iframe
                      src={item.url}
                      width="100%"
                      height="100%"
                      title={`iframe-${index}`}
                    />
                  ) : (
                    <>
                      {isZoom ? (
                        <ReactPanZoom
                          image={item.url}
                          alt={`Image alt text ${index}`}
                        />
                      ) : (
                        <img
                          className="zoom-image"
                          src={item.url}
                          alt={`Image ${index + 1}`}
                          style={{ transform: `scale(${zoomLevel})` }}
                          onClick={zoomIn}
                        />
                      )}
                    </>
                  )}
                </div>
              ))}
          </Carousel>
        </div>
      </DialogContent>

      {/* <Typography variant="caption" display="block" align="center">
                    {currentIndex + 1} of {mediaArray?.length}
                </Typography> */}
      {mediaArray?.length && (
        <div className={styles.cropDetailsBlock}>
          <Typography variant="caption" display="block" align="left">
            {timePipe(mediaArray[currentIndex]?.time, "DD-MM-YYYY hh-mm a")}
          </Typography>
          <div className={styles.tagNames}>
            {mediaArray[currentIndex]?.tags.length &&
              <Chip className={styles.tagsLabel} icon={<SellIcon sx={{ fontSize: 15 }} />} label="Tags" variant="outlined" />}
            {mediaArray[currentIndex]?.tags.map((tag: any, index: number) => {
              return (
                <Typography align="left" key={index}>
                  {"#" + tag}
                </Typography>
              );
            })}
          </div>
          {showMore == true ? (
            <Typography className={styles.findingsText}>
              <Markup content={mediaArray[currentIndex]?.description} />
              <span
                style={{ cursor: "pointer", fontWeight: "600" }}
                onClick={() => {
                  setShowMore(false);
                }}
              >
                Show Less
              </span>
            </Typography>
          ) : (
            <Typography className={styles.findingsText}>
              {mediaArray[currentIndex]?.description?.length > 100
                ? <Markup content={mediaArray[currentIndex]?.description.slice(0, 100) + "...."} />
                : <Markup content={mediaArray[currentIndex]?.description} />}
              {mediaArray[currentIndex]?.description?.length > 100 ? (
                <span
                  style={{ fontWeight: "600", cursor: "pointer" }}
                  onClick={() => {
                    setShowMore(true);
                  }}
                >
                  Show More
                </span>
              ) : (
                ""
              )}
            </Typography>
          )}

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <IconButton
              onClick={() => {
                captureImageDilogOptions("tag");
              }}
            >
              <Image
                src={"/add-tag-icon.svg"}
                width={20}
                height={20}
                alt="pp"
              />
            </IconButton>
            <IconButton onClick={() => {
              captureImageDilogOptions("comments")
            }}>
              <Image
                src={"/comment-white-icon.svg"}
                width={20}
                height={20}
                alt="pp"
              />
            </IconButton>

          </div>
        </div>
      )}
    </Dialog>
  );
};

export default VideoDialogForScout;
