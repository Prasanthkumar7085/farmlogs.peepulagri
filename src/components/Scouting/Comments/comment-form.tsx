import { removeUserDetails } from "@/Redux/Modules/Auth";
import {
  deleteAllMessages,
  removeOneAttachmentElement,
  removeTheAttachementsFilesFromStore,
  storeAttachementsFilesArray,
} from "@/Redux/Modules/Conversations";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DoneIcon from "@mui/icons-material/Done";
import {
  Box,
  Button,
  IconButton,
  LinearProgress,
  TextField,
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import styles from "./comment-form.module.css";

const CommentForm = ({
  afterCommentAdd,
  replyThreadEvent,
  scoutDetails,
  attachement,
}: any) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );
  const filesFromStore = useSelector(
    (state: any) => state.conversation?.attachmentsFilesList
  );

  const [, , removeCookie] = useCookies(["userType"]);
  const [, , loggedIn] = useCookies(["loggedIn"]);

  const [comment, setComment] = useState<any>();
  const [multipleFiles, setMultipleFiles] = useState<any>([]);
  const [fileProgress, setFileProgress] = useState<number[] | any>([]);
  const [attachments, setAttachments] = useState<any>([]);
  const [selectedCrop, setSelectedCrop] = useState<any>();
  const [loading, setLoading] = useState<any>();

  let tempFilesStorage: any = [...attachments];

  useEffect(() => {
    dispatch(removeTheAttachementsFilesFromStore([]));
  }, []);

  useEffect(() => {
    const confirmationMessage =
      "Are you sure you want to leave this page? Your changes may not be saved.";

    const handleBeforeUnload = (e: any) => {
      e.preventDefault();
      e.returnValue = confirmationMessage;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  //convert the kb into mb
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
    dispatch(removeOneAttachmentElement(index));

    setMultipleFiles(selectedFilesCopy);
    setFileProgress(fileProgressCopy);
  };

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
    dispatch(removeOneAttachmentElement(index));
  };

  //get all crops name
  const getCropsDetails = async () => {
    try {
      let response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/farm/${router.query.farm_id
          ? router.query.farm_id
          : scoutDetails.farm_id
        }/crops/list`,
        { method: "GET" }
      );
      let responseData: any = await response.json();

      if (responseData.success == true) {
        if (router.query.crop_id) {
          let cropObj = responseData?.data?.find((item: any) =>
            item._id == router.query.crop_id
              ? router.query.crop_id
              : scoutDetails.crop_id?._id
          );
          setSelectedCrop(cropObj);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addComment = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    let body = {
      content: comment,
    };
    let options = {
      method: "POST",
      headers: new Headers({
        "content-type": "application/json",
        authorization: accessToken,
      }),
      body: JSON.stringify(body),
    };
    try {
      let response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/farm-images/${attachement?._id}/comment`,
        options
      );
      let responseData = await response.json();
      if (responseData.success == true) {
        setComment("");
        afterCommentAdd(true);
        setMultipleFiles([]);
        setAttachments([]);
        dispatch(removeTheAttachementsFilesFromStore([]));
      } else if (responseData?.statusCode == 403) {
        await logout();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      removeCookie("userType");
      loggedIn("loggedIn");
      router.push("/");
      await dispatch(removeUserDetails());
      await dispatch(deleteAllMessages());
    } catch (err: any) {
      console.error(err);
    }
  };

  const replyThreads = async (comment_id: any) => {
    if (loading) {
      return;
    }
    setLoading(true);
    let body = {
      content: comment,
      reply_to: comment_id,
    };
    let options = {
      method: "POST",
      headers: new Headers({
        "content-type": "application/json",
        authorization: accessToken,
      }),
      body: JSON.stringify(body),
    };
    try {
      let response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/farm-images/${attachement?._id}/comment`,
        options
      );
      let responseData = await response.json();
      if (responseData.success == true) {
        setComment("");
        afterCommentAdd(true);
        setMultipleFiles([]);
        setAttachments([]);
        dispatch(removeTheAttachementsFilesFromStore([]));
        dispatch(removeTheAttachementsFilesFromStore([]));
      } else if (responseData?.statusCode == 403) {
        await logout();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  //files upload event
  const handleFileChange = async (e: any) => {
    let copy = [...e.target.files, ...filesFromStore];
    dispatch(storeAttachementsFilesArray(e.target.files));

    const fileProgressCopy = [...new Array(e.target.files?.length).fill(0)]; // Create a copy of the progress array
    let temp = [...fileProgressCopy, ...fileProgress];
    setFileProgress(temp);
    setMultipleFiles(copy);

    Array.from(e.target.files).map(async (item: any, index: number) => {
      await fileUploadEvent(item, index, temp, setFileProgress);
    });
  };

  //file upload normal smaller than 5 mb
  const fileUploadEvent = async (
    item: any,
    index: any,
    fileProgressCopy: any,
    setFileProgress: any
  ) => {
    fileProgressCopy[index] = 0;

    let obj = {
      attachment: {
        original_name: item.name,
        type: item.type,
        size: item.size,
        source: "scouting",
        crop_slug: selectedCrop?.slug,
        farm_id: router.query.farm_id
          ? router.query.farm_id
          : scoutDetails.farm_id?._id,
      },
    };
    fileProgressCopy[index] = 25;

    let options: any = {
      method: "POST",
      body: JSON.stringify(obj),
      headers: new Headers({
        "content-type": "application/json",
        authorization: accessToken,
      }),
    };
    fileProgressCopy[index] = 50;

    try {
      let response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/scouts/attachments`,
        options
      );
      let responseData = await response.json();
      fileProgressCopy[index] = 75;

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

  return (
    <div className={styles.commentform}>
      <TextField
        required={true}
        className={styles.chatBox}
        color="primary"
        rows={2}
        placeholder="Enter your Message... "
        fullWidth={true}
        variant="outlined"
        multiline
        value={comment ? comment : ""}
        onChange={(e) => {
          const newValue = e.target.value.replace(/^\s+/, "");
          setComment(newValue);
        }}
        onKeyDown={(e: any) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            comment &&
              (replyThreadEvent
                ? replyThreads(replyThreadEvent)
                : addComment());
          }
        }}
      />

      {multipleFiles &&
        Array?.from(multipleFiles).map((item: any, index: any) => (
          <div
            className={styles.uploadprogress}
            id="upload-progress"
            key={index}
          >
            <div
              className={styles.progress}
              id="progress"
              style={{ width: "100%" }}
            >
              <img className={styles.image21} alt="" src={"/nj.jpg"} />

              <div className={styles.progressdetails}>
                <div className={styles.uploaddetails} style={{ width: "100%" }}>
                  <div className={styles.uploadcontroller}>
                    <div
                      className={styles.uploadname}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div className={styles.uploadItem}>
                        <div
                          className={styles.photojpg}
                          style={{
                            color: fileProgress[index] == "fail" ? "red" : "",
                          }}
                        >
                          {index + 1}. {item.name?.slice(0, 7)}...{item.type}{" "}
                        </div>
                        {fileProgress[index] == "fail" ? (
                          <div
                            className={styles.photojpg}
                            style={{ color: "red" }}
                          >
                            Cancelled
                          </div>
                        ) : (
                          <div className={styles.photojpg}>
                            {bytesToMB(item.size).toFixed(2)}MB
                          </div>
                        )}
                      </div>
                      {fileProgress[index] == 100 &&
                        fileProgress[index] !== "fail" ? (
                        <div className={styles.photojpg}>
                          <IconButton>
                            <DoneIcon sx={{ color: "#05A155" }} />
                          </IconButton>
                          <IconButton
                            onClick={() => removeFileAfterAdding(index, item)}
                          >
                            <DeleteForeverIcon sx={{ color: "#820707" }} />
                          </IconButton>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                    {fileProgress[index] !== 100 ||
                      fileProgress[index] == "fail" ? (
                      <img
                        className={styles.close41}
                        alt=""
                        src="/close-icon.svg"
                        onClick={() => removeFileAfterAdding(index, item)}
                      />
                    ) : (
                      ""
                    )}
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
      <div className={styles.actions}>
        <div className={styles.attachments}>
          <div className={styles.link}>
            <label>
              <img
                className={styles.groupIcon}
                alt="Attachment"
                src="/attachment-icon.svg"
              />
              <input
                type="file"
                alt="images-upload"
                multiple
                accept=".pdf, image/*, video/*"
                onChange={handleFileChange}
                hidden
              />
            </label>
          </div>
          <label>
            <img
              className={styles.imageIcon}
              alt="Images"
              src="/image-icon.svg"
            />
            <input
              type="file"
              alt="images-upload"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              hidden
            />
          </label>
        </div>

        <Button
          className={
            comment && !loading ? styles.sendbutton : styles.sendbuttonDisable
          }
          size="medium"
          variant="contained"
          onClick={() =>
            replyThreadEvent ? replyThreads(replyThreadEvent) : addComment()
          }
        >
          {loading ? "Sending..." : "Send"}
        </Button>
      </div>
    </div>
  );
};

export default CommentForm;
