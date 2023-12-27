import { removeTheAttachementsFilesFromStore } from "@/Redux/Modules/Conversations";
import ImageComponent from "@/components/Core/ImageComponent";
import getImageSrcUrl from "@/pipes/getImageSrcUrl";
import timePipe from "@/pipes/timePipe";
import { Close } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import {
  Button,
  CircularProgress,
  Dialog,
  IconButton,
  LinearProgress,
  Typography,
} from "@mui/material";
import Drawer from "@mui/material/Drawer";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toaster, toast } from "sonner";
import deleteTaskAttachmentService from "../../../../../lib/services/TasksService/deleteTaskAttachmentService";
import styles from "../../TaskComments/Comments.module.css";
import checkIfAttachmentHasPreviewOrNot from "@/pipes/checkIfAttachmentHasPreviewOrNot";

const AttachmentDrawerMobile = ({
  attachmentDrawerClose,
  rowDetails,
  attachmentdrawer,
  direction,
  getAllAttachmentsInView,
  setAttachmentDrawer,
}: any) => {
  const dispatch = useDispatch();
  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );
  const router = useRouter();

  const [loading, setLoading] = useState<any>();
  const [attachmentData, setAttachmentData] = useState<any>();
  const [singleImageView, setSingleImageView] = useState<any>(false);
  const [imageid, setImageId] = useState<any>();
  const [selectedItems, setSelectedItems] = useState<any>([]);
  const [tempImages, setTempImages] = useState(selectedItems);
  const [longpressActive, setLongPressActive] = useState<any>(false);
  const [checkBoxOpen, setCheckBoxOpen] = useState<any>(false);
  const [deteleLoading, setDeleteLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [imagePreviewOpen, setImagePreviewOpen] = useState<any>();

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
        if (!responseData?.data?.attachments?.length) {
          setAttachmentDrawer(false);
          return;
        }
        let modifiedData = groupByDate(responseData?.data?.attachments);
        setAttachmentData(modifiedData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCheckBoxOpen(false);
    setSelectedItems([]);

    if (attachmentdrawer) {
      getAllAttachments();
    } else {
      setAttachmentData([]);
    }
  }, [attachmentdrawer]);

  //detele attachmeents
  const deleteSelectedImages = async () => {
    setDeleteLoading(true);

    let response = await deleteTaskAttachmentService({
      token: accessToken,
      taskId: router?.query?.task_id as string,
      body: { attachment_ids: selectedItems.map((item: any) => item._id) },
    });

    if (response?.success) {
      toast.success(response?.message);
      setSelectedItems([]);
      getAllAttachments();

      await getAllAttachmentsInView();
    } else {
      toast.error(response?.message);
    }
    setDeleteLoading(false);
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

  async function handleDownload() {
    setDownloadLoading(true);
    const downloadPromises = selectedItems.map(
      (item: { url: string; metadata: { original_name: string } }) =>
        downloadFile(item?.url, item?.metadata?.original_name)
    );
    const results = await Promise.all(downloadPromises);
    setDownloadLoading(false);
    results.forEach((result) => {
      if (result?.status === "fulfilled") {
        console.log("Download successful");
      } else {
        console.error("Download failed", result?.reason);
      }
    });
  }

  async function downloadFile(url: string, nameForDownload: string) {
    return new Promise(async (resolve: any, reject) => {
      try {
        const response = await fetch(url);
        const blob = await response.blob();

        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = blobUrl;
        link.download = nameForDownload || "downloaded_file";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        window.URL.revokeObjectURL(blobUrl);

        resolve();
      } catch (error) {
        console.error("Error downloading file", error);
        reject(error);
      }
    });
  }

  const downloadSingleFile = async (item: any) => {
    try {
      const response = await fetch(item.url);
      const blob = await response.blob();

      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = blobUrl;
      link.download = item.metadata.original_name || "downloaded_file";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading file", error);
    }
  };

  return (
    <div>
      <Drawer
        anchor={direction}
        open={attachmentdrawer}
        sx={{
          "& .MuiPaper-root": {
            borderRadius: "10px",
            overflow: "auto",
            maxHeight: "60%",
            maxWidth: "500px",
            minHeight: "400px",
            margin: "auto",
          },
        }}
      >
        <div className={styles.drawerHeader}>
          {/* <div className={styles.stickyHeader}>
            {checkBoxOpen ? (
              <div style={{ display: "flex", alignItems: "center" }}>
                <Button
                  onClick={() => {
                    setCheckBoxOpen(false);
                    setSelectedItems([]);
                  }}
                  sx={{ display: attachmentData?.length ? "" : "none", color: "#d94841", textTransform: "capitalize", fontSize: "14px", fontFamily: "'Inter',sans-serif" }}

                >
                  Cancel
                </Button>
                {selectedItems?.length ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    {downloadLoading ? (
                      <CircularProgress
                        sx={{ color: "#757575" }}
                        size="1.2rem"
                      />
                    ) : (
                      <IconButton onClick={() => handleDownload()}>
                        <FileDownloadIcon />
                      </IconButton>
                    )}

                    <IconButton
                      className={styles.selectBtn}
                      onClick={() => deleteSelectedImages()}
                      sx={{ paddingBlock: "0" }}
                    >
                      {deteleLoading ? (
                        <CircularProgress
                          sx={{ color: "#757575" }}
                          size="1.2rem"
                        />
                      ) : (
                        <ImageComponent
                          src={"/mobileIcons/scouting/trash-simple-light.svg"}
                          width={20}
                          height={20}
                          alt=""
                        />
                      )}
                    </IconButton>
                  </div>
                ) : (
                  ""
                )}
              </div>
            ) : (
              <Button

                onClick={() => setCheckBoxOpen(true)}
                sx={{ display: attachmentData?.length ? "" : "none", color: "#05A155", textTransform: "capitalize", fontSize: "14px", fontFamily: "'Inter',sans-serif" }}
              >
                Select
              </Button>
            )}
          </div> */}

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
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingBottom: "0.5rem",
                    }}
                  >
                    <p className={styles.AttachmentDate}>
                      {timePipe(item[0]?.createdAt, "DD MMM YYYY")}
                    </p>
                    <div className={styles.stickyHeader}>
                      {checkBoxOpen ? (
                        <div style={{ display: "flex", alignItems: "center" }}>
                          {selectedItems?.length ? (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                              }}
                            >
                              {downloadLoading ? (
                                <CircularProgress
                                  sx={{ color: "#757575" }}
                                  size="1.2rem"
                                />
                              ) : (
                                <IconButton
                                  sx={{ padding: "0" }}
                                  onClick={() => handleDownload()}
                                >
                                  <FileDownloadIcon />
                                </IconButton>
                              )}

                              <IconButton
                                className={styles.selectBtn}
                                onClick={() => deleteSelectedImages()}
                                sx={{ padding: "0" }}
                              >
                                {deteleLoading ? (
                                  <CircularProgress
                                    sx={{ color: "#757575" }}
                                    size="1.2rem"
                                  />
                                ) : (
                                  <ImageComponent
                                    src={
                                      "/mobileIcons/scouting/trash-simple-light.svg"
                                    }
                                    width={20}
                                    height={20}
                                    alt=""
                                  />
                                )}
                              </IconButton>
                            </div>
                          ) : (
                            ""
                          )}
                          <Button
                            onClick={() => {
                              setCheckBoxOpen(false);
                              setSelectedItems([]);
                            }}
                            sx={{
                              display: attachmentData?.length ? "" : "none",
                              color: "#d94841",
                              textTransform: "capitalize",
                              fontSize: "14px",
                              fontFamily: "'Inter',sans-serif",
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button
                          onClick={() => setCheckBoxOpen(true)}
                          sx={{
                            display: attachmentData?.length ? "" : "none",
                            color: "#05A155",
                            textTransform: "capitalize",
                            fontSize: "14px",
                            fontFamily: "'Inter',sans-serif",
                          }}
                        >
                          Select
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className={styles.attachmentDrawerMobile}>
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
                              setCheckBoxOpen(true);
                            }} // Prevent right-click context menu
                            onTouchStart={(e) => {
                              if (e.touches.length > 1) {
                                e.preventDefault(); // Prevent multi-touch event
                              }
                            }}
                            onClick={() => {
                              if (!checkBoxOpen) {
                                if (checkIfAttachmentHasPreviewOrNot(image)) {
                                  console.log(image, "response");

                                  setImagePreviewOpen(image);
                                } else {
                                  downloadSingleFile(image);
                                }
                                return;
                              }
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
                                style={{
                                  width: "18px",
                                  height: "18px",
                                  border: "1px solid #000",
                                }}
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
        onClose={() => setImagePreviewOpen(null)}
        open={!!imagePreviewOpen}
        fullScreen
        sx={{
          "& .MuiPaper-root": {
            background: "#00000063",
            padding: "1rem",
            width: "100%",
            margin: "0 auto",
            maxWidth: "500px"
          },
        }}
      >
        <div>
          <div
            style={{ textAlign: "end", cursor: "pointer" }}
            onClick={() => setImagePreviewOpen(null)}
          >
            <Close sx={{ color: "#fff", fontSize: "2.5rem" }} />
          </div>
          <div style={{ height: "calc(100vh - 50px)" }}>
            {imagePreviewOpen?.metadata?.type?.includes("video") ? (
              <video controls width="100%" height="auto" autoPlay>
                <source
                  src={imagePreviewOpen?.url}
                  type={imagePreviewOpen?.type}
                />
                Your browser does not support the video tag.
              </video>
            ) : imagePreviewOpen?.metadata?.type?.includes("image") ? (
              <img src={imagePreviewOpen?.url} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            ) : (
              <iframe src={imagePreviewOpen?.url} width={"100%"} height={"90%"}>
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
export default AttachmentDrawerMobile;
