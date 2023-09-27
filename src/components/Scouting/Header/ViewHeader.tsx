import type { NextPage } from "next";
import styles from "./head.module.css";
import { Typography } from "@mui/material";
import { useRouter } from "next/router";

const ViewHeader = ({ name }: any) => {

    const router = useRouter();
    
    return (
        <div className={styles.header} id="header">
            <img
                className={styles.iconsiconArrowLeft}
                alt=""
                src="/iconsiconarrowleft.svg"
                onClick={() => router.back()}
                style={{cursor:"pointer"}}
            />
            <Typography className={styles.viewFarm}>{name}</Typography>
            <div className={styles.headericon} id="header-icon">
                <img className={styles.headericonChild} alt="" src="/frame-40561.svg" />
            </div>
        </div>
    );
};

export default ViewHeader;
