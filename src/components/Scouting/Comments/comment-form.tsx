import type { NextPage } from "next";
import { useCallback, useState } from "react";
import { TextField, Button, Icon } from "@mui/material";
import styles from "./comment-form.module.css";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

const CommentForm = ({ afterCommentAdd }: any) => {

  const router = useRouter()
  const accessToken = useSelector((state: any) => state.auth.userDetails?.access_token);

  const [comment, setComment] = useState<any>()

  const addComment = async () => {

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
      let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/scouts/${router.query.scout_id}/comments`, options)
      let responseData = await response.json()
      if (responseData.success == true) {
        setComment("")
        afterCommentAdd(true)
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className={styles.commentform}>
      <TextField
        className={styles.chatBox}
        color="primary"
        rows={2}
        placeholder="Enter your Message... "
        fullWidth={true}
        variant="outlined"
        multiline
        value={comment ? comment : ""}
        onChange={(e) => setComment(e.target.value)}
      />
      <div className={styles.actions}>
        <div className={styles.attachments}>
          <div className={styles.link}>
            <img className={styles.groupIcon} alt="" src="/group.svg" />
          </div>
          <img className={styles.imageIcon} alt="" src="/image7@2x.png" />
        </div>
        <Button
          className={styles.sendbutton}
          color="primary"
          size="medium"
          variant="contained"
          disabled={comment ? false : true}
          onClick={addComment}
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default CommentForm;
