import { FunctionComponent, useEffect, useState } from "react";
import styles from "./CardDetails.module.css";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import getFarmByIdService from "../../../../lib/services/FarmsService/getFarmByIdService";
import { FarmDataType } from "@/types/farmCardTypes";
import timePipe from "@/pipes/timePipe";
import LoadingComponent from "@/components/Core/LoadingComponent";
import FarmDetailsMiniCard from "@/components/AddLogs/farm-details-mini-card";
import { Box, Typography } from "@mui/material";

const CardDetails: FunctionComponent = () => {

  const router = useRouter();

  const accessToken = useSelector((state: any) => state.auth.userDetails?.access_token);
  const userType = useSelector((state: any) => state.auth.userDetails?.user_details?.user_type);


  const [data, setData] = useState<FarmDataType>();
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState<any>([])

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
      getStatsCount()
    }
  }, [router.isReady, accessToken]);


  const getStatsCount = async () => {
    setLoading(true)
    try {
      let urls = [
        `${process.env.NEXT_PUBLIC_API_URL}/farms/${router.query.farm_id}/crops-count`,
        `${process.env.NEXT_PUBLIC_API_URL}/farms/${router.query.farm_id}/images-count`,
      ];
      let tempResult: any = [];

      const responses = await Promise.allSettled(
        urls.map(async (url) => {
          const response = await fetch(url, {
            method: "GET",
            headers: new Headers({
              authorization: accessToken,
            }),
          });
          return response.json();
        })
      );

      responses.forEach((result, num) => {
        if (result.status === "fulfilled") {
          tempResult.push(result.value);
        }
        if (result.status === "rejected") {
        }
      });
      console.log(tempResult, "klo")
      setStatsData(tempResult)
    }
    catch (err) {
      console.log(err)
    }
    finally {
      setLoading(false)

    }
  }


  return (
    // <div style={{ maxWidth: "100%", padding: "5% 20% 5% 20%" }}>
    //   <FarmDetailsMiniCard farmDetails={data} />

    //   <div className={styles.viewScoutingHeader}>
    //     <div
    //       className={styles.iconDiv}
    //       style={{ cursor: "pointer" }}
    //       onClick={() => router.back()}
    //     >
    //       <img src="/arrow-left-back.svg" alt="" width={"18px"} />
    //     </div>
    //     <h5>View Farm</h5>
    //   </div>
    //   <div className={styles.cardDetails}>
    //     <div
    //       style={{
    //         display: "flex",
    //         justifyContent: "space-between",
    //         width: "100%",
    //       }}
    //     >
    //       <div className={styles.textwrapper}>
    //         <h1 className={styles.farmname}>
    //           {data?.title ? data?.title : ""}
    //         </h1>
    //         <p className={styles.dateandtime}>
    //           {timePipe(data?.createdAt, "DD MMM YYYY, hh:mm A")}
    //         </p>
    //       </div>
    //       {userType == "AGRONOMIST" ? (
    //         <div>
    //           <div className={styles.textwrapper}>
    //             <h1 className={styles.userDetails}>User Mobile:</h1>
    //             <p className={styles.dateandtime}>{data?.user_id?.phone}</p>
    //           </div>
    //         </div>
    //       ) : (
    //         ""
    //       )}
    //     </div>
    //     <div className={styles.landdetails}>
    //       <div className={styles.lable}>
    //         <h1 className={styles.heading}>Land (acres)</h1>
    //         <p className={styles.acres}>{data?.area} Acres</p>
    //       </div>
    //     </div>

    //     <div className={styles.landdetails}>
    //       <div className={styles.lable}>
    //         <h1 className={styles.heading}>Location</h1>
    //         <p className={styles.acres}>{data?.location_id.title}</p>
    //       </div>
    //     </div>
    //   </div>
    //   <LoadingComponent loading={loading} />
    // </div>
    <div style={{ maxWidth: "100%", padding: "5% 20% 5% 20%" }}>
      <div className={styles.header} id="header">
        <img
          className={styles.iconsiconArrowLeft}
          alt=""
          src="/iconsiconarrowleft.svg"
          onClick={() => router.back()}
        />
        <Typography className={styles.viewFarm}>Farm Details</Typography>
        <div className={styles.headericon} id="header-icon" >
        </div>

      </div>
      {!loading ? (
        <div className={styles.viewFarmDetailsCard}>
          <div className={styles.overViewBtns}>
            <div className={styles.farmOverView} style={{ background: "#D94841" }}>
              <img src="/mobileIcons/farms/Crop.svg" alt="" width={"24px"} />
              <div className={styles.overViewText}>
                <h6>{statsData[0]?.data}</h6>
                <span>Crops</span>
              </div>
            </div>
            <div className={styles.farmOverView} style={{ background: "#05A155" }}>
              <img src="/mobileIcons/farms/image-fill.svg" alt="" width={"24px"} />
              <div className={styles.overViewText}>
                <h6>{statsData[1]?.data}</h6>
                <span>Images</span>
              </div>
            </div>
          </div>
          <div className={styles.viewfarmCard} id="view-farm">
            <Box className={styles.farmdetailsblock}>
              <div className={styles.iconBlock} >


              </div>
              <div className={styles.eachFarmDetails} >
                <div className={styles.detailsHeading}>
                  <img src="/mobileIcons/farms/farm-view-mobile.svg" alt="" width={"20px"} />
                  <span>Title</span>
                </div>
                <div className={styles.aboutFarm}>
                  {data?.title}
                </div>
              </div>
              <div className={styles.eachFarmDetails}>
                <div className={styles.detailsHeading}>
                  <img src="/mobileIcons/farms/field-icon.svg" alt="" width={"20px"} />
                  <span> Acres</span>

                </div>
                <div className={styles.aboutFarm}>
                  {data?.area ? Math.floor(data?.area * 100) / 100 : ""}
                </div>

              </div>
              <div className={styles.eachFarmDetails} >
                <div className={styles.detailsHeading}>
                  <img src="/mobileIcons/farms/map-pin-line-view.svg" alt="" width={"20px"} />
                  <span>  Location</span>

                </div>
                <div className={styles.aboutFarm}>
                  {data?.location_id?.title ? ' ' + data?.location_id?.title : " N/A"}
                </div>

              </div>
              <div className={styles.eachFarmDetails} >
                <div className={styles.detailsHeading}>
                  <img src="/mobileIcons/farms/calendar-blank.svg" alt="" width={"20px"} />
                  <span>Created On</span>

                </div>
                <div className={styles.aboutFarm}>
                  {timePipe(data?.createdAt as string, 'DD, MMM YYYY')}
                </div>

              </div>
            </Box>
          </div>
        </div>
      ) : (
        ""
      )}

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