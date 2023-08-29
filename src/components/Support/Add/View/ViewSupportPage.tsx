
import LoadingComponent from "@/components/Core/LoadingComponent";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import getSupportByIdService from "../../../../../lib/services/SupportService/getSupportByIdService";
import { SupportResponseDataType } from "@/types/supportTypes";
import HeadSupportPart from "./HeadSupportPart";
import ViewSupportBody from "./ViewSupportBody";

const ViewSupportPage = () => {

    const router = useRouter();

    const [data, setData] = useState<SupportResponseDataType>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (router.isReady) {

            getOneSupportById(router.query.support_id);
        }
    }, [router])


    const getOneSupportById = async (id: any) => {
        setLoading(true);
        try {
            let response = await getSupportByIdService(id);
            console.log(response);
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
        <div>
            <HeadSupportPart data={data} />

            <ViewSupportBody data={data} />

            <LoadingComponent loading={loading} />
        </div>
    )
}

export default ViewSupportPage;