import type { NextPage } from "next";
import styles from "./view-farm.module.css";
import { useEffect, useState } from "react";

const ViewFarmPage = () => {

  const [data, setData] = useState();


  const getFarmDataById = async () => {
    // const response = getFarm
  }
  useEffect(() => {
    getFarmDataById();
  },[])
  return (
    <div className={styles.viewfarm} id="view-farm">
      <div className={styles.farmdetailsblock}>
        <div className={styles.farm1}>Farm-1</div>
        <div className={styles.aug2023}>25, Aug 2023 - Current</div>
      </div>
      <div className={styles.farmareaheading} id="area">
        <div className={styles.text}>Land (acres)</div>
        <div className={styles.acres}>20 ACRES</div>
      </div>
      <div
        className={styles.locationdetailsblock}
        id="location-details-block"
      >
        <div className={styles.map} id="map">
          <img
            className={styles.mapimage6Icon}
            alt=""
            src="/map-image-form-view.png"
          />
          <img className={styles.locationIcon} alt="" src="/location-blue-icon.svg" />
        </div>
        <p className={styles.locationMarked} id="location-details">
          <span>
            Location Marked at :
          </span>
          Latitude: 40.7128° N, Longitude: -74.0060° W 123 Farm land,
          Chittore, NY 523113, Andhra Prades.

        </p>
      </div>
    </div>
  );
};

export default ViewFarmPage;
