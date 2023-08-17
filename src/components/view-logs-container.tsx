import type { NextPage } from "next";
import HeadPart from "./head-part";
import MachineryManualCard from "./machinery-manual-card";
import styles from "./view-logs-container.module.css";
const ViewLogsContainer: NextPage = () => {
  return (
    <div className={styles.viewLogsContainer}>
      <HeadPart />
      <MachineryManualCard />
    </div>
  );
};

export default ViewLogsContainer;
