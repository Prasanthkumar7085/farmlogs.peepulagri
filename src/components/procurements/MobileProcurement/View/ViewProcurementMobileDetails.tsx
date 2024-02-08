import { Button, Chip, Typography } from "@mui/material";
import styles from "./viewProcurementDetails.module.css";
import Image from "next/image";
import capitalizeFirstLetter from "@/pipes/capitalizeFirstLetter";
import { useSelector } from "react-redux";
import timePipe from "@/pipes/timePipe";
const ViewProucrementMobileDetails = ({
  data,
  materials,
  procurementStatusChange,
  getProcurementById,
}: any) => {
  const userDetails = useSelector(
    (state: any) => state.auth.userDetails?.user_details
  );

  return (
    <div>
      <div className={styles.procurementTitleBlock}>
        <Typography className={styles.procurementtitle}>
          {data?.title}
        </Typography>
        <p className={styles.priority}>{data?.priority}</p>
      </div>
      <div className={styles.procurementFarmBlock}>
        <Image src="/Outline.svg" width={16} height={16} alt="icon" />
        <Typography className={styles.procurementtitle}>
          {data?.farm_ids[0]?.title}
        </Typography>
      </div>
      <div className={styles.procurementClosingDateBlock}>
        <Image
          src="/mobileIcons/Calender_Red.svg"
          width={16}
          height={16}
          alt="icon"
        />

        <div className={styles.dateBlock}>
          <Typography className={styles.dateOfClosing}>
            Date of Closing
          </Typography>
          {data?.status == "SHIPPED" &&
          userDetails?._id == data.requested_by?._id ? (
            <Button
              variant="contained"
              onClick={async () => {
                await procurementStatusChange("DELIVERED");
                await getProcurementById();
              }}
            >
              Material Received
            </Button>
          ) : data?.status == "DELIVERED" &&
            userDetails?.user_type == "central_team" ? (
            <Button
              variant="contained"
              onClick={async () => {
                await procurementStatusChange("COMPLETED");
                await getProcurementById();
              }}
            >
              Completed
            </Button>
          ) : (
            <Typography>
              {data?.status == "COMPLETED"
                ? timePipe(data?.updatedAt, "DD-MM-YYYY hh:mm A")
                : "------"}
            </Typography>
          )}
        </div>
      </div>
      <div className={styles.approvedByBlock}>
        <Image
          src="/mobileIcons/procurement/approve-icon.svg"
          width={16}
          height={16}
          alt="icon"
        />

        <div style={{ display: "flex", flexDirection: "column" }}>
          <Typography className={styles.dateOfClosing}>Approved by</Typography>
          <Typography>
            {materials[0]?.approved_by?.name
              ? materials[0]?.approved_by?.name
              : "---"}
          </Typography>
        </div>
      </div>
    </div>
  );
};
export default ViewProucrementMobileDetails;
