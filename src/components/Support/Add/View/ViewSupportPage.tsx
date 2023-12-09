
import { useRouter } from "next/router";
import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import styles from "./ViewSupportPage.module.css";
import LoadingComponent from "@/components/Core/LoadingComponent";
import getSupportByIdService from "../../../../../lib/services/SupportService/getSupportByIdService";
import { SupportResponseDataType } from "@/types/supportTypes";
import HeadSupportPart from "./HeadSupportPart";
import ViewSupportBody from "./ViewSupportBody";
import SupportConversationScreen from "./SupportConversationScreen";

const ViewSupportPage = () => {

    const router = useRouter();

    const [data, setData] = useState<SupportResponseDataType>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (router.isReady) {
            getOneSupportById();
        }
    }, [router])


    const getOneSupportById = async () => {
        setLoading(true);
        try {
            let response = await getSupportByIdService(router.query.support_id as string);
            if (response.success) {
                setData(response.data)
            }


        } catch (err: any) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }
    return (

        <div className={styles.viewSupportContainer}>
            <div className={styles.mainDetailBlock}>
                <HeadSupportPart data={data} />
                <ViewSupportBody data={data} getOneSupportById={getOneSupportById} />
            </div>
            <div className={styles.threads} >
                <Typography variant="h6" className={styles.cardTitle}>Conversation</Typography>
                <SupportConversationScreen data={data} />
            </div>
            <LoadingComponent loading={loading} />
        </div>
    )
}

export default ViewSupportPage;