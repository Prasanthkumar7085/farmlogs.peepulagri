import timePipe from "@/pipes/timePipe";
import { SingleScoutResponse } from "@/types/scoutTypes";
import { Button } from "@mui/material";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import styles from "./ScoutingCard.module.css";

interface pageProps {
  item: SingleScoutResponse;
}

const ScoutingCardWeb = ({ item }: pageProps) => {
  const router = useRouter();

  const [drawerOpen, setDrawerOpen] = useState<any>(false);
  const [scoutingDetailsDrawer, setScoutingDetailsDrawer] = useState<any>();

  const drawerClose = (value: any) => {
    if (value == false) {
      setDrawerOpen(false);
      setScoutingDetailsDrawer(false);
      if (router.pathname == "/scouts") {
        router.push({
          pathname: `/scouts`,
          query: {},
        });
      } else {
        router.push({
          pathname: `/farm/${router.query.farm_id}/crops/${router.query.crop_id}/scouting`,
          query: {},
        });
      }
    }
  };

  const getCropTitle = () => {
    if (item?.farm_id?.crops?.length) {
      let cropId = item?.crop_id;
      let crops = item?.farm_id?.crops;

      let crop = crops.find(
        (item: { title: string; _id: string }) => item._id == cropId
      );
      return crop?.title;
    }
    return "";
  };

  return (
    <>
      <div className={styles.scoutingcardupdated}>
        <div className={styles.header}>
          <div className={styles.userdetails}>
            <div className={styles.userdetails}>
              <img className={styles.usericon} alt="" src="/usericon.svg" />
              <h4 className={styles.username1}>
                {item?.created_by?.full_name}
              </h4>
            </div>
            <p className={styles.date}>
              {timePipe(item.createdAt, "MMM DD YYYY, hh:mm A")}
            </p>
          </div>
        </div>
        <div className={styles.farminfo}>
          <div className={styles.userdetails}>
            <img className={styles.usericon} alt="" src="/fieldicon.svg" />
            <div className={styles.textwrapper}>
              <h3 className={styles.farmname}>{item?.farm_id?.title}</h3>
              <p className={styles.location}>{item?.farm_id?.location}</p>
            </div>
          </div>
          <div className={styles.crop}>
            <img className={styles.usericon} alt="" src="/cropicon.svg" />
            <h5 className={styles.cropname}>{getCropTitle()}</h5>
          </div>
        </div>
        <div className={styles.imagegallery}>
          <div className={styles.grid}>
            {item?.attachments?.length
              ? item?.attachments?.slice(0, 3)?.map((item) => {
                return (
                  <div className={styles.container} key={item?._id}>
                    <img
                      className={styles.imageIcon}
                      alt={item?.original_name}
                      src={
                        item?.type?.includes("video")
                          ? "/videoimg.png"
                          : item.url
                      }
                    />
                  </div>
                );
              })
              : "No Attachments"}
          </div>
        </div>
        <div className={styles.actionscontainer}>
          <div className={styles.actions}>
            <Button className={styles.view} color="primary" variant="contained" onClick={() => {
              setScoutingDetailsDrawer(true);
              if (router.pathname == "/scouts") {
                router.push(
                  `/scouts/${item._id}`,
                );
              } else {
                router.push(
                  `/farm/${router.query.farm_id}/crops/${router.query.crop_id}/scouting/${item._id}`,
                );
              }

            }}>
              View
            </Button>
            <Button
              className={styles.comments}
              color="primary"
              variant="contained"
            >
              02
            </Button>
          </div>
        </div>
      </div >
    </>
  );
};

export default ScoutingCardWeb;
