import {
  removeOneElement,
  removeTheFilesFromStore,
  storeFilesArray,
} from "@/Redux/Modules/Farms";
import AlertComponent from "@/components/Core/AlertComponent";
import ErrorMessagesComponent from "@/components/Core/ErrorMessagesComponent";
import LoadingComponent from "@/components/Core/LoadingComponent";
import TagsTextFeild from "@/components/Core/TagsTextFeild";
import base64ToFile from "@/pipes/base64FileConvert";
import timePipe from "@/pipes/timePipe";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DoneIcon from "@mui/icons-material/Done";
import {
  Box,
  Button,
  Icon,
  IconButton,
  LinearProgress,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import getAllFarmsService from "../../../../lib/services/FarmsService/getAllFarmsService";
import Header1 from "../Header/HeaderComponent";
import Camera from "./Camera";
import styles from "./add-scout.module.css";
import { Toaster, toast } from "sonner";

interface propsTypesTagAndComment {
  url: string;
  body: {
    farm_image_ids: string[];
    tags?: string[];
    content?: string;
  };
}

const FileUploadComponent = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const filesFromStore = useSelector((state: any) => state.farms?.filesList);

  const [openCamera, setOpenCamera] = useState<any>(false);
  const [loading, setLoading] = useState<any>(false);
  const [multipleFiles, setMultipleFiles] = useState<any>();

  const [fileProgress, setFileProgress] = useState<number[] | any>([]);
  const [description, setDescription] = useState<string>("");
  const [attachments, setAttachments] = useState<any>([]);
  const [previewImages, setPreviewImages] = useState<any>([]);
  const [validations, setValidations] = useState<any>();
  const [tags, setTags] = useState<any>([]);

  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );

  let tempFilesStorage: any = [...attachments];

  let previewStorage = [...previewImages];

  const removeFileAfterAdding = (index: number, file: any) => {
    const selectedFilesCopy = [...multipleFiles];
    selectedFilesCopy.splice(index, 1);

    const fileProgressCopy = [...fileProgress];
    fileProgressCopy.splice(index, 1);

    const tempFilesStorageCopy = [...tempFilesStorage];
    const newArray = tempFilesStorageCopy.filter(
      (item: any) => item.original_name !== file.name
    );
    tempFilesStorage = newArray;
    setAttachments(newArray);

    setMultipleFiles(selectedFilesCopy);
    setFileProgress(fileProgressCopy);
    dispatch(removeOneElement(index));
    toast.success("File deleted successfully")
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

  //select the when input select
  const handleFileChange = async (e: any) => {
    setValidations({});
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

  //start the file upload event
  const startUploadEvent = async (
    file: any,
    index: any,
    fileProgressCopy: any,
    setFileProgress: Function
  ) => {
    let obj =
    {
      "farm_id": router.query.farm_id as string,
      "crop_id": router.query.crop_id,
      "original_name": file.name,
      "type": file.type,
      "size": file.size
    }


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
        `${process.env.NEXT_PUBLIC_API_URL}/farm-images/image/start-upload`,
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

  //file upload into multipart
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
        authorization: accessToken,
      }),
      body: JSON.stringify(obj),
    };

    try {
      // Send the chunk to the server using a POST request
      let response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/farm-images/image/start-upload/presigned-url`,
        options
      );
      let responseData: any = await response.json();
      if (responseData.success == true) {
        resurls = [...responseData.data];

        const promises = [];

        for (let currentChunk = 0; currentChunk < totalChunks; currentChunk++) {
          const start = currentChunk * chunkSize;
          const end = Math.min(start + chunkSize, file.size);
          const chunk = file.slice(start, end);

          // promises.push(axios.put(resurls[currentChunk], chunk))
          let response: any = await fetch(resurls[currentChunk], {
            method: "PUT",
            headers: new Headers({
              "content-type": "application/json",
              authorization: accessToken,
            }),
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

  //last part of the file upload (merge all presigned urls)
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
        `${process.env.NEXT_PUBLIC_API_URL}/farm-images/image/complete-upload`,
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
      "farm_id": router.query.farm_id,
      "crop_id": router.query.crop_id,
      "original_name": item.name,
      "type": item.type,
      "size": item.size
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
        `${process.env.NEXT_PUBLIC_API_URL}/farm-images/image`,
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
          path: responseData?.data?.path,
          key: responseData?.data?.key
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

  useEffect(() => {
    if (router.query.farm_id && accessToken) {
      dispatch(removeTheFilesFromStore([]));
    }
  }, [accessToken, router.query.farm_id]);

  // useEffect(() => {
  //   const confirmationMessage =
  //     "Are you sure you want to leave this page? Your changes may not be saved.";

  //   const handleBeforeUnload = (e: any) => {
  //     e.preventDefault();
  //     e.returnValue = confirmationMessage;
  //   };

  //   window.addEventListener("beforeunload", handleBeforeUnload);

  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //   };
  // }, []);

  const addScoutDetails = async () => {
    let imagesIdsArray: any = [];
    setLoading(true);

    try {
      let isExecuted = false;
      await Promise.allSettled(
        tempFilesStorage.map(async (file: any, index: any) => {
          let obj = {
            farm_id: router.query.farm_id,
            crop_id: router?.query?.crop_id,
            key: file.key,
            metadata: {
              original_name: file?.original_name,
              size: file?.size,
              type: file?.type,
            },
            tags: [],
          };

          let options: any = {
            method: "POST",
            body: JSON.stringify(obj),
            headers: new Headers({
              "content-type": "application/json",
              authorization: accessToken,
            }),
          };
          let response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/farm-images`,
            options
          );
          let responseData = await response.json();
          if (responseData?.success) {
            imagesIdsArray.push(responseData?.data?._id);
            isExecuted = true;
          } else if (responseData?.status == 422) {
            setValidations(responseData?.errors);
            isExecuted = false;
          }
        })
      );
      if (isExecuted) {
        if (tags?.length || description?.length) {
          await addTagsAndCommentsEvent(imagesIdsArray);
        }
        else {
          toast.success("Farm Images added successfully");
          router.back()


        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
    dispatch(removeTheFilesFromStore([]));
  };

  //onClose camera
  const captureCloseCamera = (value: any, file: any) => {
    if (value == true) {
      setOpenCamera(false);
    } else {
      setOpenCamera(false);
      let fileAfterconevert = base64ToFile(
        file,
        `capture${Math.floor(Math.random() * 100) + 1}_image${timePipe(
          new Date(),
          "DD-MM-YY"
        )}.jpeg`,
        "image/jpeg"
      );
      previewImagesEvent(fileAfterconevert, 0);
      let temp1: any = [fileAfterconevert];
      let copy = [...temp1, ...filesFromStore];
      setMultipleFiles(copy);
      const fileProgressCopy = [...new Array(temp1?.length).fill(0)]; // Create a copy of the progress array
      let temp = [
        ...fileProgressCopy,
        ...new Array(filesFromStore?.length).fill(100),
      ];
      setFileProgress(temp);
      fileUploadEvent(fileAfterconevert, 0, temp, setFileProgress);
      dispatch(storeFilesArray(temp1));
    }
  };
  //capture vedio
  const captureCameraVedio = (value: any, videofile: any) => {
    setOpenCamera(false);
    const type = "video/webm";
    const file = new File([videofile], `my video.webm`, { type });
    let temp1: any = [file];
    let copy = [...temp1, ...filesFromStore];
    setMultipleFiles(copy);
    const fileProgressCopy = [...new Array(temp1?.length).fill(0)]; // Create a copy of the progress array
    let temp = [
      ...fileProgressCopy,
      ...new Array(filesFromStore?.length).fill(100),
    ];
    setFileProgress(temp);
    dispatch(storeFilesArray(temp1));
    generateThumbnail(file, 0);

    const bytesToMB = (bytes: any) => {
      return bytes / (1024 * 1024);
    };
    if (bytesToMB(file.size) >= 5) {
      startUploadEvent(file, 0, temp, setFileProgress);
    } else {
      fileUploadEvent(file, 0, temp, setFileProgress);
    }
  };

  // //capture the tags
  const captureTags = (array: any) => {
    if (array) {
      setTags(array);
    }
  };

  //add tags api
  const addTagsAndCommentsEvent = async (imagesArray: string[]) => {
    try {
      let urls = [
        {
          url: "/farm-images/tag",
          body: {
            farm_image_ids: imagesArray,
            tags: tags,
          },
        },
        {
          url: "/farm-images/comments",
          body: {
            farm_image_ids: imagesArray,
            content: description,
          },
        },
      ];

      let success = true;
      await Promise.allSettled(
        urls.map(async (item: propsTypesTagAndComment, index: number) => {
          if ((!index && tags.length) || (!!index && description?.length)) {
            let options = {
              method: "POST",
              headers: new Headers({
                "content-type": "application/json",
                authorization: accessToken,
              }),
              body: JSON.stringify(item.body),
            };

            let response: any = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}${item.url}`,
              options
            );
            let responseData = await response.json();
            if (responseData.success) {
              // toast.success(responseData?.message);
            } else {
              success = false;
              toast.error(responseData?.message);
              throw responseData;
            }
          }
        })
      );
      if (success) {
        toast.success("Farm Images added successfully");
        router.back();
      }
    } catch (err) {
      console.error(err);
    }
    finally {

      setLoading(false);

    }
  };

  return (
    <div>
      {openCamera == true ? (
        <Camera
          openCamera={openCamera}
          captureCloseCamera={captureCloseCamera}
          captureCameraVedio={captureCameraVedio}
        />
      ) : (
        <div>
          {/* <Header1
            name={"Add Scout"}
            router={`/farms/${router.query.farm_id}/crops`}
          /> */}
          <div className={styles.header} id="header">
            <img
              className={styles.iconsiconArrowLeft}
              alt=""
              src="/iconsiconarrowleft.svg"
              onClick={() => router.back()}
            />
            <Typography className={styles.viewFarm}>Add Scout</Typography>
            <div className={styles.headericon} id="header-icon">
            </div>
          </div>

          <div className={styles.addscout} id="add-scout">
            <div className={styles.scoutdetails} id="scout-details">
              <div className={styles.addscoutdetails} id="add-scout-details">
                <div className={styles.farmselection} id="images">
                  <div className={styles.inputField}>
                    <div className={styles.label1}></div>
                  </div>

                  <div className={styles.farmselection} id="images">
                    <div className={styles.inputField}>
                      <div className={styles.label1}>
                        Images
                        <strong style={{ color: "rgb(228 12 15)" }}>*</strong>
                      </div>
                    </div>
                    <div className={styles.imagesupload} id="images-upload">
                      {/* <div className={styles.captureimage} id="capture-image">
                        <div className={styles.camera}>
                          <img
                            className={styles.camera1Icon}
                            alt=""
                            src="/camera-1.svg"
                            onClick={() => setOpenCamera(true)}
                          />

                          <div className={styles.capture}> Capture </div>
                        </div>
                      </div> */}
                      <div id="capture-image">
                        <div className={styles.uploadimage}>
                          <label>
                            <img alt="" src="/upload-image-icon.svg" />
                            <input
                              type="file"
                              alt="images-upload"
                              accept="image/*"
                              multiple
                              onChange={handleFileChange}
                              hidden
                            />
                          </label>

                          <div className={styles.capture}> Upload </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <ErrorMessagesComponent
              errorMessage={validations?.farm_image_ids}
            />
            {multipleFiles &&
              Array?.from(multipleFiles).map((item: any, index: any) => (
                <div
                  className={styles.uploadprogress}
                  id="upload-progress"
                  key={index}
                >
                  <div className={styles.progress} id="progress">
                    <img
                      className={styles.image21}
                      alt=""
                      src={
                        previewImages.find((e: any) => e.fileIndex == item.name)
                          ?.prieviewUrl
                          ? previewImages.find(
                            (e: any) => e.fileIndex == item.name
                          ).prieviewUrl
                          : item.type == "application/pdf"
                            ? "/pdf-icon.png"
                            : "/doc-icon.webp"
                      }
                    />
                    <div className={styles.progressdetails}>
                      <div className={styles.uploaddetails}>
                        <div className={styles.uploadcontroller}>
                          <div className={styles.uploadname}>
                            <div className={styles.uploadItem}>
                              <div
                                className={styles.photojpg}
                                style={{
                                  color:
                                    fileProgress[index] == "fail" ? "red" : "",
                                }}
                              >
                                {item.name?.length > 25
                                  ? item.name?.slice(0, 22) + "..."
                                  : item.name}
                              </div>
                              {fileProgress[index] == "fail" ? (
                                <div
                                  className={styles.photojpg}
                                  style={{ color: "red" }}
                                >
                                  Cancelled
                                </div>
                              ) : (
                                ""
                              )}
                            </div>
                            {fileProgress[index] == 100 &&
                              fileProgress[index] !== "fail" ? (
                              <div className={styles.photojpg}>
                                <IconButton>
                                  <DoneIcon sx={{ color: "#05A155" }} />
                                </IconButton>
                                <IconButton
                                  onClick={() =>
                                    removeFileAfterAdding(index, item)
                                  }
                                >
                                  <DeleteForeverIcon
                                    sx={{ color: "#820707" }}
                                  />
                                </IconButton>
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                          {/* {fileProgress[index] !== 100 ||
                            fileProgress[index] == "fail" ? (
                            <img
                              className={styles.close41}
                              alt=""
                              src="/close-icon.svg"
                              onClick={() => removeFileAfterAdding(index, item)}
                            />
                          ) : (
                            ""
                          )} */}
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
                      {fileProgress[index] == 100 ||
                        fileProgress[index] == "fail" ? (
                        ""
                      ) : (
                        <div className={styles.uploadstatus}>
                          <div className={styles.completed}>
                            {fileProgress[index]?.toFixed(2) + "%"}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

            <div className={styles.scoutdescription} id="scout-description">
              {multipleFiles?.length ?
                <div className={styles.descriptionblock}>

                  <div className={styles.addscoutdetails}>
                    <div className={styles.inputField}>
                      <div style={{ width: "100%" }} className={styles.input}>
                        <TagsTextFeild captureTags={captureTags} />
                      </div>
                      <div
                        className={styles.farmselection}
                        id="input-description"
                      >
                        <div className={styles.label1}>Comments</div>
                        <TextField
                          className={styles.input}
                          color="primary"
                          name="desciption"
                          id="description"
                          minRows={4}
                          maxRows={4}
                          placeholder="Enter your comment here"
                          fullWidth={true}
                          variant="outlined"
                          multiline
                          value={description}
                          onChange={(e) => {
                            setDescription(e.target.value);
                            setValidations({});
                          }}
                          sx={{ background: "#fff" }}
                        />
                        <ErrorMessagesComponent
                          errorMessage={validations?.description}
                        />
                      </div>
                    </div>
                  </div>

                  <div className={styles.footeractionbuttons} id="footer-buttons">
                    <div className={styles.buttons} id="buttons">
                      <Button
                        className={styles.back}
                        sx={{ width: 130 }}
                        color="primary"
                        name="back"
                        id="back"
                        size="large"
                        variant="outlined"
                        onClick={() => router.back()}
                      >
                        Go Back
                      </Button>
                      <Button
                        className={styles.submit}

                        name="submit"
                        id="submit"
                        size="large"
                        variant="contained"
                        disabled={!tempFilesStorage.length || loading}
                        onClick={() => addScoutDetails()}
                      >
                        Submit
                      </Button>
                    </div>
                  </div>
                </div> : ""}
            </div>
          </div>
        </div>
      )}
      <Toaster richColors closeButton position="top-right" />
      <LoadingComponent loading={loading} />
    </div>
  );
};
export default FileUploadComponent;
