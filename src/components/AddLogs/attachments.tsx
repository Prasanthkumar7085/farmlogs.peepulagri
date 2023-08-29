import type { NextPage } from "next";
import styles from "./attachments.module.css";
import { useEffect, useState } from "react";
import { Button, IconButton } from "@mui/material";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import getLogAttachmentsService from "../../../lib/services/LogsService/getLogAttachmentsService";
import { useRouter } from "next/router";
const Attachments = ({ onChangeFile, uploadFiles, files }: any) => {

  const router = useRouter();

  const [downloadLinks, setDownloadLinks] = useState<any>([]);

  const deleteFile = (index: number) => {
    let array = [...files];
    let tempArray = array.filter((item: any, itemIndex: number) => itemIndex != index)
    let e = { target: { files: tempArray } }
    onChangeFile(e)

  }

  useEffect(() => {
    if (router.isReady) {
      getAttachmentPreview();
    }
  }, [router]);

  const getAttachmentPreview = async () => {
    let response: any = await getLogAttachmentsService(router.query.log_id);

    console.log(response);
    setDownloadLinks(response?.data?.download_urls)

  }

  console.log(files);

  return (
    <div className={styles.attachments}>
      <div className={styles.header}>
        <h4 className={styles.title}>Attachments</h4>
        <p className={styles.description}>
          You can also drag and drop files to upload them.
        </p>
      </div>
      <input className={styles.link} type="file" multiple onChange={onChangeFile} />
      <div>
        {files &&
          Array.from(files).map((file: any, index) => {
            return (
            <div key={index} style={{ display: "flex", gap: '20px' }}>
                {/* <img src={URL.createObjectURL(file)} alt={`image-${index}`} height={20} width={20} /> */}
              <div>
                {file.name}
              </div>
              <div onClick={() => deleteFile(index)}>X</div>
            </div>
            )
          })}
      </div>
      <div style={{ display: "flex" }}>
        {downloadLinks && downloadLinks.length && downloadLinks.map((link: string, index: number) => {
          return (
            <div className={styles.eachFile} key={index}>
              <img
                alt={`image-${index}`}
                height={70}
                width={120}
                src={link}
                style={{ borderRadius: "5%" }}
              />
              <IconButton onClick={() => window.open(link)}>
                <OpenInNewIcon />
              </IconButton>
            </div>
          )
        })}
      </div>
      <Button disabled={!files?.length} onClick={uploadFiles}>
        Upload
      </Button>



    </div>
  );
};

export default Attachments;
