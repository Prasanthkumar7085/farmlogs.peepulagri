import FarmCardsLayOut from "../FarmCard/FarmCardLayOut";
import { useRouter } from "next/router";
import { Button } from "@mui/material";
import Link from "next/link";
import SearchComponent from "../Core/SearchComponent";
import { useEffect } from "react";
import FarmTableLogs from "./FarmTableLogs";

const DashBoard = () => {

    const router = useRouter();

    const onChange = (value: string) => {

    }

    useEffect(() => {
        if (router.isReady) {

        }
    }, [router.isReady]);
    return (
        <div style={{ width: "100%" }}>
            <FarmCardsLayOut>
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


