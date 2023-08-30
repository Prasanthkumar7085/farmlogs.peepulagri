import { TextField, Button, Icon } from "@mui/material";
import styles from "./messagebox.module.css";
import { ChangeEvent, useState } from "react";
import postAMessageInSupportService from "../../../../../lib/services/SupportService/postAMessageInSupportService";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { addNewMessage } from "@/Redux/Modules/Conversations";

type getAllMessagesBySupportIdType = () => void

const Messagebox = ({ getAllMessagesBySupportId }: { getAllMessagesBySupportId: getAllMessagesBySupportIdType }) => {

  const accessToken = useSelector((state: any) => state.auth.userDetails.userDetails?.access_token);

  const router = useRouter();
  const dispatch = useDispatch();

  const [message, setMessage] = useState<string>('');

  const onSendMessage = async () => {

    if (message) {
      const body = {
        content: message,
        type: 'REPLY',
        attachments: []
      }
      dispatch(addNewMessage(body))
      const response = await postAMessageInSupportService(router.query.support_id as string, body, accessToken);

      if (response.success) {
        getAllMessagesBySupportId()
      }

    }

  }



  return (
    <div className={styles.inputForm}>
      <TextField
        className={styles.chatBox}
        fullWidth
        color="primary"
        variant="outlined"
        placeholder="Enter your message here..."
        type="text"
        size="medium"
        margin="none"
        value={message}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)}
        onKeyDown={(e: any) => { if (e.key == 'Enter') onSendMessage() }}
      />
      <div className={styles.actions}>
        <div className={styles.attachments}>
          <Button variant="outlined" color="primary" size="large" />
          <input className={styles.image} type="file" />
        </div>
        <div className={styles.button}>
          <Button
            className={styles.delete}
            sx={{ width: 20 }}
            variant="outlined"
            color="primary"
          />
          <Button variant="contained" color="primary" onClick={onSendMessage}>
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Messagebox;
