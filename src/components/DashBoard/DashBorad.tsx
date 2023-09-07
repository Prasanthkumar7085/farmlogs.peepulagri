import { useRouter } from "next/router";
import FarmCardsLayOut from "../FarmCard/FarmCardLayOut";
import FarmTableLogs from "./FarmTableLogs";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import getAllFarmsService from "../../../lib/services/FarmsService/getAllFarmsService";
import { useDispatch } from "react-redux";
import { setAllFarms } from "@/Redux/Modules/Farms";

const DashBoard = () => {

    const router = useRouter();
    const dispatch = useDispatch();
    const accessToken = useSelector((state: any) => state.auth.userDetails?.access_token);

    const [farmsData, setFarmsData] = useState<any>();

    const getFarmsData = async () => {
        let response: any = await getAllFarmsService(accessToken);
        if (response?.success) {
            dispatch(setAllFarms(response?.data))
            setFarmsData(response);
            let { query } = router;
            let { farm_id, ...restQueries } = query
            let id = (router?.query?.farm_id && router?.query?.farm_id != 'farm_id') ? router?.query?.farm_id : response?.data[0]?._id;
            router.push({ pathname: `/farm/${id}/logs`, query: restQueries });
        }
    }

    useEffect(() => {
        if (accessToken) {
            getFarmsData();
        }
    }, [accessToken]);


    return (
        <div style={{ width: "100%" }}>
            <FarmCardsLayOut farmsData={farmsData}>
                <FarmTableLogs getFarmsData={getFarmsData} />
            </FarmCardsLayOut>
        </div>
    )
}

export default DashBoard;


