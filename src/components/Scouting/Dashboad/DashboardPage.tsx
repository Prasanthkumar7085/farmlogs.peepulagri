import { useRouter } from "next/router";
import DashBoardHeader from "./dash-board-header";
import FarmCard from "./farm-card";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import getAllFarmsService from "../../../../lib/services/FarmsService/getAllFarmsService";
import { FarmDataType, PaginationInFarmResponse } from "@/types/farmCardTypes";
import LoadingComponent from "@/components/Core/LoadingComponent";


const DashboardPage = () => {

    const router = useRouter();

    const accessToken = useSelector((state: any) => state.auth.userDetails?.access_token);
    
    const [farmsData, setFarmsData] = useState<Array<FarmDataType>>([]);
    const [paginationDetails, setPaginationDetails] = useState<PaginationInFarmResponse>();
    const [loading, setLoading] = useState(true);
    const [searchString, setSearchString] = useState('');

    const getAllFarms = async (search_string='') => {

       

        setLoading(true);
        const response = await getAllFarmsService(accessToken);
        
        if (response?.success) {
            const { data, ...rest } = response;
            setFarmsData(data);
            setPaginationDetails(rest)
        }
        setLoading(false);

    };

    const captureSearchString = (search:string) => {
        setSearchString(search);
        getAllFarms(search);
    }

    useEffect(() => {
        if (router.isReady && accessToken) {
            getAllFarms();
        }
    }, [router.isReady, accessToken]);
    return (
        <div id="dashboardPage">
            <DashBoardHeader captureSearchString={captureSearchString} searchString={searchString} />
            <FarmCard farmsData={farmsData} paginationDetails={paginationDetails} />
            <div className="addFormPositionIcon" style={{position:'fixed'}}>
                <img src="/add-form-icon.svg" alt="" onClick={() => router.push("/scouting/forms/add")} />
            </div>
            <LoadingComponent loading={loading}/>
        </div>
    );
}

export default DashboardPage;