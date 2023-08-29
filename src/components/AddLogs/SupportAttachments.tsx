import type { NextPage } from "next";
import styles from "./attachments.module.css";
import { useEffect, useState } from "react";
import { Button, CircularProgress, IconButton } from "@mui/material";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useRouter } from "next/router";
import getSupportAttachmentsService from "../../../lib/services/SupportService/getSupportAttachmentService";
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
                                {file ? <img src={URL.createObjectURL(file)} alt={`image-${index}`} height={60} width={90} /> : ""}
                                <div>
                                    {file.name}
                                </div>
                                <div onClick={() => deleteFile(index)}>X</div>
                            </div>
                        )
                    })}
            </div>
            <Button disabled={!files?.length} variant="contained" onClick={uploadFiles} sx={{ minWidth: '100px', maxWidth: "100px" }}>
                {loadingOnImagesUpload ?
                    <CircularProgress sx={{ color: " white" }} size="1.5rem" />
                    : 'Upload'}
            </Button>
            <div style={{ display: "flex" }}>
                {downloadLinks && downloadLinks.length ? downloadLinks.map((link: string, index: number) => {
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
                }) : ""}
            </div>



        </div>
    );
};

export default SupportAttachments;
