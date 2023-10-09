import styles from "./in-message1.module.css";
import { AttachmentDownloadUrlsResponse, SupportMessageType } from "@/types/SupportConversationTypes";
import { Avatar, Button, CircularProgress, IconButton } from "@mui/material";
import { useRouter } from "next/router";
import getDownloadLinksByMessageId from "../../../../../lib/services/SupportService/getDownloadLinksByMessageId";
import { useEffect, useState } from "react";
import ImageComponent from "@/components/Core/ImageComponent";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import deleteSupportAttachmentService from "../../../../../lib/services/SupportService/deleteSupportAttachmentService";
import timePipe from "@/pipes/timePipe";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const InMessage = ({ data }: { data: SupportMessageType }) => {


  const router = useRouter();

  const [attachmentImages, setAttachmentImages] = useState<Array<AttachmentDownloadUrlsResponse>>([]);
  const [getImagesLoading, setGetImagesLoading] = useState(false);
  const getImagesByMessageId = async () => {
    setGetImagesLoading(true)
    let response = await getDownloadLinksByMessageId(router.query.support_id as string, data._id);

    if (response?.success) {
      setAttachmentImages(response.data?.download_urls);
    }
    setGetImagesLoading(false)
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
        <ImageComponent height={10} width={10} className={styles.avatarIcon} alt=""
          src={"/avatar@2x.png"} />
        : <Avatar sx={{ width: 32, height: 32 }} />}
      <div className={styles.messagebox}>
        <div className={styles.userName}>
          <h4 className={styles.ijack}>
            {data?.reply_to_message_id?.full_name}
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
                  <ImageComponent height={10} width={10} className={styles.groupIcon} alt="" src="/group.svg" />
                  <ImageComponent height={10} width={10} className={styles.groupIcon1} alt="" src="/group2.svg" />
                  </div>
                <Button className={styles.imageName} onClick={() => {
                  if (attachmentImages && attachmentImages?.length) {
                    setAttachmentImages([]);
                  } else {
                    getImagesByMessageId()
                  }
                }}>
                  {attachmentImages && attachmentImages?.length ? "Hide Images" : (getImagesLoading ? <CircularProgress size={'1rem'} /> : "View Images")}
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
                    alt={`${item?.file_name}`}
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
        {/* <div>
          <IconButton onClick={deleteAMessage}>
            <DeleteOutlineIcon />
          </IconButton>
        </div> */}
      </div>
    </div>
  );
};

export default InMessage;
