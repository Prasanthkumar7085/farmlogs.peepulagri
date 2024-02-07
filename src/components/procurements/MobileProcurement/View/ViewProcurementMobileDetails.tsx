import { Chip, Typography } from "@mui/material";
import styles from "./viewProcurementDetails.module.css";
import Image from "next/image";
const ViewProucrementMobileDetails = ({ data }: any) => {
    return (
        <div >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography className={styles.procurementtitle}>{data?.title}</Typography>
                <p className={styles.priority}>{data?.priority}</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", marginTop: "6px" }}>
                <Image src="/Outline.svg" width={16} height={16} alt="icon" />
                <Typography className={styles.procurementtitle}>{data?.farm_ids[0]?.title}</Typography>
            </div>
            <div style={{ display: "flex", alignItems: "center", marginTop: "10%", gap: "0.5rem" }} >
                <Image src="/Outline.svg" width={16} height={16} alt="icon" />

                <div style={{ display: "flex", flexDirection: "column" }}>
                    <Typography className={styles.dateOfClosing}>Date of Closing</Typography>
                    <Typography >22-01-2024</Typography>

                </div>

            </div>
            <div style={{ display: "flex", alignItems: "center", marginTop: "10%", gap: "0.5rem" }} >
                <Image src="/Outline.svg" width={16} height={16} alt="icon" />

                <div style={{ display: "flex", flexDirection: "column" }}>
                    <Typography className={styles.dateOfClosing}>Approved by</Typography>
                    <Typography >-----</Typography>

                </div>

            </div>
        </div >
    )
}
export default ViewProucrementMobileDetails;