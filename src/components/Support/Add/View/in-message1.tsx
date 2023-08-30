import type { NextPage } from "next";
import styles from "./in-message1.module.css";
import { SupportResponseDataType } from "@/types/supportTypes";
import { SupportMessageType } from "@/types/SupportConversationTypes";
import { Button } from "@mui/material";
import { useRouter } from "next/router";
import getDownloadLinksByMessageId from "../../../../../lib/services/SupportService/getDownloadLinksByMessageId";
import { useSelector } from "react-redux"

const InMessage = ({ data }: { data: SupportMessageType }) => {

  const router = useRouter();

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
          {data?.attachments?.length ?
            <div className={styles.attachment}>
                <div className={styles.row}>
                  <div className={styles.icon}>
                    <img className={styles.groupIcon} alt="" src="/group.svg" />
                    <img className={styles.groupIcon1} alt="" src="/group2.svg" />
                  </div>
                <Button className={styles.imageName} onClick={() => getImagesByMessageId(router.query.support_id as string, data._id)}>View Images</Button>
                </div>

              </div>
            : ""}
        </div>
        {/* <div className={styles.reply}>
          <div className={styles.reply1}>Reply</div>
        </div> */}
      </div>
    </div>
  );
};

export default InMessage;
