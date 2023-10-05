import type { NextPage } from "next";
import styles from "./threads.module.css";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import timePipe from "@/pipes/timePipe";
import { Button, TextField } from "@mui/material";

const Threads = ({ details, afterCommentAdd, afterDeleteComment }: any) => {

  const router = useRouter()
  const [replyOpen, setReplyOpen] = useState<any>(false)
  const [replyIndex, setReplyIndex] = useState<any>()
  const accessToken = useSelector((state: any) => state.auth.userDetails?.access_token);

  const [comment, setComment] = useState<any>()

  const replyThreads = async (comment_id: any) => {
    let body = {
      "content": comment,
      "type": "DIRECT"
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
      let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/scouts/${router.query.scout_id}/comments/${comment_id}/reply`, options)
      let responseData = await response.json()
      if (responseData.success == true) {
        setComment("")
        afterCommentAdd(true)
        setReplyIndex("")
        setReplyOpen(false)
      }
    } catch (err) {
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
                  <p className={styles.aug20231030am}>{timePipe(item.createdAt, "DD-MM-YYYY hh.mm a")}</p>
                </div>
                <div className={styles.paragraph}>
                  <p className={styles.theProblemIm}>
                    {item.content}
                  </p>
                  {item.attachments.length !== 0 ?

                    <div className={styles.attachment}>
                      <div className={styles.row}>
                        <div className={styles.icon}>
                          <img className={styles.groupIcon} alt="" src="/group2.svg" />
                          <img className={styles.groupIcon1} alt="" src="/group3.svg" />
                        </div>
                        <div className={styles.imageName}>Photo.jpg</div>
                      </div>
                      <img
                        className={styles.download11}
                        alt=""
                        src="/download-1-1.svg"
                      />
                    </div> : ""}

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
                        }}>Close</div> : <div className={styles.reply1} onClick={() => {
                          setReplyOpen(true)
                          setReplyIndex(index)
                        }}>Reply</div>}

                  </div>

                  <div className={styles.react}>
                    <div className={styles.edit}>
                      <div className={styles.editChild} />
                      <p className={styles.edit1}>Edit</p>
                    </div>
                    <div className={styles.edit}>
                      <div className={styles.editChild} />
                      <p className={styles.edit1} onClick={() => afterDeleteComment(item._id)}>Delete</p>
                    </div>
                  </div>

                </div>
                {replyOpen == true && index == replyIndex ?
                  <div style={{ width: "100%" }}>
                    <TextField
                      className={styles.chatBox}
                      color="primary"
                      rows={2}
                      placeholder="Enter your reply message... "
                      fullWidth={true}
                      variant="outlined"
                      multiline
                      value={comment ? comment : ""}
                      onChange={(e) => setComment(e.target.value)}
                    />

                    <Button className={styles.replySendBtn} variant="contained"
                      onClick={() => replyThreads(item._id)}
                      disabled={comment ? false : true}
                    >Send</Button>

                    {item.replies.length && item.replies.map((row: any) => {
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
                                <p className={styles.aug20231030am}>{timePipe(row.createdAt, "DD-MM-YYYY hh:mm a")}</p>
                              </div>
                            </div>
                            <div className={styles.paragraph1}>
                              <p className={styles.theProblemIm}>
                                {row.content}
                              </p>
                              <div className={styles.attachment1}>
                                <div className={styles.row}>
                                  <div className={styles.icon}>
                                    <img className={styles.groupIcon} alt="" src="/group2.svg" />
                                    <img className={styles.groupIcon1} alt="" src="/group3.svg" />
                                  </div>
                                  <div className={styles.imageName}>Photo.jpg</div>
                                </div>
                                <img
                                  className={styles.download11}
                                  alt=""
                                  src="/download-1-1.svg"
                                />
                              </div>
                            </div>
                            <div className={styles.actionButton1}>
                              <div className={styles.reply}>
                                <p className={styles.reply3}>Reply</p>
                              </div>
                              <div className={styles.react}>
                                <div className={styles.edit}>
                                  <div className={styles.editChild} />
                                  <p className={styles.edit1}>Edit</p>
                                </div>
                                <div className={styles.edit}>
                                  <div className={styles.editChild} />
                                  <p className={styles.edit1} onClick={() => afterDeleteComment(row._id)}>Delete</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>)
                    })}



                  </div>

                  : ""}

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
