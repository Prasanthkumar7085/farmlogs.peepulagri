import type { NextPage } from "next";
import styles from "./navbar.module.css";
import ImageComponent from "@/components/Core/ImageComponent";

const ScoutingHeader = ({ children }: any) => {
    return (
        <div id="mobileBody">
            <div className={styles.navbar} id="navbar">
                <ImageComponent src="/Logo-color.svg" width="70" height="60" />
                <img className={styles.menuIicon} alt="options" src="/menuiicon.svg" />
            </div>
            {children}
        </div>
    );
};

export default ScoutingHeader;
