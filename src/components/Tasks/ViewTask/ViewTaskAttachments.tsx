import ImageComponent from "@/components/Core/ImageComponent";
import { TaskAttachmentsType, TaskResponseTypes } from "@/types/tasksTypes";
import { ChangeEvent, FC, useEffect, useState } from "react";
import ImagePreviewDialog from "./ImagePreviewDialog";
import styles from "./TaskDetails.module.css";
import { Button, Checkbox, CircularProgress, IconButton } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import deleteTaskAttachmentService from "../../../../lib/services/TasksService/deleteTaskAttachmentService";
import { useSelector } from "react-redux";
import { Toaster, toast } from "sonner";
import { useRouter } from "next/router";
interface pageProps {
  data: TaskResponseTypes | null | undefined;
  getTaskById: (id: string) => void;
}

const ViewTaskAttachments: FC<pageProps> = ({ data, getTaskById }) => {
  const router = useRouter();

  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );

  const [imagePreviewIndex, setImagePreviewIndex] = useState(-1);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAttachmentIds, setSelectedAttachments] = useState<
    Array<string>
  >([]);

  const [deleteLoading, setDeleteLoading] = useState(false);

  const getSourceForThumnail = (type = "") => {
    if (type && type.includes("pdf")) {
      return "/pdf.svg";
    } else if (type && type.includes("video")) {
      return "/videoimg.png";
    } else if (type && type.includes("image")) {
      return "/image.svg";
    } else {
    }
  };

  const selectImagesForDelete = (
    e: ChangeEvent<HTMLInputElement>,
    item: TaskAttachmentsType
  ) => {
    let ids = [...selectedAttachmentIds];
    if (ids.includes(item?._id)) {
      ids = ids.filter((itemId: string) => itemId !== item?._id);
    } else {
      ids.push(item?._id);
    }
    console.log(ids);

    setSelectedAttachments(ids);
  };

  const deleteSelectedImages = async () => {
    setDeleteLoading(true);
    let response = await deleteTaskAttachmentService({
      token: accessToken,
      taskId: data?._id as string,
      body: { attachment_ids: selectedAttachmentIds },
    });
    if (response?.success) {
      toast.success(response?.message);
      getTaskById(router.query.task_id as string);
    } else {
    }

    setDeleteLoading(false);
  };

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
        {/* <Button
          onClick={deleteSelectedImages}
          disabled={!selectedAttachmentIds?.length || deleteLoading}
        >
          {deleteLoading ? (
            <CircularProgress size="1.5rem" sx={{ color: "red" }} />
          ) : (
            <ImageComponent
              src="/trast-icon.svg"
              height={17}
              width={17}
              alt="delete"
            />
          )}
        </Button> */}
      </div>

      <div className={styles.allAttachments}>
        {data?.attachments?.length
          ? data?.attachments?.map(
              (item: TaskAttachmentsType | any, index: number) => {
                return (
                  <div key={index}>
                    <div className={styles.singleAttachment}>
                      <div className={styles.attachmentDetails}>
                        <div className={styles.checkGrp}>
                          <Checkbox
                            size="small"
                            sx={{ padding: "0" }}
                            onChange={(e) => selectImagesForDelete(e, item)}
                          />
                          <ImageComponent
                            src={getSourceForThumnail(item.type)}
                            height={20}
                            width={20}
                            alt={"image"}
                          />
                          <p
                            onClick={() => window.open(item.url)}
                            style={{ cursor: "pointer" }}
                          >
                            {item?.original_name?.length > 25
                              ? item?.original_name.slice(0, 22) + "..."
                              : item?.original_name}
                          </p>
                        </div>
                        <IconButton onClick={() => window.open(item.url)}>
                          <OpenInNewIcon />
                        </IconButton>
                      </div>
                    </div>
                  </div>
                );
              }
            )
          : "No Attachements"}
      </div>
      {/* <Toaster closeButton richColors dir="ltr" /> */}
    </div>
  );
};

export default ViewTaskAttachments;
