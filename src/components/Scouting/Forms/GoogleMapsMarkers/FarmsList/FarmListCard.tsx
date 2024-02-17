import type { NextPage } from "next";
import { Button, Icon, IconButton } from "@mui/material";
import styles from "./farmListCard.module.css";
import timePipe from "@/pipes/timePipe";
import LocationOnIcon from "@mui/icons-material/LocationOn";
const FarmListCard = ({
  data, getFarmLocation, editPolygonDetails, setEditFarmsDetails, editFarmDetails,
  setPolygonCoords, getFarmOptions, setSelectedPolygon,
  setOpenFarmDetails,
  getFarmDataById

}: any) => {
  return (
    <>
      {data?.map((item: any, index: number) => {
        return (
          <div className={styles.farmcard} key={index}>
            <div className={styles.polygoncontainer}>
              <img className={styles.polygonIcon} alt="" src="/marker.svg" />
            </div>
            <div className={styles.detailscontainer}>
              <div className={styles.nameandaction}>
                <h2 className={styles.northSideChilli}>{item.title}</h2>
                {item?.geometry?.coordinates?.length ?


                  editFarmDetails?._id == item?._id ?
                    <IconButton
                      onClick={() => {
                        setSelectedPolygon(null)
                        setEditFarmsDetails(null)
                        setPolygonCoords([])
                        getFarmOptions({})
                      }}>
                      <img alt="" src="/viewProcurement/procurement-delete-icon.svg" width={15} height={15} />
                    </IconButton> :
                    <IconButton onClick={() => {
                      setSelectedPolygon(null)
                      setPolygonCoords([])
                      setEditFarmsDetails(null)
                      editPolygonDetails(item)
                    }}>
                      <img alt="" src="/editicon.svg" width={15} height={15} />
                    </IconButton>

                  : ""}


              </div>
              <div className={styles.cropsacres}>
                <div className={styles.cropscontainer}>
                  <h3 className={styles.cropName}>{item?.location_id?.title}</h3>
                </div>
                <p className={styles.acres}>{item.area}ac</p>
              </div>
              <div className={styles.locatedate}>
                {item?.geometry?.coordinates?.length ?
                  <IconButton
                    color="primary"
                    sx={{
                      borderRadius: "0px 0px 0px 0px",
                      display: item?.geometry?.coordinates?.length && !editFarmDetails?._id ? "" : "none",
                    }}
                    onClick={() => {
                      getFarmLocation(item.geometry.coordinates, item._id);
                    }}
                  >
                    <LocationOnIcon />
                  </IconButton> :
                  <IconButton
                    color="primary"
                    sx={{
                      borderRadius: "0px 0px 0px 0px",
                    }}

                  >
                    +
                  </IconButton>}
                <p className={styles.createddate} onClick={() => {
                  setOpenFarmDetails(true)
                  getFarmDataById(item?._id)
                  setSelectedPolygon(item?._id)
                }}>
                  View Details
                </p>
                <p className={styles.createddate}>
                  {timePipe(item.createdAt, "DD-MM-YYYY")}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default FarmListCard;
