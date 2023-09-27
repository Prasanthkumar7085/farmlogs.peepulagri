import { useRouter } from "next/router";
import DashBoardHeader from "./dash-board-header";
import FarmCard from "./farm-card";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FarmDataType, PaginationInFarmResponse } from "@/types/farmCardTypes";
import LoadingComponent from "@/components/Core/LoadingComponent";
import getAllFarmsService from "../../../../lib/services/FarmsService/getAllFarmsServiceMobile";
import { prepareURLEncodedParams } from "../../../../lib/requestUtils/urlEncoder";


const DashboardPage = () => {

    const router = useRouter();

    const accessToken = useSelector((state: any) => state.auth.userDetails?.access_token);
    
    const [farmsData, setFarmsData] = useState<Array<FarmDataType>>([]);
    const [paginationDetails, setPaginationDetails] = useState<PaginationInFarmResponse>();
    const [loading, setLoading] = useState(true);
    const [searchString, setSearchString] = useState('');

    const getAllFarms = async ({page=1,limit=10,search_string = ''}:Partial<{page:number,limit:number,search_string:string}>) => {
        
        setLoading(true);
        let url = `farm/${page}/${limit}`
        let queryParam: any = {
            order_by: "createdAt",
            order_type:"desc"
        };

        if (search_string) {
            queryParam['search_string'] = search_string;
        }
        router.push({ pathname: '/farms', query: queryParam })
        url = prepareURLEncodedParams(url, queryParam);


        const response = await getAllFarmsService(url,accessToken);
        
        if (response?.success) {
            const { data, ...rest } = response;
            setFarmsData(data);
            setPaginationDetails(rest)
        }
        setLoading(false);

    };

    const captureSearchString = (search: string) => {
        setSearchString(search);

    };

    const getDataOnRender = async () => {
        const delay = 500;
        const debounce = setTimeout(() => {
            let searchFromRouter = router.query.search_string;
            
            if (searchFromRouter) {
                setSearchString(searchFromRouter as string)
                getAllFarms({ page: 1, limit: 10, search_string: searchFromRouter as string });
            } else {
                getAllFarms({ page: 1, limit: 10, search_string: searchString });
            }
            
        }, delay);

        return () => clearTimeout(debounce);
    };

    useEffect(() => {
        if (router.isReady && accessToken) {
            let searchFromRouter = router.query.search_string;
            getAllFarms({ page: 1, limit: 10, search_string: searchFromRouter as string });
            setSearchString(searchFromRouter as string)
        }
    }, [router.isReady, accessToken]);
    

    useEffect(() => {
        if (router.isReady&&accessToken) {
            const delay = 500;
        const debounce = setTimeout(() => {
            getAllFarms({ page: 1, limit: 10, search_string: searchString });
        }, delay);
        return () => clearTimeout(debounce);
        }
    }, [searchString]);

    return (
        <div id="dashboardPage">
            <DashBoardHeader captureSearchString={captureSearchString} searchString={searchString} />
            <FarmCard farmsData={farmsData} paginationDetails={paginationDetails} loading={loading} />
            <div className="addFormPositionIcon" style={{position:'fixed'}}>
                <img src="/add-form-icon.svg" alt="" onClick={() => router.push("/scouting/farms/add")} />
            </div>
            <LoadingComponent loading={loading}/>
        </div>
    );
}

export default DashboardPage;