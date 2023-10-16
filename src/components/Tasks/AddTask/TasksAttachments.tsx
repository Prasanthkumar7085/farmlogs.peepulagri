import {
  removeOneElement,
  removeTheFilesFromStore,
  storeFilesArray,
} from "@/Redux/Modules/Farms";
import styles from "@/components/AddLogs/attachments.module.css";
import AttachmentIcon from "@mui/icons-material/Attachment";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DoneIcon from "@mui/icons-material/Done";
import { Box, IconButton, LinearProgress } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles1 from "./../../Scouting/AddItem/add-scout.module.css";
import ErrorMessagesComponent from "@/components/Core/ErrorMessagesComponent";

interface PropTypes {
  farmId: string | undefined;
  setUploadedFiles: (filesUploaded: any) => void;
}
const TasksAttachments: React.FC<PropTypes> = ({
  farmId,
  setUploadedFiles,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const filesFromStore = useSelector((state: any) => state.farms?.filesList);
  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );

  const [multipleFiles, setMultipleFiles] = useState<any>();
  const [fileProgress, setFileProgress] = useState<number[] | any>([]);

  const [attachments, setAttachments] = useState<any>([]);
  const [previewImages, setPreviewImages] = useState<any>([]);
  const [noFarmIdMessage, setNoFarmIdMessage] = useState<string>("");
  const [validations, setValidations] = useState<any>();

  let tempFilesStorage: any = [...attachments];

  let previewStorage = [...previewImages];

  useEffect(() => {
    setUploadedFiles(tempFilesStorage);
  }, [tempFilesStorage]);

  const generateThumbnail = (file: any, index: any) => {
    if (file) {
      const reader = new FileReader();

      reader.onload = async (e: any) => {
        const videoDataUrl = e.target.result;

        // Create a video element dynamically
        const video = document.createElement("video");
        video.src = videoDataUrl;
        video.preload = "auto";

        // Ensure metadata is loaded before capturing a frame
        video.addEventListener("canplay", () => {
          const canvas: any = document.createElement("canvas");
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          canvas
            .getContext("2d")
            .drawImage(video, 0, 0, canvas.width, canvas.height);

          const thumbnailUrl = canvas.toDataURL();
          previewStorage.splice(1, 0, {
            fileIndex: file.name,
            prieviewUrl: thumbnailUrl,
          });
          setPreviewImages(previewStorage);
          video.remove();
        });

        // Start loading the video metadata
      };

      reader.readAsDataURL(file);
    }
  };

  const previewImagesEvent = (file: any, index: any) => {
    if (file) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        previewStorage.splice(1, 0, {
          fileIndex: file.name,
          prieviewUrl: e.target.result,
        });
        setPreviewImages(previewStorage);
      };

      reader.readAsDataURL(file);
    } else {
      setPreviewImages(null);
    }
  };

  const handleFileChange = async (e: any) => {
    if (!farmId) {
      setNoFarmIdMessage("Please Select the Farm to Upload the files");
      return;
    } else {
      setNoFarmIdMessage("");
    }
    let copy = [...e.target.files, ...filesFromStore];
    dispatch(storeFilesArray(e.target.files));

    setMultipleFiles(copy);

    const fileProgressCopy = [...new Array(e.target.files?.length).fill(0)]; // Create a copy of the progress array
    let temp = [...fileProgressCopy, ...fileProgress];
    setFileProgress(temp);

    Array.from(e.target.files).map(async (item: any, index: number) => {
      if (item.type.slice(0, 4) == "vide") {
        generateThumbnail(item, item.name);
      }
      if (item.type.slice(0, 4) == "imag") {
        previewImagesEvent(item, item.name);
      }

      const bytesToMB = (bytes: any) => {
        return bytes / (1024 * 1024);
      };
      if (bytesToMB(item.size) >= 5) {
        await startUploadEvent(item, index, temp, setFileProgress);
      } else {
        await fileUploadEvent(item, index, temp, setFileProgress);
      }
    });
  };

  const startUploadEvent = async (
    file: any,
    index: any,
    fileProgressCopy: any,
    setFileProgress: Function
  ) => {
    let obj = {
      attachment: {
        original_name: file.name,
        farm_id: farmId,
        type: file.type,
        source: "tasks",
      },
    };
    let options = {
      method: "POST",
      headers: new Headers({
        "content-type": "application/json",
        authorization: accessToken,
      }),

      body: JSON.stringify(obj),
    };
    try {
      let response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/scouts/attachments/start-upload`,
        options
      );
      let responseData = await response.json();
      if (responseData.success == true) {
        await uploadFileintoChuncks(
          responseData.data.upload_id,
          file,
          index,
          fileProgressCopy,
          setFileProgress,
          responseData.data.file_key
        );
        tempFilesStorage.splice(1, 0, {
          original_name: responseData.data.original_name,
          type: file.type,
          size: file.size,
          name: responseData.data.name,
          path: responseData.data.path,
        });
        setAttachments(tempFilesStorage);
      } else {
        fileProgressCopy[index] = "fail";
        setFileProgress([...fileProgressCopy]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const uploadFileintoChuncks = async (
    uploadid: any,
    file: any,
    index: any,
    fileProgressCopy: number[],
    setFileProgress: Function,
    key: any
  ) => {
    const chunkSize = 5 * 1024 * 1024; // 1MB chunks (you can adjust this as needed)
    const totalChunks = Math.ceil(file.size / chunkSize);

    let resurls;

    let obj = {
      file_key: key,
      upload_id: uploadid,
      parts: totalChunks,
    };
    let options = {
      method: "POST",
      headers: new Headers({
        "content-type": "application/json",
      }),
      body: JSON.stringify(obj),
    };

    try {
      // Send the chunk to the server using a POST request
      let response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/scouts/attachments/start-upload/presigned-url`,
        options
      );
      let responseData: any = await response.json();
      if (responseData.success == true) {
        resurls = [...responseData.url];

        const promises = [];

        for (let currentChunk = 0; currentChunk < totalChunks; currentChunk++) {
          const start = currentChunk * chunkSize;
          const end = Math.min(start + chunkSize, file.size);
          const chunk = file.slice(start, end);

          // promises.push(axios.put(resurls[currentChunk], chunk))
          let response: any = await fetch(resurls[currentChunk], {
            method: "PUT",
            body: chunk,
          });

          const progress = ((currentChunk + 1) / totalChunks) * 100;
          promises.push(response);

          fileProgressCopy[index] = progress;
          setFileProgress([...fileProgressCopy]);
        }

        let promiseResponseObj = promises.map((part: any, index: any) => ({
          ETag: part.headers.get("Etag").replace(/"/g, ""),
          PartNumber: index + 1,
        }));
        await mergeFileChuncksEvent(promiseResponseObj, uploadid, key, index);
      }
    } catch (error) {
      console.error("Error uploading chunk:", error);
    }
  };

  const mergeFileChuncksEvent = async (
    responseObjs: any,
    uploadid: any,
    file: any,
    index: any
  ) => {
    let obj = {
      file_key: file,
      upload_id: uploadid,
      parts: responseObjs,
    };

    let options = {
      method: "POST",
      headers: new Headers({
        "content-type": "application/json",
      }),
      body: JSON.stringify(obj),
    };
    try {
      let response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/scouts/attachments/complete-upload`,
        options
      );
      let responseData: any = await response.json();
    } catch (err) {
      console.error(err);
    }
  };

  //file upload normal smaller than 5 mb
  const fileUploadEvent = async (
    item: any,
    index: any,
    fileProgressCopy: any,
    setFileProgress: any
  ) => {
    let obj = {
      attachment: {
        original_name: item.name,
        type: item.type,
        size: item.size,
        source: "tasks",
        farm_id: farmId,
      },
    };

    let options: any = {
      method: "POST",
      body: JSON.stringify(obj),
      headers: new Headers({
        "content-type": "application/json",
        authorization: accessToken,
      }),
    };

    try {
      let response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/scouts/attachments`,
        options
      );
      let responseData = await response.json();
      if (responseData.success == true) {
        let preSignedResponse = await fetch(responseData.data.target_url, {
          method: "PUT",
          body: item,
        });
        fileProgressCopy[index] = 100;
        setFileProgress([...fileProgressCopy]);
        tempFilesStorage.splice(1, 0, {
          original_name: responseData.data.original_name,
          type: item.type,
          size: item.size,
          name: responseData.data.name,
          crop_slug: responseData.data.crop_slug,
          path: responseData.data.path,
        });
        setAttachments(tempFilesStorage);
      } else {
        fileProgressCopy[index] = "fail";
        setFileProgress([...fileProgressCopy]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const bytesToMB = (bytes: any) => {
    return bytes / (1024 * 1024);
  };

  const removeFile = (index: number) => {
    const selectedFilesCopy = [...multipleFiles];
    selectedFilesCopy.splice(index, 1);

    const fileProgressCopy = [...fileProgress];
    fileProgressCopy.splice(index, 1);

    const tempFilesStorageCopy = [...tempFilesStorage];
    tempFilesStorageCopy.splice(index, 1);
    dispatch(removeOneElement(index));

    setMultipleFiles(selectedFilesCopy);
    setFileProgress(fileProgressCopy);
  };

  const removeFileAfterAdding = (index: number) => {
    const selectedFilesCopy = [...multipleFiles];
    selectedFilesCopy.splice(index, 1);

    const fileProgressCopy = [...fileProgress];
    fileProgressCopy.splice(index, 1);

    setMultipleFiles(selectedFilesCopy);
    setFileProgress(fileProgressCopy);
    dispatch(removeOneElement(index));
  };

  useEffect(() => {
    if (accessToken) {
      dispatch(removeTheFilesFromStore([]));
    }
  }, [accessToken]);

  //   useEffect(() => {
  //     const confirmationMessage =
  //       "Are you sure you want to leave this page? Your changes may not be saved.";

  //     const handleBeforeUnload = (e: any) => {
  //       e.preventDefault();
  //       e.returnValue = confirmationMessage;
  //     };

  //     window.addEventListener("beforeunload", handleBeforeUnload);

  //     return () => {
  //       window.removeEventListener("beforeunload", handleBeforeUnload);
  //     };
  //   }, []);

  return (
    <div className={styles.attachments} style={{ borderTop: "0 !important", paddingBlock: "0 1.5rem !important" }}>
      <div className={styles.header}>
        <h4 className={styles.title}>Attachments (or) Images</h4>
        <p className={styles.description}>
          You can also drag and drop files to upload them.
        </p>
      </div>

      <label className={styles.UpdateFiles}>
        <div className={styles.link} style={{ background: "#fff !important" }}>
          <AttachmentIcon className={styles.icon} />
          <span>Select Files</span>
        </div>
        <input
          className={styles.link}
          type="file"
          multiple
          onChange={handleFileChange}
          style={{ display: "none" }}
          accept="image/*,video/*"
        />
        <p style={{ color: "red", fontSize: "12px" }}>{noFarmIdMessage}</p>
      </label>
      <ErrorMessagesComponent errorMessage={validations?.attachments} />
      {multipleFiles &&
        Array?.from(multipleFiles).map((item: any, index: any) => (
          <div
            className={styles1.uploadprogress}
            id="upload-progress"
            key={index}
          >
            <div className={styles1.progress} id="progress">
              <img
                className={styles1.image21}
                alt=""
                src={
                  previewImages.find((e: any) => e.fileIndex == item.name)
                    ?.prieviewUrl
                    ? previewImages.find((e: any) => e.fileIndex == item.name)
                      .prieviewUrl
                    : item.type == "application/pdf"
                      ? "/pdf-icon.png"
                      : "/doc-icon.webp"
                }
              />
              <div className={styles1.progressdetails}>
                <div className={styles1.uploaddetails}>
                  <div className={styles1.uploadcontroller}>
                    <div className={styles1.uploadname}>
                      <div className={styles1.uploadItem}>
                        <div
                          className={styles1.photojpg}
                          style={{
                            color: fileProgress[index] == "fail" ? "red" : "",
                          }}
                        >
                          {item.name?.slice(0, 15)}...
                          {item.type?.slice(-15)}{" "}
                        </div>
                        {fileProgress[index] == "fail" ? (
                          <div
                            className={styles1.photojpg}
                            style={{ color: "red" }}
                          >
                            Cancelled
                          </div>
                        ) : (
                          <div className={styles1.photojpg}>
                            {bytesToMB(item.size).toFixed(2)}MB
                          </div>
                        )}
                      </div>
                      {fileProgress[index] == 100 &&
                        fileProgress[index] !== "fail" ? (
                        <div className={styles1.photojpg}>
                          <IconButton>
                            <DoneIcon sx={{ color: "#05A155" }} />
                          </IconButton>
                          <IconButton
                            onClick={() => removeFileAfterAdding(index)}
                          >
                            <DeleteForeverIcon sx={{ color: "#820707" }} />
                          </IconButton>
                        </div>
                      ) : (
                        ""
                      )}
                      {fileProgress[index] !== 100 ||
                        fileProgress[index] == "fail" ? (
                        <img
                          className={styles1.close41}
                          alt=""
                          src="/close-icon.svg"
                          onClick={() => removeFile(index)}
                        />
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <Box sx={{ width: "100%" }}>
                    {fileProgress[index] == 0 &&
                      fileProgress[index] !== "fail" ? (
                      <LinearProgress />
                    ) : fileProgress[index] !== 100 &&
                      fileProgress[index] !== "fail" ? (
                      <LinearProgress
                        variant="determinate"
                        value={fileProgress[index]}
                      />
                    ) : (
                      ""
                    )}
                  </Box>
                </div>
                {fileProgress[index] == 100 || fileProgress[index] == "fail" ? (
                  ""
                ) : (
                  <div className={styles1.uploadstatus}>
                    <div className={styles1.completed}>
                      {fileProgress[index]?.toFixed(2) + "%"}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default TasksAttachments;
