import CommentsComponentForWeb from "@/components/Scouting/Comments/CommentsComponentForweb";
import timePipe from "@/pipes/timePipe";
import CloseIcon from "@mui/icons-material/Close";
import { Chip, IconButton, Skeleton, Typography } from "@mui/material";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "yet-another-react-lightbox/styles.css";
import styles from "./ScoutingDetails.module.css";

import SellIcon from "@mui/icons-material/Sell";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { Toaster } from "sonner";

const ScoutingDetails = ({
  loading,
  data
}: any) => {
  const router = useRouter();
  const paramasFromStore = useSelector((state: any) => state.auth.queryParams);

  return (
    <div className={styles.viewScoutingPage}>
      <div className={styles.viewHeader}>
        <div>
          {loading ? (
            <Skeleton width="200px" />
          ) : (
            <p className={styles.startdate}>
              {timePipe(data?.uploaded_at, "DD MMM YYYY hh:mm A")}
            </p>
          )}
          {loading ? (
            <Skeleton width="200px" height="30px" />
          ) : (
            <h1 className={styles.cropName}>
              <img src="/cropName-icon.svg" alt="" />
              {data?.crop_id?.title}
            </h1>
          )}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h2 className={styles.farmname}>
              {loading ? (
                <Skeleton width="300px" height="30px" />
              ) : (
                data?.farm_id?.title
              )}
            </h2>

            <Typography
              className={styles.farmname}
              variant="caption"
              color="indigo"
            >
              {loading ? (
                <Skeleton width="300px" height="30px" />
              ) : (
                " (Uploaded By" + ":" + data?.uploaded_by?.name + ")"
              )}
            </Typography>
          </div>
        </div>
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
          <CloseIcon />
        </IconButton>
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
      {data?.tags?.length ? (
        <div
          style={{
            color: "black",
            alignItems: "flex-start",
            padding: "4px 20px 4px 20px",
            justifyContent: "flex-start",
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            width: "85%",
            flexDirection: "row",
          }}
        >
          {data?.tags?.length
            ? data?.tags?.map((item: string, index: number) => {
              return (
                <Chip
                  icon={<SellIcon sx={{ fontSize: 15 }} color="success" />}
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
      <hr />

      <div className={styles.RecommedationBlock}>
        <Typography variant="h6" className={styles.RecommedationHeading}>
          Comments
        </Typography>
        <CommentsComponentForWeb scoutDetails={data} attachement={data} />
      </div>
      <Toaster richColors position="top-right" closeButton />
    </div>
  );
};

export default ScoutingDetails;
