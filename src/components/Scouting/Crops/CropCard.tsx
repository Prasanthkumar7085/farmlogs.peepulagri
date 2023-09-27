import type { NextPage } from "next";
import { memo, useCallback } from "react";
import styles from "./crop-card.module.css";

const CropCard: NextPage = memo(() => {
    const onCropCardClick = useCallback(() => {
        // Please sync "Scouting" to the project
    }, []);

    return (
        <div className={styles.cropcard} onClick={onCropCardClick}>
            <div className={styles.icons}>
                <img className={styles.folderIcon} alt="" src="/folder.svg" />
                <img className={styles.threedotsIcon} alt="" src="/threedots@2x.png" />
            </div>
            <div className={styles.textWrapper}>
                <h2 className={styles.redChilliField}>Red Chilli Field</h2>
                <p className={styles.aug2023}>23, Aug 2023</p>
            </div>
        </div>
    );
});

export default CropCard;
