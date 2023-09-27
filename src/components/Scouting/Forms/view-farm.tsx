import type { NextPage } from "next";
import styles from "./view-farm.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import getFarmByIdService from "../../../../lib/services/FarmsService/getFarmByIdService";
import { FarmDataType } from "@/types/farmCardTypes";
import timePipe from "@/pipes/timePipe";
import LoadingComponent from "@/components/Core/LoadingComponent";
import { useSelector } from "react-redux";

const ViewFarmPage = () => {

  const router = useRouter();

  const [data, setData] = useState<FarmDataType>();
  const [loading, setLoading] = useState(true);
    const accessToken = useSelector((state: any) => state.auth.userDetails?.access_token);


  const getFarmDataById = async () => {
    setLoading(true);
    
    const response: any = await getFarmByIdService(router.query.farm_id as string,accessToken as string);
    
    if (response.success) {
      setData(response.data);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (router.isReady&&accessToken) {
      getFarmDataById();
    }
  }, [router.isReady,accessToken]);
  
  return (
    <div>
      {!loading?<div className={styles.viewfarm} id="view-farm">
      <div className={styles.farmdetailsblock}>
        <div className={styles.farm1}>{data?.title}</div>
        <div className={styles.aug2023}>{timePipe(data?.createdAt as string,'DD, MMM YYYY')} - Current</div>
      </div>
      <div className={styles.farmareaheading} id="area">
        <div className={styles.text}>Land (acres)</div>
        <div className={styles.acres}>{data?.area?.toFixed(2)} ACRES</div>
      </div>
      <div
        className={styles.locationdetailsblock}
        id="location-details-block"
      >
        {/* <div className={styles.map} id="map">
          <img
            className={styles.mapimage6Icon}
            alt=""
            src="/map-image-form-view.png"
          />
          <img className={styles.locationIcon} alt="" src="/location-blue-icon.svg" />
        </div> */}
        <p className={styles.locationMarked} id="location-details">
          <span>
            Location:
          </span>{data?.location ? ' '+data?.location :" N/A"}
          </p>
        {/* <p className={styles.locationMarked} id="location-details">
          <span>
            Location Marked at :
          </span>
          Latitude: 40.7128° N, Longitude: -74.0060° W 123 Farm land,
          Chittore, NY 523113, Andhra Prades.

        </p> */}
      </div>
    </div>:""}
    <LoadingComponent loading={loading}/>
    </div>
  );
};

export default ViewFarmPage;
