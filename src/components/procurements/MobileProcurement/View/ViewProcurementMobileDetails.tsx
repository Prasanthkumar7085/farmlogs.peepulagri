import { Chip, Typography } from "@mui/material";
import styles from "./viewProcurementDetails.module.css";
import Image from "next/image";
const ViewProucrementMobileDetails = ({ data, materials }: any) => {
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
                    <Typography >{"------"}</Typography>

                </div>

            </div>
            <div style={{ display: "flex", alignItems: "center", marginTop: "10%", gap: "0.5rem" }} >
                <Image src="/Outline.svg" width={16} height={16} alt="icon" />

                <div style={{ display: "flex", flexDirection: "column" }}>
                    <Typography className={styles.dateOfClosing}>Approved by</Typography>
                    <Typography >{materials[0]?.approved_by?.name ? materials[0]?.approved_by?.name : "---"}</Typography>

                </div>

            </div>
        </div >
    )
}
export default ViewProucrementMobileDetails;