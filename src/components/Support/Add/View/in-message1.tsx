import type { NextPage } from "next";
import styles from "./in-message1.module.css";
import { SupportResponseDataType } from "@/types/supportTypes";
import { SupportMessageType } from "@/types/SupportConversationTypes";
import { Button } from "@mui/material";
import { useRouter } from "next/router";
import getDownloadLinksByMessageId from "../../../../../lib/services/SupportService/getDownloadLinksByMessageId";
import { useSelector } from "react-redux"
import { useEffect, useState } from "react";

const InMessage = ({ data }: { data: SupportMessageType }) => {

  const router = useRouter();

  const messages = useSelector((state: any) => state.conversation.messages);
  console.log(messages);

  const [messagesFromStore, setMessagesFromStore] = useState([]);

  useEffect(() => {
    if (messages) {
      setMessagesFromStore(messages);
    }
  }, [messages])

  const getImagesByMessageId = async (supportId: string, messageId: string) => {
    let response = await getDownloadLinksByMessageId(supportId, messageId);

  }
  return (
    <div className={styles.inMessage}>
      <img className={styles.avatarIcon} alt="" src="/avatar@2x.png" />
      <div className={styles.messagebox}>
        <div className={styles.userName}>
          <h4 className={styles.ijack}>Ijack</h4>
          <p className={styles.daysAgo}>2 days ago</p>
        </div>
        <div className={styles.paragraph}>
          <p className={styles.theProblemIm}>
            {data.content}
          </p>
          {messages?.length ? data?.attachments.map((item: any, index: number) => {
            return (
              <div className={styles.attachment} key={index}>
                <div className={styles.row}>
                  <div className={styles.icon}>
                    <img className={styles.groupIcon} alt="" src="/group.svg" />
                    <img className={styles.groupIcon1} alt="" src="/group2.svg" />
                  </div>
                  <Button className={styles.imageName} onClick={() => getImagesByMessageId(data.support_id, item._id)}>View Images</Button>
                </div>

              </div>
            )
          }) : ""}
        </div>
        {/* <div className={styles.reply}>
          <div className={styles.reply1}>Reply</div>
        </div> */}
      </div>
    </div>
  );
};

export default InMessage;
