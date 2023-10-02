import { FunctionComponent } from "react";
import styles from "./ScoutingDetails.module.css";

const ScoutingDetails: FunctionComponent = () => {
  return (
    <div className={styles.scoutingdetails}>
      <div className={styles.cardDetails}>
        <div className={styles.namedateandtime}>
          <div className={styles.textwrapper}>
            <h1 className={styles.farmname}>Farm-1</h1>
            <p className={styles.startdate}>25 Aug 2023 10:30AM</p>
          </div>
        </div>
      </div>
      <div className={styles.attachments}>
        <label className={styles.lable}>
          <p className={styles.text}>Attachments</p>
        </label>
        <div className={styles.row}>
          <img className={styles.imageIcon} alt="" src="/image@2x.png" />
          <img className={styles.imageIcon} alt="" src="/image1@2x.png" />
          <img className={styles.imageIcon} alt="" src="/image2@2x.png" />
          <img className={styles.imageIcon} alt="" src="/image3@2x.png" />
          <img className={styles.imageIcon} alt="" src="/image4@2x.png" />
        </div>
        <div className={styles.row}>
          <img className={styles.imageIcon} alt="" src="/image5@2x.png" />
          <img className={styles.imageIcon} alt="" src="/image4@2x.png" />
          <img className={styles.imageIcon} alt="" src="/image6@2x.png" />
          <img className={styles.imageIcon} alt="" src="/image7@2x.png" />
          <img className={styles.imageIcon} alt="" src="/image@2x.png" />
        </div>
      </div>
    </div>
  );
};

export default ScoutingDetails;
