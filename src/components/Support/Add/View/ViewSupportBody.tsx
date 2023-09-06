import { Chip, IconButton, Typography } from "@mui/material";
import styles from "./ViewSupportBody.module.css";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { SupportResponseDataType } from "@/types/supportTypes";
import getSupportAttachmentsService from "../../../../../lib/services/SupportService/getSupportAttachmentService";
import Image from "next/image";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import deleteSupportAttachmentService from "../../../../../lib/services/SupportService/deleteSupportAttachmentService";
import timePipe from "@/pipes/timePipe";
import { useSelector } from "react-redux";
import SelectComponent from "@/components/Core/SelectComponent";
import supportStatusChangeService from "../../../../../lib/services/SupportService/supportStatusChangeService";
import AlertComponent from "@/components/Core/AlertComponent";

type getOneSupportByIdType = () => void
const ViewSupportBody = ({ data, getOneSupportById }: { data: SupportResponseDataType | undefined; getOneSupportById: getOneSupportByIdType }) => {

    const router = useRouter();

    const userType = useSelector((state: any) => state.auth.userDetails?.user_details?.user_type);
    const accessToken = useSelector((state: any) => state.auth.userDetails?.access_token);

    const [supportStatus, setSupportStatus] = useState<string>('');
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState(false);

    useEffect(() => {
        setSupportStatus(data?.status as string)
    }, [data?.status])

    const statusOptions = [
        { value: 'OPEN', title: 'Open' },
        { value: 'INPROGRESS', title: "Inprogress" },
        { value: 'RESOLVED', title: "Resolved" },

    ];


    const onChangeStatus = async (e: any) => {

        setSupportStatus(e.target.value);
        const body = {
            status: e.target.value
        }
        const response = await supportStatusChangeService(router.query?.support_id as string, body, accessToken);
        if (response.success) {
            // getOneSupportById()
            setAlertMessage(response?.message);
            setAlertType(response?.success)
        } else {
            setAlertMessage('Failed to Update Status');
            setAlertType(response?.success)
        }

    }

    useEffect(() => {
        if (data && router.isReady) {
            getDownloadLinks();
        }
    }, [data, router.isReady])

    const [downloadUrls, setDownloadUrls] = useState<any>([]);

    const getDownloadLinks = async () => {
        let response = await getSupportAttachmentsService(router.query?.support_id);
        if (response.success) {
            setDownloadUrls(response.data.download_urls);
        }
    }

    const deleteImage = async (item: any) => {
        const response = await deleteSupportAttachmentService(router.query.support_id as string, item.attachment_id);
        if (response.success) {
            await getOneSupportById();
        }
    }

    const getSrc = (item: any) => {
        if (item) {
            if (item.file_name?.includes('.wav'))
            return '/audio.svg'
            else if (item.file_name?.includes('.pdf'))
            return '/pdf.svg'
        else return item.downloadUrl
        }
    }
    return (

        <div className={styles.supportBody}>
            <div>
                <div className={styles.eachModule}>
                    <div className={styles.eachCell}>
                        <Typography className={styles.label}>
                            Support ID
                        </Typography>
                        <Typography className={styles.value}>
                            {data?.support_id}
                        </Typography>
                    </div>
                    <div className={styles.eachCell}>
                        <Typography className={styles.label}>
                            Status
                        </Typography>
                        <Typography className={styles.value}>
                            {userType == 'ADMIN' ?
                                <SelectComponent
                                    value={supportStatus}
                                    defaultValue={supportStatus}
                                    options={statusOptions}
                                    onChange={onChangeStatus}
                                    disabled={supportStatus == 'ARCHIVE' ? true : false}
                                />
                                : data?.status}
                        </Typography>
                    </div>
                </div>
                <div className={styles.dateRangeRow}>
                    <div className={styles.eachCell}>

                        <Typography className={styles.label}>
                            Date
                        </Typography>
                        <Chip className={styles.date} label={timePipe(data?.createdAt as string, 'DD, MMM YYYY')} />
                    </div>
                    <div className={styles.eachCell}>
                        <Typography className={styles.label}>
                            Response Date
                        </Typography>
                        <Chip className={styles.date} label={timePipe(data?.recent_response_at as string, 'DD, MMM YYYY')} />
                    </div>
                </div>
                <div className={styles.attachmentsList}>
                    <div className={styles.subTitle}>Attachments</div>
                    <div className={styles.container}>
                        {downloadUrls.map((item: any, index: number) => {
                            return (
                                <div className={styles.eachFile} key={index}>
                                    <Image
                                        alt={`image-${index}`}
                                        height={100}
                                        width={150}
                                        src={getSrc(item)}
                                    />
                                    <div className={styles.actionButton}>
                                        <IconButton className={styles.iconButton} onClick={() => window.open(item.downloadUrl)}>
                                            <OpenInNewIcon />
                                        </IconButton>
                                        {userType == 'ADMIN' ? "" : <IconButton className={styles.iconButton} onClick={() => deleteImage(item)}>
                                            <DeleteOutlineIcon />
                                        </IconButton>}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            <AlertComponent alertMessage={alertMessage} alertType={alertType} setAlertMessage={setAlertMessage} />
        </div>
    )
}

export default ViewSupportBody;