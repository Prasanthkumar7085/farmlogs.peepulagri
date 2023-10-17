import timePipe from "@/pipes/timePipe";
import {
  ScoutAttachmentDetails,
  SingleScoutResponse,
} from "@/types/scoutTypes";
import { Button } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
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

  const getSrc = (attachment: ScoutAttachmentDetails) => {
    if (attachment?.type?.includes("video")) {
      return "/videoimg.png";
    }
    if (attachment?.type?.includes("image")) {
      return attachment.url;
    } else {
      return "/pdf.svg";
    }
  };
  return (
    <>
      <div
        className={styles.scoutingcardupdated}
        onClick={() => setDrawerOpen(true)}
        style={{ cursor: "pointer" }}
      >
        <div className={styles.header}>
          <div className={styles.userdetails}>
            <div className={styles.userdetails}>
              <img className={styles.usericon} alt="" src="/usericon.svg" />
              <h4 className={styles.username1}>
                {item?.created_by?.full_name}
              </h4>
            </div>
            <p className={styles.date}>
              {timePipe(item.createdAt, "MMM DD, YYYY hh:mm A")}
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
              ? item?.attachments?.slice(0, 3)?.map((attachment) => {
                return (
                  <div className={styles.container} key={attachment?._id}>
                    <img
                      className={styles.imageIcon}
                      alt={attachment?.original_name}
                      src={getSrc(attachment)}
                    />
                  </div>
                );
              })
              : "No Attachments"}
          </div>
        </div>
        <div className={styles.actionscontainer}>
          <Button className={styles.viewBtn} color="primary" variant="contained" onClick={() => {
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
            <img src="/view-icon-scout.svg" alt="" height={"15px"} width={"15px"} />  View
          </Button>
        </div>
      </div>
    </>
  );
};

export default ScoutingCardWeb;
