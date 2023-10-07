import type { NextPage } from "next";
import styles from "./threads.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import timePipe from "@/pipes/timePipe";
import { Avatar, Button, TextField } from "@mui/material";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CommentForm from "./comment-form";
import CommentFormReply from "./comment-formReply";
import { removeTheAttachementsFilesFromStore } from "@/Redux/Modules/Conversations";
import { deepOrange, deepPurple } from '@mui/material/colors';

const Threads = ({ details, afterCommentAdd, afterDeleteComment, afterUpdateComment, afterReply }: any) => {

  const accessToken = useSelector((state: any) => state.auth.userDetails?.access_token);
  const userDetails = useSelector((state: any) => state.auth.userDetails);
  console.log(userDetails, "details")

  const router = useRouter()
  const dispatch = useDispatch()
  const [replyOpen, setReplyOpen] = useState<any>(false)
  const [replyIndex, setReplyIndex] = useState<any>()
  const [editMode, setEditMode] = useState<any>([])
  const [comment, setComment] = useState<any>()
  const [editComment, setEditComment] = useState<any>()
  const [loading, setLoading] = useState<any>()
  const [isReplies, setIsReplies] = useState<any>(false)


  useEffect(() => {
    if (afterReply) {
      setReplyOpen(false)
    }
  }, [afterReply])

  const downLoadAttachements = async (file: any) => {
    let body = {

      "attachment":
      {

        "name": file.name,
        "type": file.type,
        "crop_slug": file.crop_slug,
        "source": "scouting"
      }
    }
    let options = {
      method: "POST",
      headers: new Headers({
        'content-type': 'application/json',
        'authorization': accessToken
      }),
      body: JSON.stringify(body)
    }
    try {
      let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/farm/${router.query.farm_id}/attachment/download-url`, options)
      let responseData = await response.json()
      if (responseData.success == true) {
        window.open(responseData.data.download_url)
        fetch(responseData.data.download_url)
          .then((response) => {
            // Get the filename from the response headers
            const contentDisposition = response.headers.get("content-disposition");
            let filename = "downloaded_file"; // Default filename if not found in headers

            if (contentDisposition) {
              const filenameMatch = contentDisposition.match(/filename="(.+)"/);
              if (filenameMatch && filenameMatch.length > 1) {
                filename = filenameMatch[1];
              }
            }

            // Create a URL for the blob
            return response.blob()
              .then((blob) => ({ blob, filename }));
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
      }

    }

    catch (err) {
      console.log(err)
    }

  }



  return (
    <div className={styles.threads}>
      {details?.length ? details.map((item: any, index: any) => {
        if (item.type == "DIRECT") {
          return (
            <div className={styles.inMessage} key={index}>
              <Avatar sx={{ bgcolor: deepOrange[500] }}>{item?.user?.user_type?.slice(0, 2)}</Avatar>
              <div className={styles.messagebox}>
                <div className={styles.userdetails}>
                  <h4 className={styles.jack}>{userDetails?.user_details?.user_type == item?.user?.user_type ? "You" : item.user.user_type + "(" + item?.user?.phone + ")"}</h4>
                  <p className={styles.aug20231030am}>{timePipe(item.updatedAt, "DD-MM-YYYY hh.mm a")}</p>
                </div>
                <div className={styles.paragraph}>
                  {editMode[0] == true && editMode[1] == item._id ?
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
                        onChange={(e) => setEditComment(e.target.value)}
                      />
                    </div> :

                    <p className={styles.theProblemIm}>
                      {item.content}
                    </p>}

                  {item.attachments.length !== 0 ? item.attachments.map((file: any, indexfile: any) => {
                    return (
                      <div className={styles.attachment} key={indexfile}>
                        <div className={styles.row}>
                          <div className={styles.icon}>
                            <img className={styles.groupIcon} alt="" src={file.type.includes("image") ? "/group2.svg" : file.type.includes("application") ? "/pdf-icon.png" : file.type.includes("video") ? "/videoimg.png" : "/doc-icon.webp"
                            } />
                            <img className={styles.groupIcon1} alt="" src="/group3.svg" />
                          </div>
                          <div className={styles.imageName}>{file?.original_name?.slice(0, 9)}...</div>
                        </div>
                        <img
                          className={styles.download11}
                          alt=""
                          src="/download-1-1.svg"
                          style={{ cursor: "pointer" }}
                          onClick={() => downLoadAttachements(file)}
                        />
                      </div>)
                  })

                    : ""}

                </div>

                <div className={styles.actionButton}>
                  <div className={styles.reply}>

                    {replyOpen == false ?
                      <div className={styles.reply1} onClick={() => {
                        setReplyOpen(true)
                        setReplyIndex(index)
                        dispatch(removeTheAttachementsFilesFromStore([]))
                      }}>Reply</div> :

                      index == replyIndex ?
                        <div className={styles.reply1} style={{ color: "red" }} onClick={() => {
                          setReplyOpen(false)
                          setReplyIndex(index)

                        }}>Close</div> :

                        <div className={styles.reply1} onClick={() => {
                          setReplyOpen(true)
                          setReplyIndex(index)
                        }}>Reply</div>}


                    {isReplies == false && item.replies.length !== 0 ?
                      <div className={styles.reply1} onClick={() => {
                        setIsReplies(true)
                        setReplyIndex(index)
                      }}>{item.replies.length}{item.replies.length == 1 ? "Reply" : "replies"}</div> :
                      item.replies.length !== 0 ?
                        <div className={styles.reply1} onClick={() => {
                          setIsReplies(false)
                          setReplyIndex(index)
                        }}>{item.replies.length}{item.replies.length == 1 ? "Reply" : "replies"}</div> : ""}

                  </div>

                  {userDetails?.user_details?.user_type == item?.user?.user_type ?
                    <div className={styles.react}>
                      <div className={styles.edit}>
                        <div className={styles.editChild} />

                        {editMode[0] == true && editMode[1] == item._id ?

                          <p className={styles.edit1} onClick={() => {
                            setEditMode([false, item._id])
                            afterUpdateComment(item._id, editComment)
                          }}>Update</p> :

                          <p className={styles.edit1} onClick={() => {
                            setEditMode([true, item._id])
                            setEditComment(item.content)
                          }}>Edit</p>}

                      </div>
                      <div className={styles.edit}>
                        <div className={styles.editChild} />
                        <p className={styles.edit1} onClick={() => afterDeleteComment(item._id)}>Delete</p>
                      </div>
                    </div> : ""}

                </div>
                {replyOpen == true && index == replyIndex ?
                  <div style={{ width: "100%" }}>

                    <CommentForm replyThreadEvent={item._id} afterCommentAdd={afterCommentAdd} />


                  </div>

                  : ""}
                {isReplies == true && index == replyIndex && item.replies.length ? item.replies.map((row: any) => {
                  return (
                    <div className={styles.inMessage1} key={index}>
                      <Avatar sx={{ bgcolor: deepOrange[500] }}>{row?.user?.user_type?.slice(0, 2)}</Avatar>
                      <div className={styles.messagebox1}>
                        <div className={styles.userName}>
                          <div className={styles.userdetails1}>
                            <h4 className={styles.jack}>{userDetails?.user_details?.user_type == row?.user?.user_type ? "You" : row?.user?.user_type + "(" + row?.user?.phone + ")"}</h4>
                            <p className={styles.aug20231030am}>{timePipe(row.updatedAt, "DD-MM-YYYY hh:mm a")}</p>
                          </div>
                        </div>

                        <div className={styles.paragraph1}>
                          <p className={styles.theProblemIm}>
                            {row.content}
                          </p>
                          {row.attachments.length ? row.attachments.map((file: any, fileIndex: any) => {
                            return (
                              <div className={styles.attachment1} key={fileIndex}>
                                <div className={styles.row}>
                                  <div className={styles.icon}>
                                    <img className={styles.groupIcon} alt="" src="/group2.svg" />
                                    <img className={styles.groupIcon1} alt="" src="/group3.svg" />
                                  </div>
                                  <div className={styles.imageName}>{file?.original_name?.slice(0, 9)}...</div>
                                </div>
                                <img
                                  className={styles.download11}
                                  alt=""
                                  src="/download-1-1.svg"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => downLoadAttachements(file)}
                                />
                              </div>)
                          }) : ""}

                        </div>
                        {userDetails?.user_details?.user_type == row?.user?.user_type ?

                          <div className={styles.actionButton1}>
                            <div className={styles.react}>
                              <div className={styles.edit}>
                                <div className={styles.editChild} />
                                <p className={styles.edit1} onClick={() => afterDeleteComment(row._id)}>Delete</p>
                              </div>
                            </div>
                          </div> : ""}

                      </div>
                    </div>
                  )
                }) : ""}





              </div>
            </div>
          )
        }

      }) :
        <div style={{ margin: "auto" }}>
          No Threads
        </div>
      }




    </div>
  );
};

export default Threads;
