import FarmCardsLayOut from "../FarmCard/FarmCardLayOut";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import FarmTableLogs from "./FarmTableLogs";
import getAllFarmsService from "../../../lib/services/FarmsService/getAllFarmsService";
import { useSelector } from "react-redux";


const DashBoard = () => {

    const router = useRouter();
    const accessToken = useSelector((state: any) => state.auth.userDetails?.access_token);

    const [farmsData, setFarmsData] = useState<any>();

    const getFarmsData = async () => {
        let response: any = await getAllFarmsService(accessToken);
        if (response?.success) {
            setFarmsData(response);
            let id = (router?.query?.farm_id && router?.query?.farm_id != 'farm_id') ? router?.query?.farm_id : response?.data[0]?._id;
            router.replace(`/farm/${id}/logs`, undefined, { shallow: true });
        }
    }

    useEffect(() => {
        if (router.isReady && accessToken) {
            getFarmsData();
        }
    }, [router.isReady, accessToken]);

    return (
        <div style={{ width: "100%" }}>
            <FarmCardsLayOut farmsData={farmsData}>
                <FarmTableLogs />
            </FarmCardsLayOut>
        </div>
    )
}

export default DashBoard;


