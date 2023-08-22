import FarmCardsLayOut from "../FarmCard/FarmCardLayOut";
import { useRouter } from "next/router";
import { Button } from "@mui/material";
import Link from "next/link";
import SearchComponent from "../Core/SearchComponent";
import { useEffect, useState } from "react";
import FarmTableLogs from "./FarmTableLogs";
import getAllFarms from "../../../lib/services/getAllFarmsService";

const DashBoard = () => {

    const router = useRouter();

    const [farmsData, setFarmsData] = useState<any>();

    const getFarmsData = async () => {
        let response: any = await getAllFarms();
        if (response.success) {
            router.push(`/farm/${response?.data[0]._id}/logs`);
            console.log(response);
            setFarmsData(response);
        }
    }

    useEffect(() => {
        if (router.isReady) {
            getFarmsData();
        }
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


