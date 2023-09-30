import styles from "./head.module.css";
import { Typography } from "@mui/material";
import { useRouter } from "next/router";

const HeaderComponentAllCrops = ({ name }: any) => {

    const router = useRouter();

    return (
        <div className={styles.header} id="header" style={{ paddingTop: "6rem" }}>
            <img
                className={styles.iconsiconArrowLeft}
                alt=""
                src="/iconsiconarrowleft.svg"
                onClick={() => router.push('/farms')}
                // onClick={() => router.back()}

            />
            <Typography className={styles.viewFarm}>{name}</Typography>
            <div className={styles.headericon} id="header-icon">
            </div>
        </div>
    );
};

export default HeaderComponentAllCrops;
