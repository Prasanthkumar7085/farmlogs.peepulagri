import type { NextPage } from "next";
import AddALog from "./add-a-log";
import FarmDetailsMiniCard from "./farm-details-mini-card";
import styles from "./index.module.css";
const FarmsaddLogs: NextPage = () => {
  return (
    <div className={styles.farmsaddLogs}>
      <AddALog />
      <FarmDetailsMiniCard />

    </div>
  );
};

export default FarmsaddLogs;
