import { Avatar, Button, Chip, Typography } from "@mui/material";
import styles from "./viewProcurementDetails.module.css";
import Image from "next/image";
import capitalizeFirstLetter from "@/pipes/capitalizeFirstLetter";
import { useSelector } from "react-redux";
import timePipe from "@/pipes/timePipe";
import { deepOrange } from "@mui/material/colors";
import { useState } from "react";
const ViewProucrementMobileDetails = ({
  data,
  materials,
  procurementStatusChange,
  getProcurementById,
}: any) => {
  const userDetails = useSelector(
    (state: any) => state.auth.userDetails?.user_details
  );
  const [showAllFarms, setShowAllFarms] = useState(false);

  const [viewMoreId, setViewMoreId] = useState("");

  const FarmTitleComponent = (info: any) => {
    let value = info?.farm_ids;
    let id = info?._id;

    if (!value || value.length === 0) {
      return <span>*No Farms*</span>;
    }

    const visibleTitles = showAllFarms ? value : value.slice(0, 2);
    const hiddenTitlesCount = value.length - visibleTitles.length;

    return (
      <span
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "1rem",
          color: value.length > 2 ? "" : "#9a9a9a",
        }}
      >
        {visibleTitles
          .map((item: { _id: string; title: string }) => item.title)
          .join(", ")}
        {value.length > 2 && (
          <div
            style={{
              color: "#9a9a9a",
            }}
            onClick={() => {
              setShowAllFarms((prev) => !prev);
              setViewMoreId((prev) => (prev === id ? "" : id));
            }}
          >
            <Avatar
              sx={{
                bgcolor: deepOrange[500],
                width: 24,
                height: 24,
                fontSize: "10px",
              }}
            >
              {hiddenTitlesCount == 0 ? "-" : "+" + hiddenTitlesCount}
            </Avatar>
          </div>
        )}
      </span>
    );
  };
  //to captlize the upercase text
  const capitalizeFirstLetter = (string: any) => {
    let temp = string?.toLowerCase();
    return temp?.charAt(0).toUpperCase() + temp?.slice(1);
  };
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
          {FarmTitleComponent(data)}
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
              className={styles.materialRecievedBtn}
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
              className={styles.materialRecievedBtn}
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
          <Typography className={styles.approvedBy}>Approved by</Typography>
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
