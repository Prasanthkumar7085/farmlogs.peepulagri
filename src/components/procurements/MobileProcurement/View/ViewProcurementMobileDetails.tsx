import { Chip, Typography } from "@mui/material";
import styles from "./viewProcurementDetails.module.css";
import Image from "next/image";
const ViewProucrementMobileDetails = ({ data, materials }: any) => { //to captlize the upercase text
    const capitalizeFirstLetter = (string: any) => {
        let temp = string.toLowerCase();
        return temp.charAt(0).toUpperCase() + temp.slice(1);
    };

    return (
        <div >
            <div className={styles.procurementTitleBlock} >
                <Typography className={styles.procurementtitle}>{data?.title}</Typography>
                <p className={styles.priority}>{capitalizeFirstLetter(data?.priority)}</p>
            </div>
            <div className={styles.procurementFarmBlock} >
                <Image src="/Outline.svg" width={16} height={16} alt="icon" />
                <Typography className={styles.procurementtitle}>{data?.farm_ids[0]?.title}</Typography>
            </div>
            <div className={styles.procurementClosingDateBlock} >
                <Image src="/mobileIcons/Calender_Red.svg" width={16} height={16} alt="icon" />

                <div className={styles.dateBlock}>
                    <Typography className={styles.dateOfClosing}>Date of Closing</Typography>
                    <Typography >{"------"}</Typography>

                </div>

            </div>
            <div className={styles.approvedByBlock}  >
                <Image src="/mobileIcons/procurement/approve-icon.svg" width={16} height={16} alt="icon" />

                <div style={{ display: "flex", flexDirection: "column" }}>
                    <Typography className={styles.dateOfClosing}>Approved by</Typography>
                    <Typography >{materials[0]?.approved_by?.name ? materials[0]?.approved_by?.name : "---"}</Typography>

                </div>

            </div>
        </div >
    )
}
export default ViewProucrementMobileDetails;