import { useRouter } from "next/router";
import DashBoardHeader from "./dash-board-header";
import FarmCard from "./farm-card";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FarmDataType, PaginationInFarmResponse } from "@/types/farmCardTypes";
import LoadingComponent from "@/components/Core/LoadingComponent";
import getAllFarmsService from "../../../../lib/services/FarmsService/getAllFarmsServiceMobile";
import { prepareURLEncodedParams } from "../../../../lib/requestUtils/urlEncoder";
import NoFarmDataComponent from "@/components/Core/NoFarmDataComponent";
import getAllLocationsService from "../../../../lib/services/Locations/getAllLocationsService";


const DashboardPage = () => {

    const router = useRouter();

    const accessToken = useSelector((state: any) => state.auth.userDetails?.access_token);

    const [farmsData, setFarmsData] = useState<Array<FarmDataType>>([]);
    const [paginationDetails, setPaginationDetails] = useState<PaginationInFarmResponse>();
    const [loading, setLoading] = useState(true);
    const [searchString, setSearchString] = useState('');
    const [locations, setLocations] = useState<Array<{name:string,_id:string}>>([]);

    const getAllFarms = async ({ page = 1, limit = 100, search_string = '', location }: Partial<{ page: number, limit: number, search_string: string, location: string }>) => {

        setLoading(true);
        try {
            let url = `farm/${page}/${limit}`
            let queryParam: any = {
                order_by: "createdAt",
                order_type: "desc"
            };

            if (search_string) {
                queryParam['search_string'] = search_string;
            }
            if (location) {
                if (location !== 'All') {
                    queryParam['location'] = location;
                }
            }
            router.push({ pathname: '/farms', query: queryParam })
            url = prepareURLEncodedParams(url, queryParam);


            const response = await getAllFarmsService(url, accessToken);

            if (response?.success) {
                const { data, ...rest } = response;
                setFarmsData(data);
                setPaginationDetails(rest)
            }
        } catch (err: any) {
            console.error(err)
        } finally {
            setLoading(false);
        }

    };

    const captureSearchString = (search: string) => {
        setSearchString(search);

    };


    const [location, setLocation] = useState('');
    useEffect(() => {
        if (router.isReady && accessToken && location) {

            const delay = 500;
            const debounce = setTimeout(() => {
                getAllFarms({ page: 1, limit: 100, search_string: searchString, location: location });
            }, delay);
            return () => clearTimeout(debounce);
        }
    }, [searchString]);

    const getAllLocations = async () => {
        const response = await getAllLocationsService(accessToken);
        if (response?.data?.length) {
            setLocations([{name:'All',_id:'1'}, ...response?.data]);
        } else {
            setLocations([{name:'All',_id:'1'}]);
        }


        let searchFromRouter = router.query.search_string;
        let locationFromRouter = router.query.location;
        await getAllFarms({ page: 1, limit: 100, search_string: searchFromRouter as string, location: locationFromRouter as string });
        if (searchFromRouter) {
            setSearchString(searchFromRouter as string);
        }
        if (locationFromRouter) {
            setLocation(locationFromRouter as string);
        } else {
            setLocation('All');
        }

    }



    const getData = async () => {
        if (router.isReady && accessToken) {

            await getAllLocations();
        } else {
            // setLoading(false);
        }
    }
    useEffect(() => {
        getData();
    }, [router.isReady, accessToken]);



    const getDataOnLocationChange = async (location: string) => {
        await getAllFarms({ page: 1, limit: 100, search_string: searchString as string, location: location });
    }

    const [routerLocation, setRouterLocation] = useState('');
    useEffect(() => {
        setRouterLocation(router?.query.location ? router?.query.location as string : "");
    },[router?.query.location])
    return (
        <div id="dashboardPage">
            <DashBoardHeader
                captureSearchString={captureSearchString}
                searchString={searchString}
                locations={locations}
                location={location}
                setLocation={setLocation}
                getDataOnLocationChange={getDataOnLocationChange} />

            {farmsData.length ? <FarmCard farmsData={farmsData} paginationDetails={paginationDetails} loading={loading} location={location} /> :
                (!loading ? <NoFarmDataComponent noData={!Boolean(farmsData.length)} /> :
                    <div style={{ minHeight: "75vh" }}>

                    </div>

                )}
            <div className="addFormPositionIcon">
                <img src="/add-plus-icon.svg" alt="" onClick={() => {
                    if (routerLocation) {
                        router.push(`/farms/add?location=${routerLocation}`);
                    } else {
                        router.push("/farms/add")
                    }
                }} />
            </div>
            <LoadingComponent loading={loading} />
        </div>
    );
}

export default DashboardPage;