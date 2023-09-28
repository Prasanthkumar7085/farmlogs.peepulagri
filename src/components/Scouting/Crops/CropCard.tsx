import type { NextPage } from "next";
import { memo, useCallback, useState } from "react";
import styles from "./crop-card.module.css";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import timePipe from "@/pipes/timePipe";
import { useRouter } from "next/router";


const CropCard = ({ itemDetails }: any) => {
    const router = useRouter()

    return (
        <div id={styles.allCropCardBlock} onClick={() => router.push(`/farms/${router.query.farm_id}/crops/${itemDetails._id}`)} >
            <div className={styles.cropcard} >
                <div className={styles.icons}>
                    <img className={styles.folderIcon} alt="" src="/folder.svg" />
                    <MoreVertIcon sx={{ color: "#FFB110", fontSize: "1rem" }} />
                </div>
                <div className={styles.textWrapper}>
                    <h2 className={styles.FieldCrop}>{itemDetails.title}</h2>
                    <p className={styles.aug2023}>{timePipe(itemDetails.createdAt, "DD-MM-YYYY")}</p>
                </div>
            </div>
        </div>
    );
};

export default CropCard;
