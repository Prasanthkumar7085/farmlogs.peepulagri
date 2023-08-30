import type { NextPage } from "next";
import styles from "./attachments.module.css";
import { useEffect, useState } from "react";
import { Button, CircularProgress, IconButton, Typography } from "@mui/material";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useRouter } from "next/router";
import getSupportAttachmentsService from "../../../lib/services/SupportService/getSupportAttachmentService";
import CloseIcon from '@mui/icons-material/Close';
const SupportAttachments = ({ onChangeFile, uploadFiles, files, loadingOnImagesUpload }: any) => {

    const router = useRouter();

    const [downloadLinks, setDownloadLinks] = useState<any>([]);

    const deleteFile = (index: number) => {
        let array = [...files];
        let tempArray = array.filter((item: any, itemIndex: number) => itemIndex != index)
        let e = { target: { files: tempArray } }
        onChangeFile(e)

    }

    useEffect(() => {
        if (router.isReady && router.query.support_id) {
            getAttachmentPreview();
        }
    }, [router]);

    const getAttachmentPreview = async () => {
        let response: any = await getSupportAttachmentsService(router.query.support_id);
        setDownloadLinks(response?.data?.download_urls)

    }

    const getImage = (item: any) => {
        if (item.file_type == 'application/pdf') {
            return '/pdf.svg'
        } else if (item.file_type == 'audio/wav') {
            return '/audio.svg'
        } else return item.downloadUrl
    }

    const getImageObjectUrl = (file: any) => {
        console.log(file.type, 'plpl');
        if (file.type == 'application/pdf')
            return '/pdf.svg'
        else if (file.type.includes('audio'))
            return '/audio.svg'
        else return URL.createObjectURL(file)
    }
    return (
        <div className={styles.attachments}>
            <div className={styles.header}>
                <h4 className={styles.title}>Attachments (or) Images</h4>
                <p className={styles.description}>
                    You can also drag and drop files to upload them.
                </p>
            </div>
            <input className={styles.link} type="file" multiple onChange={onChangeFile} />
            <div>
                {files &&
                    Array.from(files).map((file: any, index) => {


                        return (
                            <div key={index} className={styles.attachmentItem}>
                                {file ? <img src={getImageObjectUrl(file)} alt={`image-${index}`} height={50} width={50} style={{ objectFit: "cover" }} /> : ""}
                                <Typography> 
                                    {file.name}
                                </Typography>
                                <IconButton color="error" aria-label="delete" onClick={() => deleteFile(index)}>
                                    <CloseIcon  />
                                </IconButton>
                            </div>
                        )
                    })}
            </div>
            <Button disabled={!files?.length} color="success" variant="contained" onClick={uploadFiles} size="small"   sx={{ width: "100px" }}>
                {loadingOnImagesUpload ?
                    <CircularProgress sx={{ color: " white" }} size="1.5rem" />
                    : 'Upload'}
            </Button>
            <div style={{ display: "flex" }}>
                {downloadLinks && downloadLinks.length ? downloadLinks.map((item: any, index: number) => {
                    return (
                        <div className={styles.eachFile} key={index}>
                            <img
                                alt={`image-${index}`}
                                height={70}
                                width={120}
                                src={getImage(item)}
                                style={{ borderRadius: "5%" }}
                            />
                            <IconButton onClick={() => window.open(item.downloadUrl)}>
                                <OpenInNewIcon />
                            </IconButton>
                        </div>
                    )
                }) : ""}
            </div>



        </div>
    );
};

export default SupportAttachments;
