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
    <div className={styles.cardDetails}>
      <div className={styles.idandStatus}>
        <div className={styles.title}>
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

          <div style={{ display: "flex", gap: "10px", flexDirection: "column" }}>
            {data?.attachments?.length
              ? data?.attachments?.map((item: any, index: number) => {
                return (
                  <div key={index}>
                    {!item?.type?.includes("video") ? (
                      <div>
                        <Checkbox />
                        <div>

                        </div>
                      </div>
                    ) : (

                      ""
                    )}
                  </div>
                );
              })
              : "No Attachements"}
          </div>
        </div>
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
