import ImageComponent from "@/components/Core/ImageComponent";
import LoadingComponent from "@/components/Core/LoadingComponent";
import { TaskAttachmentsType, TaskResponseTypes } from "@/types/tasksTypes";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Button, Checkbox, CircularProgress, IconButton } from "@mui/material";
import { useRouter } from "next/router";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Toaster, toast } from "sonner";
import appendAttachmentsInTaskService from "../../../../lib/services/TasksService/appendAttachmentsInTaskService";
import deleteTaskAttachmentService from "../../../../lib/services/TasksService/deleteTaskAttachmentService";
import TasksAttachments from "../AddTask/TasksAttachments";
import styles from "./TaskDetails.module.css";

interface pageProps {
  data: TaskResponseTypes | null | undefined;
  getTaskById: (id: string) => void;
}

const ViewTaskAttachments: FC<pageProps> = ({ data, getTaskById }) => {
  const router = useRouter();

  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );
  const userType = useSelector(
    (state: any) => state.auth.userDetails?.user_details?.user_type
  );

  const [selectedAttachmentIds, setSelectedAttachmentsIds] = useState<
    Array<string>
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [multipleFiles, setMultipleFiles] = useState<any>([]);
  const [files, setFiles] = useState([]);
  const [attachmentData, setAttachmentData] = useState<any>();
  console.log(attachmentData, "lkh")

  useEffect(() => {
    if (router.isReady) {
      getAllAttachments()
    }
  }, [router.isReady, accessToken])

  //get all attachment
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
        authorization: accessToken,
      }),
    };
    try {
      let response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tasks/${router?.query?.task_id}/attachments`,
        options
      );
      let responseData = await response.json();
      if (responseData.status >= 200 && responseData.status <= 300) {
        let modifiedData = groupByDate(responseData?.data?.attachments);
        console.log(modifiedData, "mod")
        setAttachmentData([...modifiedData]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const setUploadedFiles = (filesUploaded: any) => {
    setFiles(filesUploaded);
  };

  const downLoadAttachements = async (file: any) => {
    setLoading(true);
    try {
      if (file) {
        fetch(file)
          .then((response) => {
            // Get the filename from the response headers
            const contentDisposition = response.headers.get(
              "content-disposition"
            );
            let filename = "downloaded_file"; // Default filename if not found in headers

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
    } finally {
      setLoading(false);
    }
  };

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
    setUploadAttachmentsOpen(false);
    let ids = [...selectedAttachmentIds];
    if (ids.includes(item?._id)) {
      ids = ids.filter((itemId: string) => itemId !== item?._id);
    } else {
      ids.push(item?._id);
    }
    setSelectedAttachmentsIds(ids);
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
      setSelectedAttachmentsIds([]);
      getTaskById(router.query.task_id as string);
    } else {
      toast.error(response?.message);
    }

    setDeleteLoading(false);
  };

  const [uploadAttachmentsOpen, setUploadAttachmentsOpen] = useState(false);

  const savetheAttachments = async () => {
    setLoading(true);
    try {
      let body = {
        attachments: files,
      };

      const response = await appendAttachmentsInTaskService({
        taskId: data?._id as string,
        body: body,
        token: accessToken,
      });
      if (response?.success) {
        toast.success(response?.message);
        setUploadAttachmentsOpen(!uploadAttachmentsOpen);
        setFiles([]);
        setMultipleFiles([]);
        getTaskById(data?._id as string);
      } else {
        toast.error(response?.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cancelUpload = () => {
    setUploadAttachmentsOpen(!uploadAttachmentsOpen);
    setFiles([]);
    setMultipleFiles([]);
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
        {userType == "farmer" ? (
          ""
        ) : selectedAttachmentIds?.length ? (
          <Button
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
          </Button>
        ) : (
          <IconButton
            onClick={() => setUploadAttachmentsOpen(!uploadAttachmentsOpen)}
          >
            {uploadAttachmentsOpen ? <ClearIcon /> : <AddIcon />}
          </IconButton>
        )}
      </div>

      <div className={styles.allAttachments}>
        {attachmentData?.length
          ? attachmentData?.map(
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
                          src={item.url}
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

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",

                          gap: "10px",
                        }}
                      >
                        <IconButton
                          onClick={() => {
                            downLoadAttachements(item.url);
                          }}
                        >
                          <ImageComponent
                            src={"/download-1-1.svg"}
                            height={20}
                            width={20}
                            alt={"image"}
                          />
                        </IconButton>
                        <IconButton
                          onClick={() => {
                            // downLoadAttachements(item.url);
                            window.open(item.url);
                          }}
                        >
                          <OpenInNewIcon />
                        </IconButton>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
          )
          : "No Attachements"}
      </div>
      {uploadAttachmentsOpen ? (
        <div>
          <TasksAttachments
            farmId={data?.farm_id?._id}
            setUploadedFiles={setUploadedFiles}
            multipleFiles={multipleFiles}
            setMultipleFiles={setMultipleFiles}
          />
          <div
            style={{
              minHeight: "30px",
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
            }}
          >
            <Button
              className={styles.canceleBtn}
              variant="outlined"
              onClick={() => cancelUpload()}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={() => savetheAttachments()}
              className={styles.saveBtn}
            >
              Save
            </Button>
          </div>
        </div>
      ) : (
        ""
      )}
      <Toaster richColors position="top-right" closeButton />

      <LoadingComponent loading={loading} />
    </div>
  );
};

export default ViewTaskAttachments;
