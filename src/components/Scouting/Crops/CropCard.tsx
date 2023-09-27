import type { NextPage } from "next";
import { memo, useCallback } from "react";
import styles from "./crop-card.module.css";
import MoreVertIcon from '@mui/icons-material/MoreVert';

const CropCard: NextPage = () => {

    return (
        <div id={styles.allCropCardBlock}>
            <div className={styles.cropcard} >
                <div className={styles.icons}>
                    <img className={styles.folderIcon} alt="" src="/folder.svg" />
                    <MoreVertIcon sx={{ color: "#FFB110", fontSize: "1rem" }} />
                </div>
                <div className={styles.textWrapper}>
                    <h2 className={styles.FieldCrop}>Red Chilli Field</h2>
                    <p className={styles.aug2023}>23, Aug 2023</p>
                </div>
            </div>
        </div>
    );
};

export default CropCard;
