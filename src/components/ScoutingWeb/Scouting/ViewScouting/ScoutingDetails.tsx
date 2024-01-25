import CommentsComponentForWeb from "@/components/Scouting/Comments/CommentsComponentForweb";
import timePipe from "@/pipes/timePipe";
import CloseIcon from "@mui/icons-material/Close";
import { Avatar, Chip, IconButton, Skeleton, Typography } from "@mui/material";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "yet-another-react-lightbox/styles.css";
import styles from "./ScoutingDetails.module.css";
import SellIcon from "@mui/icons-material/Sell";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { Toaster } from "sonner";
import Image from "next/image";

const ScoutingDetails = ({
  loading,
  data
}: any) => {
  const router = useRouter();
  const paramasFromStore = useSelector((state: any) => state.auth.queryParams);

  return (
    <div className={styles.viewScoutingPage}>
      <div className={styles.viewHeader}>
        <div style={{ textAlign: "end", paddingTop: "5px", marginBottom: "0.5rem" }}>

          <IconButton
            className={styles.iconDiv}
            // onClick={() => setPreviewImageDialogOpen(false)}
            onClick={() => {
              router.push({
                pathname: `/scouts/`,
                query: { ...paramasFromStore },
              })
            }}
          >
            <CloseIcon sx={{ fontSize: "1.5rem" }} />
          </IconButton>
        </div>

        <div className={styles.imageCapturedDetails} >
          <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
            <Avatar sx={{ bgcolor: "#D94841", height: "20px", width: "21px", fontSize: "7px" }}>
              {data?.uploaded_by?.name?.slice(0, 2).toUpperCase()}
            </Avatar>

            <div>

              <Typography
                className={styles.createdName}
                variant="caption"
                color="indigo"
              >
                {loading ? (
                  <Skeleton width="300px" height="30px" />
                ) : (
                  data?.uploaded_by?.name
                )}
              </Typography>
              {loading ? (
                <Skeleton width="200px" />
              ) : (
                <p className={styles.startdate}>
                  {timePipe(data?.uploaded_at, "DD MMM YYYY hh:mm A")}
                </p>
              )}
            </div>
          </div>
          <div className={styles.loactionBlock}>
            <Image src="/location-3-1-11.svg" alt="" width={15} height={15} />
            <p className={styles.createdLocation}>Location</p>
          </div>

        </div>
        <div className={styles.farmDetailsBlock} >
          <h2 className={styles.farmname}>
            <Image src="/mobileIcons/farms/farm-view-mobile.svg" alt="" width={15} height={15} />
            {loading ? (
              <Skeleton width="300px" height="30px" />
            ) : (
              data?.farm_id?.title
            )}
          </h2>
          <h1 className={styles.farmname}>
            <Image src="/mobileIcons/farms/plant-black-icon.svg" alt="" width={15} height={15} />

            <span>
              {loading ? (
                <Skeleton width="200px" height="30px" />
              ) : (
                data?.crop_id?.title
              )}
            </span>
          </h1>
        </div>
      </div>
      <div
        style={{
          color: "white",
          alignItems: "flex-start",
          padding: "4px 20px 4px 20px",
          justifyContent: "flex-start",
          margin: "0 auto",
          display: "flex",
          width: "85%",
          flexDirection: "row",
        }}
      >
        {/* <Chip
          className={styles.tagsLabel}
          icon={<SellIcon sx={{ fontSize: 15 }} color="info" />}
          label="Tags"
          variant="outlined"
        /> */}
      </div>
      <div className={styles.tagsBlock}>
        <p className={styles.tagHeading}>
          <Image src="/mobileIcons/singleImage-tag-icon.svg" alt="" width={15} height={15} />
          <span>
            Tags
          </span>
        </p>
        {data?.tags?.length ? (
          <div
            style={{
              alignItems: "flex-start",
              padding: "16px 0px 0px 0px",
              justifyContent: "flex-start",
              margin: "0 auto",
              display: "flex",
              flexWrap: "wrap",
              width: "100%",
              flexDirection: "row",
            }}
          >
            {data?.tags?.length
              ? data?.tags?.map((item: string, index: number) => {
                return (
                  <Chip
                    key={index}
                    label={item}
                    className={styles.tagsName}
                    variant="outlined"
                  />
                );
              })
              : "No tags  "}
          </div>
        ) : (
          <div style={{ textAlign: "center" }}>No tags</div>
        )}
      </div>

      <div className={styles.RecommedationBlock}>
        <Typography variant="h6" className={styles.RecommedationHeading}>
          <Image src="/chat-scout-icon.svg" alt="" width={12} height={12} />
          Comments
        </Typography>
        <CommentsComponentForWeb scoutDetails={data} attachement={data} />
      </div>
      <Toaster richColors position="top-right" closeButton />
    </div>
  );
};

export default ScoutingDetails;
