import { FunctionComponent, useEffect, useState } from "react";
import styles from "./CardDetails.module.css";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import getFarmByIdService from "../../../../lib/services/FarmsService/getFarmByIdService";
import { FarmDataType } from "@/types/farmCardTypes";
import timePipe from "@/pipes/timePipe";
import LoadingComponent from "@/components/Core/LoadingComponent";
import FarmDetailsMiniCard from "@/components/AddLogs/farm-details-mini-card";

const CardDetails: FunctionComponent = () => {

  const router = useRouter();

  const accessToken = useSelector((state: any) => state.auth.userDetails?.access_token);
  const userType = useSelector((state: any) => state.auth.userDetails?.user_details?.user_type);


  const [data, setData] = useState<FarmDataType>();
  const [loading, setLoading] = useState(true);

  const getFarmById = async () => {
    setLoading(true);
    const response = await getFarmByIdService(router.query.farm_id as string, accessToken);

    if (response?.success) {
      setData(response?.data);
    }
    setLoading(false);
  }
  useEffect(() => {
    if (router.isReady && accessToken) {
      getFarmById();
    }
  }, [router.isReady, accessToken]);

  return (
    <div style={{ maxWidth: "100%", padding: "5% 20% 5% 20%" }}>
      <FarmDetailsMiniCard farmDetails={data} />

      <div className={styles.viewScoutingHeader}>
        <div
          className={styles.iconDiv}
          style={{ cursor: "pointer" }}
          onClick={() => router.back()}
        >
          <img src="/arrow-left-back.svg" alt="" width={"18px"} />
        </div>
        <h5>View Farm</h5>
      </div>
      <div className={styles.cardDetails}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div className={styles.textwrapper}>
            <h1 className={styles.farmname}>
              {data?.title ? data?.title : ""}
            </h1>
            <p className={styles.dateandtime}>
              {timePipe(data?.createdAt, "DD MMM YYYY, hh:mm A")}
            </p>
          </div>
          {userType == "AGRONOMIST" ? (
            <div>
              <div className={styles.textwrapper}>
                <h1 className={styles.userDetails}>User Mobile:</h1>
                <p className={styles.dateandtime}>{data?.user_id?.phone}</p>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
        <div className={styles.landdetails}>
          <div className={styles.lable}>
            <h1 className={styles.heading}>Land (acres)</h1>
            <p className={styles.acres}>{data?.area} Acres</p>
          </div>
        </div>

        <div className={styles.landdetails}>
          <div className={styles.lable}>
            <h1 className={styles.heading}>Location</h1>
            <p className={styles.acres}>{data?.location_id.title}</p>
          </div>
        </div>
      </div>
      <LoadingComponent loading={loading} />
    </div>
  );
};

export default CardDetails;

{/* <div className={styles.landMark}>
  <div className={styles.maplocation}>
    <img className={styles.locatorIcon} alt="" src="/locator.svg" />
  </div>
  <p className={styles.mapdetails}>
    <p className={styles.text}>
      <span>{`Location Marked at : `}</span>
      <span className={styles.latitude407128N}>
        Latitude: 40.7128° N, Longitude: -74.0060° W 123 Farm land,
        Chittore, NY 523113, Andhra Pradesh.
      </span>
    </p>
  </p>
</div> */}