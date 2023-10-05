import type { NextPage } from "next";
import styles from "./threads.module.css";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import timePipe from "@/pipes/timePipe";
import { Button, TextField } from "@mui/material";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CommentForm from "./comment-form";
import CommentFormReply from "./comment-formReply";
const Threads = ({ details, afterCommentAdd, afterDeleteComment, afterUpdateComment, afterReply }: any) => {

  const accessToken = useSelector((state: any) => state.auth.userDetails?.access_token);
  const router = useRouter()
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

        "original_name": file.name,
        "type": file.type,
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
              <img className={styles.avatarIcon} alt="" src="/avatar@2x.png" />
              <div className={styles.messagebox}>
                <div className={styles.userdetails}>
                  <h4 className={styles.jack}>Jack</h4>
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
                            <img className={styles.groupIcon} alt="" src={file.type.includes("image") ? "/group2.svg" : ""} />
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
                      }}>Reply</div> :

                      index == replyIndex ?
                        <div className={styles.reply1} onClick={() => {
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
                  </div>

                </div>
                {replyOpen == true && index == replyIndex ?
                  <div style={{ width: "100%" }}>

                    <CommentForm replyThreadEvent={item._id} afterCommentAdd={afterCommentAdd} />


                  </div>

                  : ""}
                {isReplies == true && index == replyIndex && item.replies.length ? item.replies.map((row: any) => {
                  return (
                    <div className={styles.inMessage1} key={index}>
                      <img className={styles.avatarIcon} alt="" src="/avatar@2x.png" />
                      <div className={styles.messagebox1}>
                        <div className={styles.userName}>
                          <div className={styles.repliedcontainer}>
                            <img
                              className={styles.repliedcontainerChild}
                              alt=""
                              src="/frame-40556.svg"
                            />
                            <h4 className={styles.repliedToJack}>Replied to jack</h4>
                          </div>
                          <div className={styles.userdetails1}>
                            <h4 className={styles.jack}>Jack</h4>
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
                                />
                              </div>)
                          }) : ""}

                        </div>
                        <div className={styles.actionButton1}>
                          <div className={styles.reply}>
                          </div>
                          <div className={styles.react}>
                            <div className={styles.edit}>
                              <div className={styles.editChild} />
                            </div>
                            <div className={styles.edit}>
                              <div className={styles.editChild} />
                              <p className={styles.edit1} onClick={() => afterDeleteComment(row._id)}>Delete</p>
                            </div>
                          </div>
                        </div>
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
