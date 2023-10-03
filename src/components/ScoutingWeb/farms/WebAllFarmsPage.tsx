import { useCallback, useEffect, useState } from "react";
import ScoutingFarmDetailsCard from "./FarmDetailsCard";
import FarmsNavBarWeb, { getFarmsData } from "./FarmsNavBar";
import styles from "./FarmsNavBar.module.css";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { FarmDataType } from "@/types/farmCardTypes";
import getAllFarmsService from "../../../../lib/services/FarmsService/getAllFarmsServiceMobile";
import { prepareURLEncodedParams } from "../../../../lib/requestUtils/urlEncoder";
const AllFarmsPage = () => {

    const router = useRouter();

  const accessToken = useSelector((state: any) => state.auth.userDetails?.access_token);

  const [data, setData] = useState<Array<FarmDataType>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (router.isReady && accessToken) {
      getFarmsData({ search_string:router.query.search_string as string });
    }
  }, [router.isReady,accessToken]);

  
  const onViewClick = useCallback((farmId:string) => {
    router.push(`/farm/${farmId}`);
  }, []);

  const getFarmsData = async ({search_string=''}:{search_string:string}) => {
    setLoading(true);
    try {
        let url = `farm/${1}/${100}`;
        let queryParam: any = {
            order_by: "createdAt",
            order_type: "desc"
        };

        if (search_string) {
            queryParam['search_string'] = search_string;
        }
        // if (location) {
        //     if (location !== 'All') {
        //         queryParam['location'] = location;
        //     }
        // }
        router.push({ pathname: '/farm', query: queryParam })
        url = prepareURLEncodedParams(url, queryParam);


        const response = await getAllFarmsService(url, accessToken);

        if (response?.success) {
            const { data } = response;
            setData(data);
        }
    } catch (err: any) {
        console.error(err)
    } finally {
        setLoading(false);
    }
  }


    
    
    return (
        <div className={styles.AllFarmsPageWeb}>
            <FarmsNavBarWeb  getFarmsData={getFarmsData} />
            <div className={styles.allFarms}>
                <ScoutingFarmDetailsCard  getFarmsData={getFarmsData} data={data} onViewClick={onViewClick} loading={loading} />
            </div>
        </div>
    );
}

export default AllFarmsPage;