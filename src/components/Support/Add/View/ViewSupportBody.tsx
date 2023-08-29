import { IconButton } from "@mui/material";
import styles from "./../../../AddLogs/head-part.module.css";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { SupportResponseDataType } from "@/types/supportTypes";
import getSupportAttachmentsService from "../../../../../lib/services/SupportService/getSupportAttachmentService";

const ViewSupportBody = ({ data }: { data: SupportResponseDataType | undefined }) => {

    const router = useRouter();

    useEffect(() => {
        if (data && router.isReady) {
            getDownloadLinks();
        }
    }, [data, router.isReady])

    const [downloadUrls, setDownloadUrls] = useState<any>([]);

    const getDownloadLinks = async () => {
        let response = await getSupportAttachmentsService(router.query.support_id);
        if (response.success) {
            setDownloadUrls(response.data.download_urls);
        }
    }

    return (
        <div className={styles.dataGroup3}>
            <div className={styles.subTitle2}>
                <div className={styles.textWrapper}>
                    <div className={styles.text8}>Attachments</div>
                </div>
            </div>
            <div className={styles.attachments} style={{ display: "flex", flexDirection: "row" }}>
                {downloadUrls.map((link: string, index: number) => {
                    return (
                        <div className={styles.eachFile} key={index}>
                            <img
                                alt={`image-${index}`}
                                height={100}
                                width={150}
                                src={link}
                            />
                            <IconButton onClick={() => window.open(link)}>
                                <OpenInNewIcon />
                            </IconButton>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default ViewSupportBody;