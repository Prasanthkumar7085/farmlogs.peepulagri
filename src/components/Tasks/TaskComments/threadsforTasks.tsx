import { removeTheAttachementsFilesFromStore } from "@/Redux/Modules/Conversations";
import SkeletonLoadingForAttachments from "@/components/Core/LoadingComponents/SkeletonLoadingForAttachments";
import timePipe from "@/pipes/timePipe";
import {
  Avatar,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "src/components/Scouting/Comments/threads.module.css";
import CommentFormForTasks from "./comment-formForTasks";

const ThreadsForTasks = ({
  deleteLoading,
  details,
  afterCommentAdd,
  afterDeleteComment,
  afterUpdateComment,
  afterReply,
  afterDeleteAttachements,
  taskId,
  farmID,
  loading,
}: any) => {
  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );
  const userDetails = useSelector((state: any) => state.auth.userDetails);

  const router = useRouter();
  const dispatch = useDispatch();

  const [replyOpen, setReplyOpen] = useState<any>(false);
  const [replyIndex, setReplyIndex] = useState<any>();
  const [editMode, setEditMode] = useState<any>([]);
  const [editComment, setEditComment] = useState<any>();
  const [isReplies, setIsReplies] = useState<any>(false);
  const [downloadLoading, setDownLoadLoading] = useState(false);
  const [deleteId, setDeleteId] = useState("");

  useEffect(() => {
    if (afterReply) {
      setReplyOpen(false);
    }
  }, [afterReply]);

  const setDeleteIdOnClick = (id: string) => {
    setDeleteId(id);
    afterDeleteComment(id);
  };
  const downLoadAttachements = async (file: any, userId: any) => {
    setDownLoadLoading(true);

    try {
      fetch(file)
        .then((response) => {
          // Get the filename from the response headers
          const contentDisposition = response.headers.get(
            "content-disposition"
          );
          let filename = "downloaded_file.jpg"; // Default filename if not found in headers

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
        })
        .catch((error) => {
          console.error("Error downloading file:", error);
        });
    } catch (err) {
      console.error(err);
    } finally {
      setDownLoadLoading(false);
    }
  };

  return (
    <div className={styles.threads}>
      {details?.length && !loading ? (
        details.map((item: any, index: any) => {
          console.log(details);
          
          if (item.type == "DIRECT") {
            return (
              <div className={styles.inMessage} key={index}>
                {item?.user?.user_type == "USER" ? (
                  <Avatar sx={{ bgcolor: "chocolate" }}>
                    {item?.user?.user_type?.slice(0, 2)}
                  </Avatar>
                ) : (
                  <Avatar sx={{ bgcolor: "green" }}>
                    {item?.user?.user_type?.slice(0, 2)}
                  </Avatar>
                )}
                <div className={styles.messagebox}>
                  <div className={styles.userdetails}>
                    <h4 className={styles.jack}>
                      {userDetails?.user_details?.user_type ==
                        item?.user?.user_type
                        ? "You"
                        : item?.user?.user_type == "USER"
                          ? item.user.user_type +
                          "(" +
                          item?.user?.full_name +
                          ")"
                          : item.user.user_type}
                    </h4>
                    <p className={styles.aug20231030am}>
                      {timePipe(item.updatedAt, "DD-MM-YYYY hh.mm a")}
                    </p>
                  </div>
                  <div className={styles.paragraph}>
                    {editMode[0] == true && editMode[1] == item._id ? (
                      <div style={{ width: "100%" }}>
                        <TextField
                          className={styles.chatBox}
                          color="primary"
                          rows={2}
                          placeholder="Enter your reply message... "
                          fullWidth={true}
                          variant="outlined"
                          multiline
                          value={editComment}
                          onChange={(e) => {
                            const newValue = e.target.value.replace(/^\s+/, "");
                            setEditComment(newValue);
                          }}
                        />
                      </div>
                    ) : (
                      <p className={styles.theProblemIm}>
                        {item.content}
                        {"                     "}
                        <Typography
                          variant="caption"
                          sx={{ wordBreak: "break-word" }}
                        >
                          {item.createdAt == item.updatedAt ? "" : "(edited)"}
                        </Typography>
                      </p>
                    )}
                    <div className={styles.attachmentContainer}>
                      {item.attachments.length !== 0
                        ? item.attachments.map((file: any, indexfile: any) => {
                          return (
                            <div
                              className={styles.attachment}
                              key={indexfile}
                            >
                              <div className={styles.row}>
                                <div className={styles.icon}>
                                  <img
                                    className={styles.groupIcon}
                                    alt=""
                                    src={
                                      file.type.includes("image")
                                        ? "/group2.svg"
                                        : file.type.includes("application")
                                          ? "/pdf-icon.png"
                                          : file.type.includes("video")
                                            ? "/videoimg.png"
                                            : "/doc-icon.webp"
                                    }
                                  />
                                  <img
                                    className={styles.groupIcon1}
                                    alt=""
                                    src="/group3.svg"
                                  />
                                </div>
                                <div className={styles.imageName}>
                                  {file?.original_name?.slice(0, 9)}...
                                </div>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <IconButton
                                  onClick={() =>
                                    downLoadAttachements(
                                      file.url,
                                      item.user._id
                                    )
                                  }
                                >
                                  <img
                                    className={styles.download11}
                                    alt=""
                                    src="/download-1-1.svg"
                                    style={{ cursor: "pointer" }}
                                  />
                                </IconButton>
                                {userDetails?.user_details?.user_type ==
                                  item?.user?.user_type ? (
                                  <IconButton
                                    onClick={() =>
                                      afterDeleteAttachements(
                                        file._id,
                                        item._id
                                      )
                                    }
                                  >
                                    <Image
                                      alt="Delete"
                                      height={20}
                                      width={20}
                                      src="/farm-delete-icon.svg"
                                      style={{ borderRadius: "5%" }}
                                    />
                                  </IconButton>
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>
                          );
                        })
                        : ""}
                    </div>
                  </div>
                  <div className={styles.actionButton}>
                    <div className={styles.reply}>
                      {replyOpen == false ? (
                        <div
                          className={styles.reply1}
                          onClick={() => {
                            setReplyOpen(true);
                            setReplyIndex(index);
                            dispatch(removeTheAttachementsFilesFromStore([]));
                          }}
                        >
                          <Image
                            alt="Delete"
                            height={20}
                            width={20}
                            src="/comments.svg"
                            style={{ borderRadius: "5%" }}
                          />
                          <span>Reply in thread</span>
                        </div>
                      ) : index == replyIndex ? (
                        <div
                          className={styles.reply1}
                          style={{ color: "red" }}
                          onClick={() => {
                            setReplyOpen(false);
                            setReplyIndex(index);
                          }}
                        >
                          Close
                        </div>
                      ) : (
                        <div
                          className={styles.reply1}
                          onClick={() => {
                            setReplyOpen(true);
                            setReplyIndex(index);
                          }}
                        >
                          Reply in thread
                        </div>
                      )}

                      {isReplies == false && item.replies.length !== 0 ? (
                        <div
                          className={styles.threadReplies}
                          onClick={() => {
                            setIsReplies(true);
                            setReplyIndex(index);
                          }}
                        >
                          <Chip
                            variant="outlined"
                            label={item.replies.length}
                            size="small"
                          />
                          <span>
                            {item.replies.length == 1 ? "reply" : "replies"}
                          </span>
                        </div>
                      ) : item.replies.length !== 0 ? (
                        <div
                          className={styles.threadReplies}
                          onClick={() => {
                            setIsReplies(false);
                            setReplyIndex(index);
                          }}
                        >
                          <Chip
                            variant="outlined"
                            label={item.replies.length}
                            size="small"
                          />
                          <span>
                            {item.replies.length == 1 ? "reply" : "replies"}
                          </span>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>

                    {userDetails?.user_details?.user_type ==
                      item?.user?.user_type ? (
                      <div className={styles.react}>
                        <div className={styles.edit}>
                          <div className={styles.editChild} />

                          {editMode[0] == true && editMode[1] == item._id ? (
                            <Button
                              className={styles.edit1}
                              disabled={editComment ? false : true}
                              onClick={() => {
                                setEditMode([false, item._id]);
                                afterUpdateComment(item._id, editComment);
                              }}
                            >
                              Update
                            </Button>
                          ) : (
                            <p
                              className={styles.edit1}
                              onClick={() => {
                                setEditMode([true, item._id]);
                                setEditComment(item.content);
                              }}
                            >
                              Edit
                            </p>
                          )}
                        </div>
                        {editMode[0] == true && editMode[1] == item._id ? (
                          <div className={styles.edit}>
                            <div className={styles.editChild} />
                            <Button
                              className={styles.edit1}
                              onClick={() => {
                                setEditMode([false, item._id]);
                                setEditComment("");
                              }}
                            >
                              Close
                            </Button>
                          </div>
                        ) : (
                          <div className={styles.edit}>
                            <div className={styles.editChild} />
                            <p
                              className={styles.edit1}
                              onClick={() => setDeleteIdOnClick(item._id)}
                            >
                              Delete
                            </p>
                            <div style={{ minWidth: "100%" }}>
                              {deleteLoading && deleteId == item?._id ? (
                                <CircularProgress
                                  color="inherit"
                                  size={"1.5rem"}
                                />
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>

                  {replyOpen == true && index == replyIndex ? (
                    <div style={{ width: "100%" }}>
                      <CommentFormForTasks
                        replyThreadEvent={item._id}
                        afterCommentAdd={afterCommentAdd}
                        taskId={taskId}
                        farmID={farmID}
                      />
                    </div>
                  ) : (
                    ""
                  )}
                  {isReplies == true &&
                    index == replyIndex &&
                    item.replies.length
                    ? item.replies.map((row: any) => {
                      return (
                        <div className={styles.inMessage1} key={index}>
                          {row?.user?.user_type == "USER" ? (
                            <Avatar sx={{ bgcolor: "chocolate" }}>
                              {row?.user?.user_type?.slice(0, 2)}
                            </Avatar>
                          ) : (
                            <Avatar sx={{ bgcolor: "green" }}>
                              {row?.user?.user_type?.slice(0, 2)}
                            </Avatar>
                          )}{" "}
                          <div className={styles.messagebox1}>
                            <div className={styles.userName}>
                              <div className={styles.userdetails1}>
                                <h4 className={styles.jack}>
                                  {userDetails?.user_details?.user_type ==
                                    row?.user?.user_type
                                    ? "You"
                                    : row?.user?.user_type == "USER"
                                      ? row?.user?.user_type +
                                      "(" +
                                      row?.user?.phone +
                                      ")"
                                      : row?.user?.user_type}
                                </h4>
                                <p className={styles.aug20231030am}>
                                  {timePipe(
                                    row.updatedAt,
                                    "DD-MM-YYYY hh:mm a"
                                  )}
                                </p>
                              </div>
                            </div>
                            <div className={styles.paragraph1}>
                              {editMode[0] == true &&
                                editMode[1] == row._id ? (
                                <div style={{ width: "100%" }}>
                                  <TextField
                                    className={styles.chatBox}
                                    color="primary"
                                    rows={2}
                                    placeholder="Enter your reply message... "
                                    fullWidth={true}
                                    variant="outlined"
                                    multiline
                                    value={editComment}
                                    onChange={(e) => {
                                      const newValue = e.target.value.replace(
                                        /^\s+/,
                                        ""
                                      );
                                      setEditComment(newValue);
                                    }}
                                  />
                                </div>
                              ) : (
                                <p className={styles.theProblemIm}>
                                  {row.content}
                                  {"                     "}
                                  <Typography variant="caption">
                                    {row.createdAt == row.updatedAt
                                      ? ""
                                      : "(edited)"}
                                  </Typography>
                                </p>
                              )}

                              {row.attachments.length
                                ? row.attachments.map(
                                  (file: any, fileIndex: any) => {
                                    return (
                                      <div
                                        className={styles.attachment1}
                                        key={fileIndex}
                                      >
                                        <div className={styles.row}>
                                          <div className={styles.icon}>
                                            <img
                                              className={styles.groupIcon}
                                              alt=""
                                              src="/group2.svg"
                                            />
                                            <img
                                              className={styles.groupIcon1}
                                              alt=""
                                              src="/group3.svg"
                                            />
                                          </div>
                                          <div className={styles.imageName}>
                                            {file?.original_name?.slice(
                                              0,
                                              9
                                            )}
                                            ...
                                          </div>
                                        </div>
                                        <img
                                          className={styles.download11}
                                          alt=""
                                          src="/download-1-1.svg"
                                          style={{ cursor: "pointer" }}
                                          onClick={() =>
                                            downLoadAttachements(
                                              file.url,
                                              row.user._id
                                            )
                                          }
                                        />
                                        {userDetails?.user_details
                                          ?.user_type ==
                                          row?.user?.user_type ? (
                                          <IconButton
                                            onClick={() =>
                                              afterDeleteAttachements(
                                                file._id,
                                                row._id
                                              )
                                            }
                                          >
                                            <Image
                                              alt="Delete"
                                              height={20}
                                              width={20}
                                              src="/farm-delete-icon.svg"
                                              style={{
                                                borderRadius: "5%",
                                              }}
                                            />
                                          </IconButton>
                                        ) : (
                                          ""
                                        )}
                                      </div>
                                    );
                                  }
                                )
                                : ""}
                            </div>
                            ;
                            {userDetails?.user_details?.user_type ==
                              row?.user?.user_type ? (
                              <div className={styles.actionButton1}>
                                <div className={styles.react}>
                                  <div className={styles.edit}>
                                    <div className={styles.editChild} />
                                    {editMode[0] == true &&
                                      editMode[1] == row._id ? (
                                      <Button
                                        className={styles.edit1}
                                        disabled={editComment ? false : true}
                                        onClick={() => {
                                          setEditMode([false, row._id]);
                                          afterUpdateComment(
                                            row._id,
                                            editComment
                                          );
                                        }}
                                      >
                                        Update
                                      </Button>
                                    ) : (
                                      <p
                                        className={styles.edit1}
                                        onClick={() => {
                                          setEditMode([true, row._id]);
                                          setEditComment(row.content);
                                        }}
                                      >
                                        Edit
                                      </p>
                                    )}

                                    <div className={styles.editChild} />
                                    {editMode[0] == true &&
                                      editMode[1] == row._id ? (
                                      <div className={styles.edit}>
                                        <Button
                                          className={styles.edit1}
                                          onClick={() => {
                                            setEditMode([false, row._id]);
                                            setEditComment("");
                                          }}
                                        >
                                          Close
                                        </Button>
                                      </div>
                                    ) : (
                                      <div className={styles.edit}>
                                        <p
                                          className={styles.edit1}
                                          onClick={() =>
                                            afterDeleteComment(row._id)
                                          }
                                        >
                                          Delete
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      );
                    })
                    : ""}
                </div>
              </div>
            );
          }
        })
      ) : !loading ? (
        <div style={{ margin: "auto" }}>No Threads</div>
      ) : (
        <SkeletonLoadingForAttachments />
      )}

      {/* <AlertComponent alertMessage={alertMessage} alertType={alertType} setAlertMessage={setAlertMessage} /> */}
    </div>
  );
};

export default ThreadsForTasks;
