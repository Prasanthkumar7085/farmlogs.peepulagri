import styles from "./in-message1.module.css";
import { AttachmentDownloadUrlsResponse, SupportMessageType } from "@/types/SupportConversationTypes";
import { Avatar, Button, IconButton } from "@mui/material";
import { useRouter } from "next/router";
import getDownloadLinksByMessageId from "../../../../../lib/services/SupportService/getDownloadLinksByMessageId";
import { useEffect, useState } from "react";
import ImageComponent from "@/components/Core/ImageComponent";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import deleteSupportAttachmentService from "../../../../../lib/services/SupportService/deleteSupportAttachmentService";
import timePipe from "@/pipes/timePipe";


const InMessage = ({ data }: { data: SupportMessageType }) => {


  const router = useRouter();

  const [attachmentImages, setAttachmentImages] = useState<Array<AttachmentDownloadUrlsResponse>>([]);

  const getImagesByMessageId = async () => {
    let response = await getDownloadLinksByMessageId(router.query.support_id as string, data._id);

    if (response?.success) {
      setAttachmentImages(response.data?.download_urls);
    }
  }

  useEffect(() => {
    setAttachmentImages([]);
  }, [data])

  const deleteImage = async (item: any) => {

    const response = await deleteSupportAttachmentService(router.query.support_id as string, item.attachment_id);

    if (response.success) {
      await getImagesByMessageId();
    }
  }


  const getSrc = (item: any) => {
    if (item.file_name.includes('.wav'))
      return '/audio.svg'
    else if (item.file_name.includes('.pdf'))
      return '/pdf.svg'
    else return item.downloadUrl
  } 
  return (
    <div className={styles.inMessage}>
      {data?.reply_to_message_id?.full_name == 'admin' ?
        <img className={styles.avatarIcon} alt=""
          src={"/avatar@2x.png"} />
        : <Avatar sx={{ width: 32, height: 32 }} />}
      <div className={styles.messagebox}>
        <div className={styles.userName}>
          <h4 className={styles.ijack}>
            Username
          </h4>
          <p className={styles.daysAgo}>
            {timePipe(data?.createdAt, 'DD MMM, YYYY hh:mm A')}
          </p>
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
                <Button className={styles.imageName} onClick={() => {
                  if (attachmentImages && attachmentImages?.length) {
                    setAttachmentImages([]);
                  } else {
                    getImagesByMessageId()
                  }
                }}>
                  {attachmentImages && attachmentImages?.length ? "Hide Images" : "View Images"}


                </Button>
                </div>

              </div>
            : ""}
        </div>
        <div className={styles.attachmentsGroup}>
          {attachmentImages && attachmentImages?.length ?
            attachmentImages.map((item: AttachmentDownloadUrlsResponse, index: number) => {
              return (
                <div key={index} className={styles.eachAttachment}>
                  <ImageComponent
                    src={getSrc(item)}
                    height={70}
                    width={70}
                    className={styles.image}
                  />
                  <IconButton onClick={() => window.open(item.downloadUrl)}>
                    <OpenInNewIcon />
                  </IconButton>
                  {/* <IconButton onClick={() => deleteImage(item)}>
                    <DeleteOutlineIcon />
                  </IconButton> */}
                </div>
              )
            })
            : ""}
        </div>
      </div>
    </div>
  );
};

export default InMessage;
