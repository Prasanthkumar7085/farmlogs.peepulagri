import type { NextPage } from "next";
import styles from "./head.module.css";
import { Typography } from "@mui/material";

const Header1 = ({ name }: any) => {
    return (
        <div className={styles.header} id="header">
            <img
                className={styles.iconsiconArrowLeft}
                alt=""
                src="/iconsiconarrowleft.svg"
            />
            <Typography className={styles.viewFarm}>{name}</Typography>
            <div className={styles.headericon} id="header-icon">
            </div>
        </div>
    );
};

export default Header1;
