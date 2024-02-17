import type { NextPage } from "next";
import { Button, Icon, IconButton } from "@mui/material";
import styles from "./farmListCard.module.css";
import timePipe from "@/pipes/timePipe";
import LocationOnIcon from "@mui/icons-material/LocationOn";
const FarmListCard = ({
  data, getFarmLocation, editPolygonDetails, setEditFarmsDetails, editFarmDetails,
  setPolygonCoords, getFarmOptions, setSelectedPolygon

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

                  // <IconButton onClick={() => {
                  //   if (editFarmDetails?._id) {
                  //     console.log("3445")
                  //     setSelectedPolygon(null)
                  //     setEditFarmsDetails(null)
                  //     setPolygonCoords([])
                  //     getFarmOptions({})
                  //   } else {
                  //     console.log("9876")
                  //     
                  //   }
                  // }}>
                  //   {editFarmDetails?._id == item?._id ?
                  //     <img alt="" src="/viewProcurement/procurement-delete-icon.svg" width={15} height={15} />
                  //     :
                  //     <img alt="" src="/editicon.svg" width={15} height={15} />}
                  // </IconButton> : ""}
                  : ""}


              </div>
              <div className={styles.cropsacres}>
                <div className={styles.cropscontainer}>
                  <h3 className={styles.cropName}>Firestorm Peppers</h3>
                  <h4 className={styles.morenumber}>+1 More</h4>
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
