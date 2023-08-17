import FarmCardsLayOut from "../FarmCard/FarmCardLayOut";
import { useRouter } from "next/router";
import { Button } from "@mui/material";
import Link from "next/link";
import SearchComponent from "../Core/SearchComponent";

const DashBoard = () => {

    const router = useRouter();

    const onChange = (value: string) => {

    }
    return (
        <div style={{ width: "100%" }}>
            <FarmCardsLayOut>
                <div style={{ border: "1px solid", display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "40px", paddingRight: "20px" }}>
                    <SearchComponent onChange={onChange} placeholder={'Search Logs'} />
                    <Link href="/farm/[farm_id]/logs/add" as={`/farm/${router.query.farm_id}/logs/add`} style={{ textDecoration: "none", color: "#000000" }}>
                        <Button>
                            Add Log
                        </Button>
                    </Link>
                </div>
                {router.query.farm_id == '1' ? <div>Tan Stack Table 1</div> : ""}
                {router.query.farm_id == '2' ? <div>Tan Stack Table 2</div> : ""}
                {router.query.farm_id == '3' ? <div>Tan Stack Table 3</div> : ""}
                {router.query.farm_id == '4' ? <div>Tan Stack Table 4</div> : ""}
            </FarmCardsLayOut>
        </div>
    )
}

export default DashBoard;


