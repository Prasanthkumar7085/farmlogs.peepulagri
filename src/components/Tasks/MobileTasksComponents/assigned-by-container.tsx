import type { NextPage } from "next";
import styles from "./assigned-by-container.module.css";

const AssignedByContainer: NextPage = () => {
  return (
    <div className={styles.assignedbycontainer}>
      <label className={styles.assignedBy}>Assigned by</label>
      <div className={styles.persondetails}>
        <div className={styles.profile}>
          <h1 className={styles.jd}>JD</h1>
        </div>
        <p className={styles.johnDukes}>John Dukes</p>
      </div>
    </div>
  );
};

export default AssignedByContainer;
