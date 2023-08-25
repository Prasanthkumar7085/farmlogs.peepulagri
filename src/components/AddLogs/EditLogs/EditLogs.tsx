import type { NextPage } from "next";

import styles from "./../index.module.css";
import EditALog from "./EditALog";
import FarmDetailsMiniCard from "../farm-details-mini-card";
const FarmsEditLogs: NextPage = () => {
    return (
        <div className={styles.farmsaddLogs}>
            <EditALog />
            <FarmDetailsMiniCard />

        </div>
    );
};

export default FarmsEditLogs;
