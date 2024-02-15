import type { NextPage } from "next";
import { Button, Icon, IconButton } from "@mui/material";
import styles from "./farmListCard.module.css";
import timePipe from "@/pipes/timePipe";
import LocationOnIcon from "@mui/icons-material/LocationOn";
const FarmListCard = ({ data, getFarmLocation }: any) => {
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
                <Button
                  className={styles.morebuttonoutline}
                  disableElevation={true}
                  color="primary"
                  variant="text"
                  startIcon={<Icon>refresh_sharp</Icon>}
                  sx={{
                    borderRadius: "0px 0px 0px 0px",
                    width: 20,
                    height: 20,
                  }}
                />
              </div>
              <div className={styles.cropsacres}>
                <div className={styles.cropscontainer}>
                  <h3 className={styles.cropName}>Firestorm Peppers</h3>
                  <h4 className={styles.morenumber}>+1 More</h4>
                </div>
                <p className={styles.acres}>{item.area}ac</p>
              </div>
              <div className={styles.locatedate}>
                <IconButton
                  color="primary"
                  sx={{
                    borderRadius: "0px 0px 0px 0px",
                    display: item?.geometry?.coordinates?.length ? "" : "none",
                  }}
                  onClick={() => {
                    getFarmLocation(item.geometry.coordinates, item._id);
                  }}
                >
                  <LocationOnIcon />
                </IconButton>
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
