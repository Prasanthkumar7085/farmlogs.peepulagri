import type { NextPage } from "next";
import styles from "./header.module.css";

const ScoutingHeader = ({ children }: any) => {
    return (
        <div className={styles.header} id="header">
            <div className={styles.navbar} id="navbar">
                <img className={styles.groupIcon} alt="logo" src="/group1.svg" />
                <img className={styles.menuIicon} alt="options" src="/menuiicon.svg" />
            </div>
            {children}
        </div>
    );
};

export default ScoutingHeader;
