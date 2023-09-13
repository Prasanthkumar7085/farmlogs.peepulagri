
import styles from "./../../components/AddLogs/attachments.module.css";
import { useEffect, useState } from "react";
import { Button, CircularProgress, IconButton, Typography } from "@mui/material";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useRouter } from "next/router";
import getSupportAttachmentsService from "../../../lib/services/SupportService/getSupportAttachmentService";
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import AttachmentIcon from '@mui/icons-material/Attachment';
import Image from "next/image";


const SupportAttachments = ({ loadAttachments, deleteSelectedFile, onChangeFile, files, loadingOnImagesUpload }: any) => {

    const router = useRouter();

    const [downloadLinks, setDownloadLinks] = useState<any>([]);

    useEffect(() => {
        if (router.isReady && router.query.support_id) {
            getAttachmentPreview();
        }
    }, [router]);

    const getAttachmentPreview = async () => {
        let response: any = await getSupportAttachmentsService(router.query.support_id);
        setDownloadLinks(response?.data?.download_urls)

    }


    //setting audio/pdf thumbnail and returning image for other files from download url
    const getImage = (item: any) => {
        if (item.file_type == 'application/pdf') {
            return '/pdf.svg'
        } else if (item.file_type == 'audio/wav') {
            return '/audio.svg'
        } else return item.downloadUrl
    }

    //setting audio/pdf thumbnail and returning image for other files from selected files
    const getImageObjectUrl = (file: any) => {
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

            <label className={styles.UpdateFiles} >
                <div className={styles.link}>
                    <AttachmentIcon className={styles.icon} /> 
                    <span>Select Files</span>
                </div>
                {loadAttachments ? <input className={styles.link} type="file" multiple onChange={onChangeFile}
                    style={{ display: "none" }}
                    accept="image/jpeg, image/png,image/jpg,image/gif,image/webp, .pdf, .mp3, .wav,.docx,.doc" /> : ""}
            </label>

            <div>
                {files &&
                    Array.from(files).map((file: any, index) => {
                        return (
                            <div key={index} className={styles.attachmentItem}>
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
            {loadingOnImagesUpload ? <Button disabled={!files?.length} color="success" variant="contained" size="small" sx={{ width: "100px" }}>
                Uplaod<CircularProgress sx={{ color: " white" }} size="1.5rem" />
            </Button> : ""}
            <div style={{ display: "flex" }}>
                {downloadLinks && downloadLinks.length ? downloadLinks.map((item: any, index: number) => {
                    return (
                        <div className={styles.eachFile} key={index}>
                            <Image
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
