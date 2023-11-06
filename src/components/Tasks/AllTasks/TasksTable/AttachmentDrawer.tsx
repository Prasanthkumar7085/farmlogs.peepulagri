
import { removeTheAttachementsFilesFromStore } from "@/Redux/Modules/Conversations";
import timePipe from "@/pipes/timePipe";
import { Close } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import { Dialog, IconButton, LinearProgress, Typography } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "../../TaskComments/Comments.module.css";
const AttachmentDrawerTaskmodule = ({
  attachmentDrawerClose,
  rowDetails,
  attachmentdrawer,
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
      const dateKey = obj.time.split("T")[0]; // Extract the date from the timestamp
      if (!result[dateKey]) {
        result[dateKey] = [];
      }
      result[dateKey].push(obj);
      return result;
    }, {});

    return Object.values(groupedByDate);
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
        `${process.env.NEXT_PUBLIC_API_URL}/tasks/${rowDetails?._id}`,
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
  useEffect(() => {
    if (attachmentdrawer) {
      getAllAttachments();
    } else {
      setAttachmentData([]);
    }
  }, [attachmentdrawer]);

  return (
    <div>
      <Drawer
        anchor="right"
        open={attachmentdrawer}
        sx={{
          "& .MuiPaper-root": {
            padding: "1rem",
            minWidth: "600px",
            maxWidth: "600px",
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
                    {timePipe(item[0]?.time, "DD MMM YYYY, hh:mm A")}
                  </p>
                  <div className={styles.attachmentDrawer}>
                    {item?.map((image: any, index: number) => {
                      return (
                        <div
                          key={index}
                          className={styles.taskModuleAttachmentBlock}
                        >
                          {image?.type?.includes("video") ? (
                            <img
                              src={"/videoimg.png"}
                              alt=""
                              height={100}
                              width={100}
                              className={styles.attachmentImg}
                            />
                          ) : (
                            <img
                              src={image?.url}
                              alt=""
                              height={100}
                              width={100}
                              className={styles.attachmentImg}
                            />
                          )}
                          <div
                            className={styles.viewIcon}
                            onClick={() => {
                              setSingleImageView(true);
                              setImageId(image);
                            }}
                          >
                            <img
                              src="/view-icon-task.svg"
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
            {imageid?.type?.includes("video") ? (
              <video controls width="100%" height="auto" autoPlay>
                <source src={imageid?.url} type={imageid?.type} />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img src={imageid?.url} alt="" />
            )}
          </div>
        </div>
      </Dialog>
    </div>
  );
};
export default AttachmentDrawerTaskmodule;
