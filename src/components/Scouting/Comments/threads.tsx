import { removeTheAttachementsFilesFromStore } from "@/Redux/Modules/Conversations";
import AlertComponent from "@/components/Core/AlertComponent";
import Image from "@/components/Core/ImageComponent";
import LoadingComponent from "@/components/Core/LoadingComponent";
import timePipe from "@/pipes/timePipe";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Avatar, Box, Button, Chip, IconButton, Skeleton, TextField, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CommentForm from "./comment-form";
import styles from "./threads.module.css";
import ChatIcon from '@mui/icons-material/Chat';
import { Markup } from "interweave";

const Threads = ({ details, afterCommentAdd, afterDeleteComment,
  afterUpdateComment,
  afterReply,
  afterDeleteAttachements,
  loadingThreads,
  setLoading,
  scoutDetails,
  attachement }: any) => {

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
  const [loading, setLoading1] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState(false);

  const downLoadAttachements = async (file: any, userId: any) => {
    setLoading1(true);
    let body = {
      attachment: {
        name: file.name,
        type: file.type,
        crop_slug: file.crop_slug,
        source: "scouting",
        user_id: userId,
      },
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
        `${process.env.NEXT_PUBLIC_API_URL}/farm/${router.query.farm_id
          ? router.query.farm_id
          : scoutDetails?.farm_id?._id
        }/attachment/download-url`,
        options
      );
      let responseData = await response.json();
      if (responseData.success == true) {
        fetch(responseData.data.download_url)
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
          })
          .catch((error) => {
            console.error("Error downloading file:", error);
          });
        setAlertMessage("Attachement downloaded successfully");
        setAlertType(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading1(false);
    }
  };

  const lastCommentRef = useRef<any>(null);

  useEffect(() => {
    scrollToBottom();
  }, [details]);

  const scrollToBottom = () => {
    if (lastCommentRef.current) {
      lastCommentRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };


  useEffect(() => {
    setEditMode([false, ""]);
    setEditComment("");
  }, [attachement?._id])


  return (
    <div className={styles.threads} >
      {details?.length ? (
        details.map((item: any, index: any) => {
          if (!item.reply_to) {
            const itemCreatedAt: any = new Date(item.createdAt);
            const currentDate: any = new Date();
            const timeDifferenceInMilliseconds = currentDate - itemCreatedAt;
            const timeDifferenceInMinutes =
              timeDifferenceInMilliseconds / (1000 * 60);
            return (
              <div className={styles.inMessage} key={index} ref={index === details.length - 1 ? lastCommentRef : null}>
                {item?.commented_by?.user_type == "farmer" ? (
                  <Avatar sx={{ bgcolor: "#D94841", height: "20px", width: "21px", fontSize: "7px" }}>
                    {item?.commented_by?.name?.slice(0, 2).toUpperCase()}
                  </Avatar>
                ) : (
                  <Avatar sx={{ bgcolor: "green", height: "20px", width: "21px", fontSize: "7px" }}>
                    {item?.commented_by?.name?.slice(0, 2).toUpperCase()}
                  </Avatar>
                )}
                <div className={styles.messagebox}>
                  <div className={styles.userdetails}>
                    <h4 className={styles.jack}>
                      {userDetails?.user_details?._id ==
                        item?.commented_by?._id
                        ? "You"
                        : item?.commented_by?._id !==
                          userDetails?.user_details?._id
                          ? item.commented_by?.name
                          : item?.user_type}
                    </h4>
                    <p className={styles.aug20231030am}>
                      {timePipe(item.updatedAt, "DD-MM-YYYY hh:mm a")}
                    </p>
                  </div>
                  <div className={styles.paragraph}>
                    {editMode[0] == true && editMode[1] == item._id ? (
                      <div style={{ width: "100%" }}>
                        <TextField
                          sx={{

                            '& .MuiInputBase-root': {
                              fontSize: "clamp(12px, 0.72vw, 14px)",
                              fontFamily: "'Inter', sans-serif"
                            }
                          }}
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
                        <Markup content={item.content}
                          noWrap={false}
                          disableLineBreaks={false}
                        />
                        <Typography
                          variant="caption"
                          sx={{ wordBreak: "break-word", }}
                        >
                          {item.createdAt == item.updatedAt ? "" : "(edited)"}
                        </Typography>
                      </p>
                    )}
                    <div className={styles.attachmentContainer}>
                      {item.attachments?.length !== 0
                        ? item?.attachments?.map(
                          (file: any, indexfile: any) => {
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
                                        file,
                                        item.user[0]._id
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
                                    item?.commented_by?.user_type ? (
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
                          }
                        )
                        : ""}
                    </div>
                  </div>
                  <div className={styles.actionButton}>
                    {/* <div className={styles.reply}>
                      {replyOpen == false ? (
                        ""
                      ) : // <div
                      //   className={styles.reply1}
                      //   onClick={() => {
                      //     setReplyOpen(true);
                      //     setReplyIndex(index);
                      //     dispatch(removeTheAttachementsFilesFromStore([]));
                      //   }}
                      // >
                      //   <Image
                      //     alt="Delete"
                      //     height={20}
                      //     width={20}
                      //     src="/icons/comment-reply.svg"
                      //     style={{ borderRadius: "5%" }}
                      //   />
                      //   <span>Reply in thread</span>
                      // </div>
                      index == replyIndex ? (
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

                      {isReplies == false && item.replies?.length !== 0 ? (
                        <div
                          className={styles.threadReplies}
                          onClick={() => {
                            setIsReplies(true);
                            setReplyIndex(index);
                          }}
                        >
                          <Chip
                            variant="outlined"
                            label={item.replies?.length}
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
                    </div> */}

                    {userDetails?.user_details?.user_type ==
                      item?.commented_by?.user_type ? (
                      <div className={styles.react}>
                        {(currentDate - itemCreatedAt) / (1000 * 60) > 15 ? (
                          ""
                        ) : (
                          <div className={styles.edit}>
                            <div className={styles.editChild} />
                            {editMode[0] == true &&
                              editMode[1] == item._id ? (
                              <Button
                                sx={{ minWidth: "inherit", padding: "0" }}
                                className={styles.edit1}
                                disabled={editComment ? false : true}
                                onClick={() => {
                                  setEditMode([false, item._id]);
                                  afterUpdateComment(item._id, editComment);
                                  setEditComment("")
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
                        )}

                        {editMode[0] == true && editMode[1] == item._id ? (
                          <div className={styles.edit}>
                            <div className={styles.editChild} />
                            <Button
                              sx={{ minWidth: "inherit", padding: "0" }}

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
                          <div
                            className={styles.edit}
                            style={{
                              display:
                                (currentDate - itemCreatedAt) / (1000 * 60) >
                                  15 ||
                                  item.replies.some(
                                    (reply: any) =>
                                      reply?.commented_by?.user_type !==
                                      userDetails?.user_details?.user_type
                                  )
                                  ? "none"
                                  : "flex",
                            }}
                          >
                            <div className={styles.editChild} />
                            <p
                              className={styles.edit1}
                              onClick={() => afterDeleteComment(item._id)}
                            >
                              Delete
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>

                  {replyOpen == true && index == replyIndex ? (
                    <div style={{ width: "100%" }}>
                      <CommentForm
                        replyThreadEvent={item._id}
                        afterCommentAdd={afterCommentAdd}
                        scoutDetails={scoutDetails}
                        attachement={attachement}
                      />
                    </div>
                  ) : (
                    ""
                  )}
                  {(replyOpen == true && index == replyIndex) ||
                    (isReplies == true &&
                      index == replyIndex &&
                      item.replies.length)
                    ? item.replies.map((row: any) => {
                      const lines = row.content.split("\n");
                      const rowCreatedAt: any = new Date(row.createdAt);
                      const currentDate: any = new Date();
                      const timeDifferenceInMillisecondsRow =
                        currentDate - rowCreatedAt;
                      const timeDifferenceInMinutesRow =
                        timeDifferenceInMillisecondsRow / (1000 * 60);

                      return (
                        <div className={styles.inMessage1} key={index}>
                          {row?.commented_by?.user_type == "farmer" ? (
                            <Avatar sx={{ bgcolor: "chocolate" }}>
                              {row?.commented_by?.name
                                ?.slice(0, 2)
                                .toUpperCase()}
                            </Avatar>
                          ) : (
                            <Avatar sx={{ bgcolor: "green" }}>
                              {row?.commented_by?.name?.slice(0, 2)}
                            </Avatar>
                          )}{" "}
                          <div className={styles.messagebox1}>
                            <div className={styles.userName}>
                              <div className={styles.userdetails1}>
                                <h4 className={styles.jack}>
                                  {userDetails?.user_details?.user_type ==
                                    row?.commented_by?.user_type
                                    ? "You"
                                    : row?.commented_by?.user_type !=
                                      userDetails?.user_details?.user_type
                                      ? row?.commented_by?.name
                                      : row?.commented_by?.user_type}
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
                                  <Markup content={row.content} />
                                  {"                     "}
                                  <Typography variant="caption">
                                    {row.createdAt == row.updatedAt
                                      ? ""
                                      : "(edited)"}
                                  </Typography>
                                </p>
                              )}

                              {row?.attachments?.length
                                ? row?.attachments?.map(
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
                                              file,
                                              row.user[0]._id
                                            )
                                          }
                                        />
                                        {userDetails?.user_details
                                          ?.user_type ==
                                          row?.commented_by?.user_type ? (
                                          <IconButton
                                            onClick={() =>
                                              afterDeleteAttachements(
                                                file._id,
                                                row._id
                                              )
                                            }
                                          >
                                            <DeleteForeverIcon />
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

                            {userDetails?.user_details?.user_type ==
                              row?.commented_by?.user_type ? (
                              <div className={styles.actionButton1}>
                                <div className={styles.react}>
                                  <div className={styles.edit}>
                                    {(currentDate - rowCreatedAt) /
                                      (1000 * 60) >
                                      15 ? (
                                      ""
                                    ) : (
                                      <>
                                        <div className={styles.editChild} />

                                        {editMode[0] == true &&
                                          editMode[1] == row._id ? (
                                          <Button
                                            className={styles.edit1}
                                            disabled={
                                              editComment ? false : true
                                            }
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
                                      </>
                                    )}

                                    <div
                                      className={styles.editChild}
                                      style={{
                                        display:
                                          (currentDate - rowCreatedAt) /
                                            (1000 * 60) >
                                            15
                                            ? "none"
                                            : "flex",
                                      }}
                                    />
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
                                      <div
                                        className={styles.edit}
                                        style={{
                                          display:
                                            (currentDate - rowCreatedAt) /
                                              (1000 * 60) >
                                              15
                                              ? "none"
                                              : "flex",
                                        }}
                                      >
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
      ) : loadingThreads ? (
        <div className={styles.inMessageSkelton}>
          <Box sx={{ width: 300 }}>
            <div style={{ display: "flex" }}>
              <Skeleton variant="circular" width={40} height={40} />
              <div style={{ display: "block" }}>
                <Skeleton width={150} height={20} />
                <Skeleton animation="wave" width={250} height={20} />
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Skeleton animation="wave" width={100} height={20} />
              <Skeleton animation="wave" width={100} height={20} />
            </div>
          </Box>
          <Box sx={{ width: 300, marginTop: "30px" }}>
            <div style={{ display: "flex" }}>
              <Skeleton variant="circular" width={40} height={40} />
              <div style={{ display: "block" }}>
                <Skeleton width={150} height={20} />
                <Skeleton animation="wave" width={250} height={20} />
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Skeleton animation="wave" width={100} height={20} />
              <Skeleton animation="wave" width={100} height={20} />
            </div>
          </Box>
        </div>
      ) : (
        <div className={styles.noThreadFound}>
          <div className={styles.noDataBlock}>

            <ChatIcon /> No Comments
          </div>
        </div>
      )}
      <LoadingComponent loading={loadingThreads} />
      <AlertComponent
        alertMessage={alertMessage}
        alertType={alertType}
        setAlertMessage={setAlertMessage}
      />
    </div>
  );
};

export default Threads;
