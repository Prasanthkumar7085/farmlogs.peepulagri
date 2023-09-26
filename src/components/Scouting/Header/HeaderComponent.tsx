import type { NextPage } from "next";
import styles from "./head.module.css";

const Header1 = ({ name }: any) => {
    return (
        <div className={styles.header} id="header">
            <img
                className={styles.iconsiconArrowLeft}
                alt=""
                src="/iconsiconarrowleft.svg"
            />
            <div className={styles.headertitle} id="header-title">
                <div className={styles.viewFarm}>{name}</div>
            </div>
            <div className={styles.headericon} id="header-icon">
                <img className={styles.headericonChild} alt="" src="/frame-40561.svg" />
            </div>
        </div>
    );
};

export default Header1;
