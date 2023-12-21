import { TaskAttachmentsType } from "@/types/tasksTypes";
import { useState } from "react";
import TasksAttachments from "../AddTask/TasksAttachments";
import styles from "./attachments-container.module.css";
import { Drawer } from "@mui/material";
import { useRouter } from "next/router";
import AttachmentDrawerTaskmodule from "../AllTasks/TasksTable/AttachmentDrawer";

const AttachmentsContainer = ({ attachmentData, getAllAttachments }: any) => {
  const router = useRouter();
  const maxImagesToShow = 6;

  const [files, setFiles] = useState([]);
  const [multipleFiles, setMultipleFiles] = useState<any>([]);
  const [uploadAttachmentsOpen, setUploadAttachmentsOpen] = useState(false);
  const [attachmentdrawer, setAttachmentDrawer] = useState(false);

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

  return (
    <div className={styles.attachmentscontainer}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <label className={styles.attachments}>Attachments</label>
        <label
          className={styles.attachments}
          onClick={() => setAttachmentDrawer(true)}
        >
          View {">>"}{" "}
        </label>
      </div>
      <div className={styles.files}>
        <div className={styles.attachmentsrow}>
          {attachmentData?.length
            ? attachmentData
                ?.slice(0, maxImagesToShow)
                .map((item: TaskAttachmentsType | any, index: number) => {
                  return (
                    <div key={index}>
                      <div>
                        {item?.metadata?.type.includes("pdf") ? (
                          <img
                            src="/pdf-icon.png"
                            className={styles.imageIcon}
                            alt={""}
                          />
                        ) : item?.metadata?.type.includes("csv") ? (
                          <img
                            src="/csv-icon.png"
                            className={styles.imageIcon}
                            alt={""}
                          />
                        ) : item?.metadata?.type ==
                            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
                          item?.metadata?.type.includes("xlsx") ? (
                          <img
                            src="/google-sheets-icon.webp"
                            className={styles.imageIcon}
                            alt={""}
                          />
                        ) : item?.metadata?.type.includes("doc") ||
                          item?.metadata?.type.includes("docx") ? (
                          <img
                            src="/doc-icon.webp"
                            className={styles.imageIcon}
                            alt={""}
                          />
                        ) : item?.metadata?.type.includes("video") ? (
                          <img
                            src="/video-icon.png"
                            className={styles.imageIcon}
                            alt={""}
                          />
                        ) : (
                          <img
                            src={
                              item?.metadata?.type?.includes("image")
                                ? item.url
                                : "/other_icon.png"
                            }
                            alt={""}
                            className={styles.imageIcon}
                          />
                        )}
                      </div>
                    </div>
                  );
                })
            : "No Attachments"}
        </div>
        <>
          <h6 className={styles.fileUploadHeading}>Upload Attachment</h6>
          <div>
            <TasksAttachments
              taskId={""}
              disabled={false}
              setUploadedFiles={setUploadedFiles}
              multipleFiles={multipleFiles}
              setMultipleFiles={setMultipleFiles}
              afterUploadAttachements={afterUploadAttachements}
            />
          </div>
        </>
      </div>

      <AttachmentDrawerTaskmodule
        attachmentDrawerClose={() => setAttachmentDrawer(false)}
        rowDetails={{ _id: router.query.task_id }}
        setAttachmentDrawer={setAttachmentDrawer}
        attachmentdrawer={attachmentdrawer}
        direction={"bottom"}
      />

      {/* <Drawer open={attachmentsOpen}></Drawer> */}
    </div>
  );
};

export default AttachmentsContainer;
