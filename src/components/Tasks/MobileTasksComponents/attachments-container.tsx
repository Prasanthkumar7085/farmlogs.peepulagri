import { TaskAttachmentsType } from "@/types/tasksTypes";
import { useRouter } from "next/router";
import { useState } from "react";
import { useSelector } from "react-redux";
import TasksAttachmentsMobile from "../AddTask/TasksAttachments-mobile";
import AttachmentDrawerMobile from "../AllTasks/TasksTable/AttachmentDrawerMobile";
import styles from "./attachments-container.module.css";
import getImageSrcUrl from "@/pipes/getImageSrcUrl";
import checkIfAttachmentHasPreviewOrNot from "@/pipes/checkIfAttachmentHasPreviewOrNot";
import { Dialog } from "@mui/material";
import { Close } from "@mui/icons-material";
import { toast } from "sonner";

const AttachmentsContainer = ({
  attachmentData,
  getAllAttachments,
  status,
  hasEditAccess,
  data,
}: any) => {
  const router = useRouter();

  const loggedInUserId = useSelector(
    (state: any) => state.auth.userDetails?.user_details?._id
  );

  const maxImagesToShow = 6;

  const [files, setFiles] = useState([]);
  const [multipleFiles, setMultipleFiles] = useState<any>([]);
  const [uploadAttachmentsOpen, setUploadAttachmentsOpen] = useState(false);
  const [attachmentdrawer, setAttachmentDrawer] = useState(false);
  const [imagePreviewOpen, setImagePreviewOpen] = useState<any>();

  const setUploadedFiles = (filesUploaded: any) => {
    setFiles(filesUploaded);
  };

  const afterUploadAttachements = (value: any) => {
    if (value == true) {
      setUploadAttachmentsOpen(!uploadAttachmentsOpen);
      setFiles([]);
      setMultipleFiles([]);
      getAllAttachments();
    }
  };

  const downloadFile = async (item: any) => {
    try {
      const response = await fetch(item.url);
      if (response.status == 200) {
        toast.success("Your file will be downloaded soon")
      } else {
        toast.error("File downloading failed")
      }
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
    <div
      className={styles.attachmentscontainer}
      style={{
        display:
          loggedInUserId == data?.created_by?._id || hasEditAccess
            ? ""
            : "none",
      }}
    >
      {attachmentData?.length ? (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <label className={styles.attachments}>Attachments</label>
          <label
            className={styles.attachmentView}
            onClick={() => setAttachmentDrawer(true)}
          >
            View All
          </label>
        </div>
      ) : (
        ""
      )}
      <div
        className={styles.files}
        style={{ marginTop: attachmentData?.length ? "1rem" : "0 !important" }}
      >
        <div
          className={styles.attachmentsrow}
          style={{
            marginBottom: "12px",
            display: attachmentData?.length ? "" : "none",
          }}
        >
          {attachmentData?.length
            ? attachmentData
              ?.slice(0, 6)
              .map((item: TaskAttachmentsType | any, index: number) => {
                return (
                  <div className={styles.eachImageBlock} key={index}>
                    <img
                      className={
                        checkIfAttachmentHasPreviewOrNot(item)
                          ? styles.imageIcon
                          : styles.iconImg
                      }
                      src={getImageSrcUrl(item)}
                      alt={""}
                      onClick={() => {
                        if (checkIfAttachmentHasPreviewOrNot(item)) {
                          setImagePreviewOpen(item);
                        } else {
                          downloadFile(item);
                        }
                      }}
                    />
                  </div>
                );
              })
            : ""}
        </div>
        {loggedInUserId == data?.created_by?._id || hasEditAccess ? (
          <>
            <div style={{ width: "100%" }}>
              <TasksAttachmentsMobile
                taskId={""}
                disabled={status === "DONE"}
                setUploadedFiles={setUploadedFiles}
                multipleFiles={multipleFiles}
                setMultipleFiles={setMultipleFiles}
                afterUploadAttachements={afterUploadAttachements}
              />
            </div>
          </>
        ) : (
          ""
        )}
      </div>

      <AttachmentDrawerMobile
        attachmentDrawerClose={() => setAttachmentDrawer(false)}
        rowDetails={{ _id: router.query.task_id }}
        setAttachmentDrawer={setAttachmentDrawer}
        attachmentdrawer={attachmentdrawer}
        direction={"bottom"}
        getAllAttachmentsInView={getAllAttachments}
      />

      {/* <Drawer open={attachmentsOpen}></Drawer> */}

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
            maxWidth: "500px",
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
          <div
            style={{
              height: "calc(100vh - 80px)",
              display: "flex",
              justifyContent: "center",
            }}
          >
            {imagePreviewOpen?.metadata?.type?.includes("video") ? (
              <video controls width="100%" height="auto" autoPlay>
                <source
                  src={imagePreviewOpen?.url}
                  type={imagePreviewOpen?.type}
                />
                Your browser does not support the video tag.
              </video>
            ) : imagePreviewOpen?.metadata?.type?.includes("image") ? (
              <img
                src={imagePreviewOpen?.url}
                alt=""
                style={{ height: "100%", width: "100%", objectFit: "contain" }}
              />
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
    </div>
  );
};

export default AttachmentsContainer;
