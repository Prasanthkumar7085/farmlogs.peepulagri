import ImageComponent from "@/components/Core/ImageComponent";
import { TaskAttachmentsType, TaskResponseTypes } from "@/types/tasksTypes";
import { FC, useState } from "react";
import ImagePreviewDialog from "./ImagePreviewDialog";
import styles from "./TaskDetails.module.css";
import { Button, Checkbox, IconButton } from "@mui/material";

interface pageProps {
  data: TaskResponseTypes | null | undefined;
}
const ViewTaskAttachments: FC<pageProps> = ({ data }) => {
  const [imagePreviewIndex, setImagePreviewIndex] = useState(-1);
  const [openDialog, setOpenDialog] = useState(false);
  // const [selectedAttachmentIds, setSelectedAttachments] = useState([]);

  const deleteTaskAttachment = (id: string) => { };

  return (
    <div className={styles.cardDetails} style={{ paddingBottom: "1rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          alignItems: "center",
        }}
      >
        <label
          className={styles.label}
          style={{
            justifyContent: "center",
            display: "flex",
            alignItems: "center",
          }}
        >
          Attachments
        </label>
        {/* <Button>Delete Selected</Button> */}
      </div>

      <div className={styles.allAttachments}>
        {data?.attachments?.length
          ? data?.attachments?.map((item: any, index: number) => {
            return (
              <div key={index}>
                <div className={styles.singleAttachment}>
                  <div className={styles.attachmentDetails}>
                    <div className={styles.checkGrp}>
                      <Checkbox size="small" sx={{ padding: "0" }} />
                      <p>Scouting image</p>
                    </div>
                    <IconButton>
                      <img src="/download-1-1.svg" alt="" />
                    </IconButton>
                  </div>
                </div>
              </div>
            );
          })
          : "No Attachements"}
      </div>
      <ImagePreviewDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        mediaArray={data?.attachments}
        index={imagePreviewIndex}
        setImagePreviewIndex={setImagePreviewIndex}
      />
    </div>
  );
};

export default ViewTaskAttachments;
