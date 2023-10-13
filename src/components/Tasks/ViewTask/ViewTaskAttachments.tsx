import ImageComponent from "@/components/Core/ImageComponent";
import { TaskAttachmentsType, TaskResponseTypes } from "@/types/tasksTypes";
import { FC, useState } from "react";
import ImagePreviewDialog from "./ImagePreviewDialog";
import styles from "./TaskDetails.module.css";
import { Button, IconButton } from "@mui/material";

interface pageProps {
  data: TaskResponseTypes | null | undefined;
}
const ViewTaskAttachments: FC<pageProps> = ({ data }) => {
  const [imagePreviewIndex, setImagePreviewIndex] = useState(-1);
  const [openDialog, setOpenDialog] = useState(false);
  // const [selectedAttachmentIds, setSelectedAttachments] = useState([]);

  const deleteTaskAttachment = (id: string) => {};

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

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {data?.attachments?.length
              ? data?.attachments?.map((item: any, index: number) => {
                  return (
                    <div key={index}>
                      <div
                        style={{
                          height: "100px",
                          width: "100px",
                          objectFit: "cover",
                          position: "relative",
                        }}
                        onClick={() => {
                          setImagePreviewIndex(index);
                          setOpenDialog(true);
                        }}
                      >
                        {!item?.type?.includes("video") ? (
                          <img src={item?.url} className={styles.imageIcon} />
                        ) : (
                          <img
                            src={"/videoimg.png"}
                            className={styles.imageIcon}
                          />
                        )}
                      </div>
                      {/* <IconButton
                        onClick={() => deleteTaskAttachment(item?._id)}
                      >
                        <ImageComponent
                          src="/trast-icon.svg"
                          height={17}
                          width={17}
                          alt="view"
                        />
                      </IconButton> */}
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
