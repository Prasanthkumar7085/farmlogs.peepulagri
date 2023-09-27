import type { NextPage } from "next";
import styles from "./head.module.css";
import { Typography } from "@mui/material";

const ViewHeader = ({ name }: any) => {
    return (
        <div className={styles.header} id="header">
            <img
                className={styles.iconsiconArrowLeft}
                alt=""
                src="/iconsiconarrowleft.svg"
            />
            <Typography className={styles.viewFarm}>{name}</Typography>
            <div className={styles.headericon} id="header-icon">
                <img className={styles.headericonChild} alt="" src="/frame-40561.svg" />

            </div>
        </div>
    );
};

export default ViewHeader;
