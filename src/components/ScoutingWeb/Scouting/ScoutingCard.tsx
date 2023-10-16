import DrawerComponentForScout from "@/components/Scouting/Comments/DrawerBoxForScout";
import timePipe from "@/pipes/timePipe";
import {
  ScoutAttachmentDetails,
  SingleScoutResponse,
} from "@/types/scoutTypes";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Chip, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import styles from "./ScoutingCard.module.css";
import ScoutingDetails from "./ViewScouting/ScoutingDetails";

interface pageProps {
  item: SingleScoutResponse;
}

const ScoutingCardWeb = ({ item }: pageProps) => {
  const router = useRouter();

  const [isReadMore, setIsReadMore] = useState(false);
  const [readMoreIndex, setReadMoreIndex] = useState("");
  const [drawerOpen, setDrawerOpen] = useState<any>(false);
  const [scoutingDetailsDrawer, setScoutingDetailsDrawer] = useState<any>();

  const onViewClick = useCallback(() => {
    setDrawerOpen(true);

    // router.push(
    //   `/farm/${router.query.farm_id}/crops/${router.query.crop_id}/scouting/${item._id}`
    // );
  }, []);

  const [state, setState] = useState(false);

  const handleImageLoad = () => {
    setState(true);
  };

  const setReadMore = (id: string) => {
    setReadMoreIndex(id);
    setIsReadMore(true);
  };
  const setReadLess = (id: string) => {
    setReadMoreIndex("");
    setIsReadMore(false);
  };

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
    <div className={styles.scoutingCard}>
      <div className={styles.carddetails}>
        <div>
          <div>
            {item.created_by.full_name ? item.created_by.full_name : "-"}
          </div>
          <p className={styles.date}>
            {timePipe(item.createdAt, "DD MMM YYYY, hh:mm A")}
          </p>
        </div>
        <div className={styles.buttons}></div>
      </div>
      <div
        className={styles.carddetails}
        style={{ background: "#f8ffea", border: "1px solid #e1ead3" }}
      >
        <div>
          <div>{item.farm_id.title ? item.farm_id.title : "-"}</div>
        </div>
        <div className={styles.buttons}>{getCropTitle()}</div>
      </div>

      <div className={styles.carddetails}>
        <div>
          {readMoreIndex !== item?._id && !isReadMore ? (
            <div>
              {item.description
                ? item.description?.length > 100
                  ? item?.description.slice(0, 97) + "..."
                  : item.description
                : ""}
              {item.description?.length > 100 ? (
                <span onClick={() => setReadMore(item?._id)}>
                  {" Read More"}
                </span>
              ) : (
                ""
              )}
            </div>
          ) : (
            <div>
              {item.description ? item.description : "-"}
              {item.description?.length > 100 ? (
                <span onClick={() => setReadLess(item?._id)}>
                  {" Read Less"}
                </span>
              ) : (
                ""
              )}
            </div>
          )}
        </div>
        {/* <div className={styles.buttons}>Crop Name</div> */}
      </div>
      {/* <div className={styles.imgFlexContainer}>
        {item.attachments.length ? (
          item.attachments
            .slice(0, 6)
            .map((itemObj: ScoutAttachmentDetails, index: number) => {
              return (
                <div
                  key={index}
                  className={
                    item.attachments.length > 3
                      ? styles.eachImgBox
                      : styles.eachImgBoxLessThan3
                  }
                >
                  {itemObj.type.slice(0, 5) == "video" ? (
                    <img
                      className={styles.imageIcon}
                      src={"/videoimg.png"}
                      alt={itemObj.name}
                      onLoad={handleImageLoad}
                      style={{ display: state ? "block" : "none" }}
                    />
                  ) : itemObj.type.includes("application") ? (
                    <img
                      className={styles.imageIcon}
                      src={"/pdf-icon.png"}
                      alt={itemObj.name}
                      onLoad={handleImageLoad}
                      style={{ display: state ? "block" : "none" }}
                    />
                  ) : (
                    <img
                      className={styles.imageIcon}
                      src={itemObj.url}
                      alt={itemObj.name}
                      onLoad={handleImageLoad}
                      style={{ display: state ? "block" : "none" }}
                    />
                  )}
                </div>
              );
            })
        ) : (
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            No Attachments
          </div>
        )}
      </div> */}
      <div className={styles.carddetails}>
        {/* <p className={styles.date}>{timePipe(item.createdAt, 'DD MMM YYYY, hh:mm A')}</p> */}
        <div className={styles.buttons}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Chip
              onClick={() => {
                setScoutingDetailsDrawer(true);
                if (router.pathname == "/scouts") {
                  router.push({
                    pathname: `/scouts`,
                    query: { scout_id: item._id },
                  });
                } else {
                  router.push({
                    pathname: `/farm/${router.query.farm_id}/crops/${router.query.crop_id}/scouting`,
                    query: { scout_id: item._id },
                  });
                }
              }}
              label={
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    alignContent: "center",
                  }}
                >
                  <VisibilityIcon />
                  <Typography style={{ marginLeft: "5px" }}>View</Typography>
                </div>
              }
            />

            <Chip
              onClick={() => {
                onViewClick();
                if (router.pathname == "/scouts") {
                  router.push({
                    pathname: `/scouts`,
                    query: { scout_id: item._id },
                  });
                } else {
                  router.push({
                    pathname: `/farm/${router.query.farm_id}/crops/${router.query.crop_id}/scouting`,
                    query: { scout_id: item._id },
                  });
                }
              }}
              label={
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    alignContent: "center",
                  }}
                >
                  <Image
                    alt="Delete"
                    height={15}
                    width={15}
                    src="/comments-icon.svg"
                    style={{ borderRadius: "5%" }}
                  />
                  <Typography style={{ marginLeft: "5px" }}>2</Typography>
                </div>
              }
            />
          </div >
        </div >
      </div >
      {scoutingDetailsDrawer == true ? (
        <ScoutingDetails drawerClose={drawerClose} />
      ) : (
        ""
      )}
      {drawerOpen == true ? (
        <DrawerComponentForScout
          drawerClose={drawerClose}
          scoutId={item._id}
          anchor={"right"}
          item={item}
        />
      ) : (
        ""
      )}
    </div >
  );
};

export default ScoutingCardWeb;

// {/* <VideoDialogForScout
//   open={openDialog}
//   onClose={handleCloseDialog}
//   mediaArray={item.attachments}
//   index={index}
// /> */}
