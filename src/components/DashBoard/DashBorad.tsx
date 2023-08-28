import FarmCardsLayOut from "../FarmCard/FarmCardLayOut";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import FarmTableLogs from "./FarmTableLogs";
import getAllFarmsService from "../../../lib/services/getAllFarmsService";

const DashBoard = () => {

    const router = useRouter();

    const [farmsData, setFarmsData] = useState<any>();

    const getFarmsData = async () => {
        let response: any = await getAllFarmsService();
        if (response?.success) {
            router.push(`/farm/${response?.data[0]._id}/logs`);
            setFarmsData(response);
        }
    }

    useEffect(() => {
        getFarmsData();
    }, [router.isReady]);

    return (
        <div style={{ width: "100%" }}>
            <FarmCardsLayOut farmsData={farmsData}>
                <FarmTableLogs />
            </FarmCardsLayOut>
        </div>
    )
}

export default DashBoard;


