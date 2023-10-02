import { FunctionComponent } from "react";
import styles from "./ScoutingDetails.module.css";
import { Card } from "@mui/material";

const ScoutingDetails: FunctionComponent = () => {
  return (
    <div className={styles.viewScoutingPage}>
      <div className={styles.viewScoutingHeader}>
        <div className={styles.iconDiv}>
          <img src="/arrow-left-back.svg" alt="" width={'18px'} />
        </div>
        <h5>
          VIEW SCOUTING
        </h5>
      </div>
      <Card className={styles.scoutingdetails}>
        <div className={styles.textwrapper}>
          <h1 className={styles.farmname}>Farm-1</h1>
          <p className={styles.startdate}>25 Aug 2023 10:30AM</p>
        </div>
        <div className={styles.attachments}>
          <p className={styles.text}>Attachments</p>
          <div className={styles.gallaryContainer}>
            <img className={styles.imageIcon} alt="" src="/image14@2x.png" />
            <img className={styles.imageIcon} alt="" src="/image11@2x.png" />
            <img className={styles.imageIcon} alt="" src="/image12@2x.png" />
            <img className={styles.imageIcon} alt="" src="/image13@2x.png" />
            <img className={styles.imageIcon} alt="" src="/image14@2x.png" />
            <img className={styles.imageIcon} alt="" src="/image9@2x.png" />
            <img className={styles.imageIcon} alt="" src="/image10@2x.png" />
            <img className={styles.imageIcon} alt="" src="/image13@2x.png" />
            <img className={styles.imageIcon} alt="" src="/image11@2x.png" />
            <img className={styles.imageIcon} alt="" src="/image10@2x.png" />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ScoutingDetails;
