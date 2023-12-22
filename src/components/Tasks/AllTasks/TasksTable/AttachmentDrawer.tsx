
import { removeTheAttachementsFilesFromStore } from "@/Redux/Modules/Conversations";
import timePipe from "@/pipes/timePipe";
import { Close } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import { Button, Dialog, IconButton, LinearProgress, Typography } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "../../TaskComments/Comments.module.css";
import getImageSrcUrl from "@/pipes/getImageSrcUrl";
import { Toaster, toast } from "sonner";
import ImageComponent from "@/components/Core/ImageComponent";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import deleteTaskAttachmentService from "../../../../../lib/services/TasksService/deleteTaskAttachmentService";
import { useRouter } from "next/router";

const AttachmentDrawerTaskmodule = ({
  attachmentDrawerClose,
  rowDetails,
  attachmentdrawer,
  direction,
}: any) => {
  const dispatch = useDispatch();
  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );
  const router = useRouter()

  const [loading, setLoading] = useState<any>();
  const [attachmentData, setAttachmentData] = useState<any>();
  const [singleImageView, setSingleImageView] = useState<any>(false);
  const [imageid, setImageId] = useState<any>();
  const [selectedItems, setSelectedItems] = useState<any>([]);
  const [tempImages, setTempImages] = useState(selectedItems);
  const [longpressActive, setLongPressActive] = useState<any>(false);
  const [checkBoxOpen, setCheckBoxOpen] = useState<any>(false);


  function groupByDate(array: Array<any>) {
    const groupedByDate = array.reduce((result, obj) => {
      const dateKey = obj.createdAt.split("T")[0]; // Extract the date from the timestamp
      if (!result[dateKey]) {
        result[dateKey] = [];
      }
      result[dateKey].push(obj);
      return result;
    }, {});

    return Object.values(groupedByDate).reverse();
  }

  useEffect(() => {
    setTempImages(selectedItems);
  }, [selectedItems]);

  const getAllAttachments = async () => {
    setLoading(true);
    let options = {
      method: "GET",
      headers: new Headers({
        "content-type": "application/json",
        authorization: accessToken,
      }),
    };
    try {
      let response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tasks/${rowDetails?._id}/attachments`,
        options
      );
      let responseData = await response.json();
      if (responseData.status >= 200 && responseData.status <= 300) {
        let modifiedData = groupByDate(responseData?.data?.attachments);
        setAttachmentData(modifiedData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getAcceptedForPreviewImageOrNot = (item: any) => {
    return !(
      item?.metadata?.type.includes("pdf") ||
      item?.metadata?.type.includes("video") ||
      item?.metadata?.type?.includes("image")
    );
  };
  useEffect(() => {
    if (attachmentdrawer) {
      getAllAttachments();
    } else {
      setAttachmentData([]);
    }
  }, [attachmentdrawer]);

  const downLoadAttachements = async (file: any, name: string) => {
    try {
      if (file) {
        fetch(file)
          .then((response) => {
            // Get the filename from the response headers
            const contentDisposition = response.headers.get(
              "content-disposition"
            );
            let filename = "downloaded_file"; // Default filename if not found in headers
            if (name) {
              filename = name;
            }

            if (contentDisposition) {
              const filenameMatch = contentDisposition.match(/filename="(.+)"/);
              if (filenameMatch && filenameMatch.length > 1) {
                filename = filenameMatch[1];
              }
            }

            // Create a URL for the blob
            return response.blob().then((blob) => ({ blob, filename }));
          })
          .then(({ blob, filename }) => {
            const blobUrl = window.URL.createObjectURL(blob);

            const downloadLink = document.createElement("a");
            downloadLink.href = blobUrl;
            downloadLink.download = filename; // Use the obtained filename
            downloadLink.style.display = "none";
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);

            // Clean up the blob URL
            window.URL.revokeObjectURL(blobUrl);
            toast.success("Attachement downloaded successfully");
          })
          .catch((error) => {
            console.error("Error downloading file:", error);
          });
        // setAlertMessage("Attachement downloaded successfully")
        // setAlertType(true)
      }
    } catch (err) {
      console.error(err);
    }
  };


  //detele attachmeents
  const deleteSelectedImages = async () => {
    setLoading(true);

    let response = await deleteTaskAttachmentService({
      token: accessToken,
      taskId: router?.query?.task_id as string,
      body: { attachment_ids: selectedItems.map((item: any) => item._id) },
    });

    if (response?.success) {
      toast.success(response?.message);
      setSelectedItems([]);
      getAllAttachments();
    } else {
      toast.error(response?.message);
    }
    setLoading(false);
  };

  //checkbox handlechange event
  const handleChange = (itemId: any) => {
    const itemIndex = tempImages.findIndex(
      (ite: any) => ite._id === itemId._id
    );

    if (itemIndex === -1) {
      setSelectedItems([...tempImages, itemId]);
    } else {
      const updatedItems = tempImages.filter(
        (item: any) => item._id !== itemId._id
      );
      setSelectedItems(updatedItems);
    }
  };

  //download multiple images
  const handleDownload = async () => {
    for (let i = 0; i < selectedItems.length; i++) {
      await downloadImage(selectedItems[i], i);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Adjust the delay time if needed
    }
  };

  const downloadImage = (image: any, index: any) => {
    return new Promise<void>((resolve) => {
      const link = document.createElement('a');
      link.href = image.url;
      link.setAttribute('download', `image_${index + 1}`);
      link.click();
      resolve();
    });
  };


  return (
    <div  >
      <Drawer
        anchor={direction}
        open={attachmentdrawer}
        sx={{
          "& .MuiPaper-root": {
            borderRadius: "10px",
            overflow: "auto",
            maxHeight: "60%",
            maxWidth: "500px",
            margin: "auto"
          },
        }}
      >
        <div className={styles.drawerHeader}>
          <div className={styles.stickyHeader}>
            {checkBoxOpen ? (
              <div style={{ display: "flex", alignItems: "center" }}>
                <IconButton
                  onClick={() => {
                    setCheckBoxOpen(false);
                    setSelectedItems([]);
                  }}
                  sx={{ display: attachmentData?.length ? "" : "none" }}
                  className={styles.selectBtn}
                >
                  <img src="/mobileIcons/scouting/x-light.svg" alt="" width="20px" />
                </IconButton>
                {selectedItems?.length ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <IconButton onClick={() => (
                      handleDownload()
                    )}>
                      <FileDownloadIcon />
                    </IconButton>

                    <IconButton className={styles.selectBtn} onClick={() => deleteSelectedImages()} sx={{ paddingBlock: "0" }}>
                      <ImageComponent
                        src={"/mobileIcons/scouting/trash-simple-light.svg"}
                        width={20}
                        height={20}
                        alt=""
                      />
                    </IconButton>


                  </div>
                ) : (
                  ""
                )}
              </div>
            ) : (
              <Button
                className={styles.selectBtn}
                onClick={() => setCheckBoxOpen(true)}
                sx={{ display: attachmentData?.length ? "" : "none" }}
              >
                Select
              </Button>
            )}
          </div>

          <Typography variant="h6">Attachments</Typography>
          <IconButton
            onClick={() => {
              attachmentDrawerClose();
              dispatch(removeTheAttachementsFilesFromStore([]));
            }}
          >
            <CloseIcon sx={{ color: "#000" }} />
          </IconButton>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            paddingBlock: "1rem",
            padding: "0 1rem",
          }}
        >
          {!loading && attachmentData?.length ? (
            attachmentData?.map((item: any, index: any) => {
              return (
                <div style={{ marginBottom: "1rem" }} key={index}>
                  <p className={styles.AttachmentDate}>
                    {timePipe(item[0]?.createdAt, "DD MMM YYYY")}
                  </p>
                  <div className={styles.attachmentDrawer}>
                    {item?.map((image: any, index: number) => {
                      return (
                        <div
                          key={index}
                          className={styles.taskModuleAttachmentBlock}
                        >
                          <img
                            src={getImageSrcUrl(image)}
                            alt=""
                            height={100}
                            width={100}
                            className={styles.attachmentImg}
                            onContextMenu={(e) => {
                              e.preventDefault();
                              handleChange(image);
                              setLongPressActive(true);
                            }} // Prevent right-click context menu
                            onTouchStart={(e) => {
                              if (e.touches.length > 1) {
                                e.preventDefault(); // Prevent multi-touch event
                              }
                            }}
                            onClick={() => {
                              handleChange(image); // Call handleLongPress when long press is detected
                            }}
                          />
                          <div
                            style={{
                              position: "absolute",
                              top: "2px",
                              right: "2px",
                            }}
                          >
                            {checkBoxOpen ? (
                              <input
                                style={{ width: "18px", height: "18px", border: "1px solid #000" }}
                                type="checkbox"
                                checked={tempImages.some(
                                  (ite: any) => ite._id === image._id
                                )}
                                onChange={() => handleChange(image)}
                                title={image.id}
                              />
                            ) : (
                              ""
                            )}
                          </div>
                          {/* <div
                            className={styles.viewIcon}
                            onClick={() => {
                              if (getAcceptedForPreviewImageOrNot(image)) {
                                downLoadAttachements(
                                  image?.url,
                                  image?.metadata?.original_name
                                );
                                return;
                              }
                              setSingleImageView(true);
                              setImageId(image);
                            }}
                          >
                            <img
                              src={
                                getAcceptedForPreviewImageOrNot(image)
                                  ? "/viewTaskIcons/download-white.svg"
                                  : "/view-icon-task.svg"
                              }
                              height={30}
                              width={30}
                              alt="view"
                            />
                          </div> */}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          ) : loading ? (
            <LinearProgress />
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "1.5rem",
              }}
            >
              No Attachments
            </div>
          )}
        </div>
      </Drawer>
      <Dialog
        onClose={() => setSingleImageView(false)}
        open={singleImageView}
        fullScreen
        sx={{
          "& .MuiPaper-root": {
            background: "#00000063",
            padding: "1rem",
          },
        }}
      >
        <div>
          <div
            style={{ textAlign: "end", cursor: "pointer" }}
            onClick={() => setSingleImageView(false)}
          >
            <Close sx={{ color: "#fff", fontSize: "2.5rem" }} />
          </div>
          <div className={styles.singleImageDialog}>
            {imageid?.metadata?.type?.includes("video") ? (
              <video controls width="100%" height="auto" autoPlay>
                <source src={imageid?.url} type={imageid?.type} />
                Your browser does not support the video tag.
              </video>
            ) : imageid?.metadata?.type?.includes("image") ? (
              <img src={imageid?.url} alt="" />
            ) : (
              <iframe src={imageid?.url} width={"100%"} height={"90%"}>
                <p style={{ background: "white" }}>
                  No preview available for this file type.
                </p>
              </iframe>
            )}
          </div>
        </div>
      </Dialog>
      <Toaster richColors closeButton position="top-right" />
    </div>
  );
};
export default AttachmentDrawerTaskmodule;
