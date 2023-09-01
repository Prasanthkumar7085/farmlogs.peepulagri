import { IconButton } from "@mui/material";
import styles from "./../../../AddLogs/head-part.module.css";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { SupportResponseDataType } from "@/types/supportTypes";
import getSupportAttachmentsService from "../../../../../lib/services/SupportService/getSupportAttachmentService";
import Image from "next/image";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import deleteSupportAttachmentService from "../../../../../lib/services/SupportService/deleteSupportAttachmentService";
import timePipe from "@/pipes/timePipe";

type getOneSupportByIdType = () => void
const ViewSupportBody = ({ data, getOneSupportById }: { data: SupportResponseDataType | undefined; getOneSupportById: getOneSupportByIdType }) => {

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

    const deleteImage = async (item: any) => {

        const response = await deleteSupportAttachmentService(router.query.support_id as string, item.attachment_id);
        console.log(response);
        if (response.success) {
            await getOneSupportById();
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

        <div className={styles.dataGroup3}>
            <div>
                <div style={{}}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "2%" }}>
                        <div>
                            Support ID
                        </div>
                        <div>
                            Status
                        </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "2%" }}>
                        <div>
                            {data?.support_id}
                        </div>
                        <div>
                            {data?.status}
                        </div>
                    </div>
                </div>
                <div style={{}}>
                    <div style={{ display: "flex", justifyContent: "start", gap: "5%", padding: "2%" }}>
                        <div>
                            Date
                            {timePipe(data?.createdAt as string, 'DD, MMM YYYY')}
                        </div>
                        <div>
                            Response Date
                            ---
                        </div>
                    </div>

                </div >

            </div >
            <div className={styles.subTitle2}>
                <div className={styles.textWrapper}>
                    <div className={styles.text8}>Attachments</div>
                </div>
            </div>

            <div className={styles.attachments} style={{ display: "flex", flexDirection: "row" }}>
                {downloadUrls.map((item: any, index: number) => {
                    return (
                        <div className={styles.eachFile} key={index}>
                            <Image
                                alt={`image-${index}`}
                                height={100}
                                width={150}
                                src={getSrc(item)}

                            />
                            <IconButton onClick={() => window.open(item.downloadUrl)}>
                                <OpenInNewIcon />
                            </IconButton>
                            <IconButton onClick={() => deleteImage(item)}>
                                <DeleteOutlineIcon />
                            </IconButton>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default ViewSupportBody;