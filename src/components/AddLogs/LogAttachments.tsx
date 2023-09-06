
import styles from "./log-attachments.module.css";
import { useEffect, useState } from "react";
import { Button, CircularProgress, IconButton,Typography } from "@mui/material";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import getLogAttachmentsService from "../../../lib/services/LogsService/getLogAttachmentsService";
import { useRouter } from "next/router";
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import Image from "next/image";
import deleteLogAttachmentService from "../../../lib/services/LogsService/deleteLogAttachmentService";
import CloseIcon from '@mui/icons-material/Close';


const LogAttachments = ({ onChangeFile, uploadFiles, files, uploadButtonLoading, uploadFailed, deleteSelectedFile }: any) => {

  const router = useRouter();

  const [downloadLinks, setDownloadLinks] = useState<any>([]);

  useEffect(() => {
    if (router.isReady && router.query.log_id) {
      getAttachmentPreview();
    }
  }, [router]);

  const getAttachmentPreview = async () => {
    let response: any = await getLogAttachmentsService(router.query.log_id);
    setDownloadLinks(response?.data?.download_urls)

  }


  const deleteImage = async (id: string) => {

    if (typeof (router.query.log_id) == 'string') {
      let response = await deleteLogAttachmentService(router.query.log_id, id);
      if (response.success) {

      }
    }
  }

  //setting audio/pdf thumbnail and returning image for other files from selected files
  const getImageObjectUrl = (file: any) => {

    if (file?.type == 'application/pdf')
      return '/pdf.svg'
    else if (file?.type?.includes('audio'))
      return '/audio.svg'
    else return URL.createObjectURL(file)
  }


  return (
    <div className={styles.attachments}>
      <div className={styles.header}>
        <h4 className={styles.title}>Attachments</h4>
        <p className={styles.description}>
          You can also drag and drop files to upload them.
        </p>
      </div>

      <div className={styles.UpdateFiles} >
        <div className={styles.link}>
          Select Files
        </div>
        <input id="upload-files" className={styles.uploadFiles} name="file" type="file" multiple onChange={onChangeFile} 
         accept="image/jpg,image/jpeg,image/webp,image/png,image/gif , .pdf"  />
      </div>
      <div>
        {files &&
          Array.from(files).map((file: any, index) => {
            return (
              <div key={index} className={styles.attachmentItem} style={{backgroundColor: "#F5F7FA"}}>
                {file ? <img src={getImageObjectUrl(file)} alt={`image-${index}`} height={50} width={50} style={{ objectFit: "cover" }} /> : ""}
              <Typography>
                  {file.name}
              </Typography>
                <IconButton color="error" aria-label="delete" onClick={() => deleteSelectedFile(index)}>
                  <CloseIcon />
              </IconButton>
              </div>
            )
          })}
      </div>
      {files?.length ?

        uploadButtonLoading ? (<Button color="success" variant="contained" onClick={uploadFiles} size="small" sx={{ width: "140px" }} >
          Uploading...
          {uploadButtonLoading ?
            <CircularProgress size="1.5rem" sx={{ color: "white" }} />
            : <CloudUploadOutlinedIcon />}
        </Button>) : ""

        : ""}
      {uploadFailed ?
        <p style={{ color: "red", fontSize: "12px" }}>
          Oops! Upload Failed, Please try again
        </p>
        : ""}
      <div style={{ display: "flex", maxWidth: "700px", flexWrap: 'wrap' }}>
        {downloadLinks && downloadLinks.length ? downloadLinks.map((item: any, index: number) => {
          return (
            <div key={index} style={{ maxWidth: "174.5px", display: "flex", flexDirection: "row", padding: "20px" }}>
              <Image
                alt={`image-${index}`}
                height={50}
                width={100}
                src={item.file_name.includes('.pdf') ? '/pdf.svg' : '/image.svg'}
                style={{ borderRadius: "5%" }}
              />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <IconButton onClick={() => window.open(item.downloadUrl)}>
                  <OpenInNewIcon />
                </IconButton>

              </div>
            </div>
          )
        }) : ""}
      </div>



    </div>
  );
};

export default LogAttachments;
