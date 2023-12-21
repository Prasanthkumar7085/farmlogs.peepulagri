import { removeTheAttachementsFilesFromStore } from "@/Redux/Modules/Conversations";
import timePipe from "@/pipes/timePipe";
import { Close } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import { Dialog, IconButton, LinearProgress, Typography } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "../../TaskComments/Comments.module.css";
import getImageSrcUrl from "@/pipes/getImageSrcUrl";
import { Toaster, toast } from "sonner";
const AttachmentDrawerMobile = ({
  attachmentDrawerClose,
  rowDetails,
  attachmentdrawer,
  direction,
}: any) => {
  const dispatch = useDispatch();
  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );

  const [loading, setLoading] = useState<any>();
  const [attachmentData, setAttachmentData] = useState<any>();
  const [singleImageView, setSingleImageView] = useState<any>(false);
  const [imageid, setImageId] = useState<any>();

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
  return (
    <div>
      <Drawer
        anchor={direction}
        open={attachmentdrawer}
        sx={{
          "& .MuiPaper-root": {
            padding: "1rem",
            minWidth: "100vw",
            maxWidth: "100vw",
          },
        }}
      >
        <div className={styles.drawerHeader}>
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
                          />
                          <div
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
export default AttachmentDrawerMobile;
