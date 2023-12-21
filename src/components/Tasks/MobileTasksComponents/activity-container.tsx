import type { NextPage } from "next";
import styles from "./activity-container.module.css";

const ActivityContainer: NextPage = () => {
  return (
    <div className={styles.activitycontainer}>
      <label className={styles.activity}>Activity</label>
      <div className={styles.activitycard}>
        <div className={styles.activity1}>
          <div className={styles.profile}>
            <h1 className={styles.dh}>DH</h1>
          </div>
          <div className={styles.message}>
            <p className={styles.danielHamiltonUpdatedContainer}>
              <span className={styles.danielHamiltonUpdatedTaskS}>
                <span>
                  <span
                    className={styles.danielHamilton}
                  >{`Daniel Hamilton `}</span>
                  <span className={styles.updatedTaskStatus}>
                    Updated task status from
                  </span>
                  <span className={styles.span}>{` `}</span>
                </span>
                <span className={styles.done}>DONE</span>
                <span className={styles.to}>
                  <span className={styles.span}>{` `}</span>
                  <span className={styles.to1}>to</span>
                  <span className={styles.span}>{` `}</span>
                </span>
              </span>
              <span className={styles.toStart}>
                <span className={styles.toStart1}>TO-START</span>
              </span>
            </p>
          </div>
        </div>
        <div className={styles.timecontainer}>
          <p className={styles.pm}>14/12/2023 12:22 PM</p>
        </div>
      </div>
    </div>
  );
};

export default ActivityContainer;
