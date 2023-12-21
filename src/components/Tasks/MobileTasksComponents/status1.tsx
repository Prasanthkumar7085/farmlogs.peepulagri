import type { NextPage } from "next";
import styles from "./status1.module.css";

const Status1 = ({ onClose }: any) => {
  return (
    <div className={styles.status}>
      <div className={styles.component11Parent}>
        <div className={styles.component11}>
          <div className={styles.moveTo}>Move to</div>
        </div>
        <div className={styles.component12}>
          <div className={styles.moveTo}>To start</div>
        </div>
        <div className={styles.component12}>
          <div className={styles.moveTo}>In-Progress</div>
        </div>
        <div className={styles.component12}>
          <div className={styles.moveTo}>Pending</div>
        </div>
        <div className={styles.component113}>
          <div className={styles.moveTo}>Done</div>
        </div>
      </div>
    </div>
  );
};

export default Status1;
