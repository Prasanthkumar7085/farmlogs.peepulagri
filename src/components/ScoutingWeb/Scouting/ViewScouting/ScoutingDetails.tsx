import CommentsComponentForWeb from "@/components/Scouting/Comments/CommentsComponentForweb";
import timePipe from "@/pipes/timePipe";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton, Skeleton, Typography } from "@mui/material";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "yet-another-react-lightbox/styles.css";
import styles from "./ScoutingDetails.module.css";

const ScoutingDetails = ({
  loading,
  data,
  content,
  setPreviewImageDialogOpen,
}: any) => {
  return (
    <div className={styles.viewScoutingPage}>
      <div className={styles.viewHeader}>
        <div>
          {loading ? (
            <Skeleton width="200px" />
          ) : (
            <p className={styles.startdate}>
              {timePipe(data?.createdAt, "DD MMM YYYY hh:mm A")}
            </p>
          )}
          <h1 className={styles.cropName}>
            <img src="/cropName-icon.svg" alt="" />
            Crop{" "}
          </h1>
          <h2 className={styles.farmname}>
            {loading ? (
              <Skeleton width="300px" height="30px" />
            ) : (
              data?.farm_id.title
            )}
          </h2>
        </div>
        <IconButton
          className={styles.iconDiv}
          onClick={() => setPreviewImageDialogOpen(false)}
        >
          <CloseIcon />
        </IconButton>
      </div>

      <div className={styles.scoutingdetails}>
        <div className={styles.textwrapper}>
          <h1 className={styles.finding}>Findings</h1>
          {loading ? (
            <div>
              <Skeleton width="400px" height="20px" />
              <Skeleton width="400px" height="20px" />
              <Skeleton width="400px" height="20px" />
              <Skeleton width="400px" height="20px" />
            </div>
          ) : content?.length ? (
            content?.map((line: any, index: any) => (
              <p className={styles.findingText} key={index}>
                {content ? line : "-"}
              </p>
            ))
          ) : (
            "-"
          )}
        </div>
      </div>
      <div className={styles.RecommedationBlock}>
        <Typography variant="h6" className={styles.RecommedationHeading}>
          Recommedations
        </Typography>
        <CommentsComponentForWeb scoutDetails={data} />
      </div>
    </div>
  );
};

export default ScoutingDetails;
