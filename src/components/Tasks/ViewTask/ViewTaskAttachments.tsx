import ImageComponent from "@/components/Core/ImageComponent";
import { TaskAttachmentsType, TaskResponseTypes } from "@/types/tasksTypes";
import { FC, useState } from "react";
import ImagePreviewDialog from "./ImagePreviewDialog";
import styles from "./TaskDetails.module.css";

interface pageProps {
  data: TaskResponseTypes | null | undefined;
}
const ViewTaskAttachments: FC<pageProps> = ({ data }) => {
  console.log(data?.attachments);

  const [imagePreviewIndex, setImagePreviewIndex] = useState(-1);
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <div className={styles.cardDetails}>
      <div className={styles.idandStatus}>
        <div className={styles.title}>
          <label className={styles.label}>Attachments</label>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {data?.attachments?.length
              ? data?.attachments?.map((item: any, index: number) => {
                  return (
                    <div
                      key={index}
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
                      <img src={item?.url} className={styles.imageIcon} />
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
