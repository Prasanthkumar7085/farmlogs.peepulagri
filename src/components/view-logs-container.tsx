import type { NextPage } from "next";
import HeadPart from "./AddLogs/head-part";
import MachineryManualCard from "./AddLogs/machinery-manual-card";
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
