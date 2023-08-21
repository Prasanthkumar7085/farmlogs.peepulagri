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

    const onChange = (value: string) => {

    }

    const getFarmsData = async () => {
        let response: any = await getAllFarms();

        setFarmsData(response);
        console.log(response);

    }

    useEffect(() => {
        if (router.isReady) {
            getFarmsData();
        }
    }, [router]);

    return (
        <div style={{ width: "100%" }}>
            <FarmCardsLayOut farmsData={farmsData}>
                <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "40px", paddingRight: "20px" }}>
                    <SearchComponent onChange={onChange} placeholder={'Search Logs'} />
                    <Link href="/farm/[farm_id]/logs/add" as={`/farm/${router.query.farm_id}/logs/add`} style={{ textDecoration: "none", color: "#000000" }}>
                        <Button>
                            Add Log
                        </Button>
                    </Link>
                </div>

                <FarmTableLogs />
            </FarmCardsLayOut>
        </div>
    )
}

export default DashBoard;


