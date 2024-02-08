import type { NextPage } from "next";
import { Button, IconButton, Typography } from "@mui/material";
import styles from "./trackingDetails.module.css";
import { useSelector } from "react-redux";
import { useState } from "react";
import TrackingDetailsDilog from "@/components/Core/TrackingDetails/TrackingDetailsDilog";
import AddTrackingDetailsMobile from "@/components/Core/TrackingDetails/AddTrackingDetailsMobile";
import Image from "next/image";
import timePipe from "@/pipes/timePipe";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const TrackingDetails = ({
  procurementData,
  materials,
  procurementStatusChange,
  getAllProcurementMaterials,
}: any) => {
  const userDetails = useSelector(
    (state: any) => state.auth.userDetails?.user_details
  );
  const [openTrackingDilog, setTrackingDialogOpen] = useState<any>(false);
  const [showTooltip, setShowTooltip] = useState<any>(false);

  const copyTextToClipboard = () => {
    navigator.clipboard
      .writeText(procurementData?.tracking_details?.tracking_id)
      .then(() => {
        setShowTooltip(true);
        setTimeout(() => {
          setShowTooltip(false);
        }, 2000);
      })
      .catch((err) => {
        console.error("Unable to copy text: ", err);
      });
  };

  return (
    <div className={styles.trackingdetails}>
      <div className={styles.titletracking}>
        <Image
          alt=""
          src="/mobileIcons/procurement/tracking-icon.svg"
          height={20}
          width={20}
        />
        <h2 className={styles.title}>Tracking Details</h2>
      </div>

      <div className={styles.detailscontainer}>
        {procurementData?.status == "PURCHASED" &&
        userDetails?.user_type == "central_team" &&
        !procurementData?.tracking_details?.service_name ? (
          <div className={styles.trackingid}>
            <Typography variant="h6" className={styles.trackingBlockHeading}>
              Tracking Details
            </Typography>
            <Button
              className={styles.addTrackingDetailsBtn}
              variant="text"
              onClick={() => {
                setTrackingDialogOpen(true);
              }}
            >
              + Add Tracking Details
            </Button>
          </div>
        ) : (
          ""
        )}

        {procurementData?.tracking_details?.tracking_id ? (
          <div>
            <label className={styles.lablesmall}>Service Name</label>
            <p className={styles.details}>
              {procurementData?.tracking_details?.service_name}
            </p>
            <div></div>
            <label className={styles.lablesmall}>Contact Number</label>
            <p className={styles.details}>
              {procurementData?.tracking_details?.contact_number}
            </p>
            <label className={styles.lablesmall}>Delivery Date</label>
            <p className={styles.details}>
              {timePipe(
                procurementData?.tracking_details?.delivery_date,
                "DD-MM-YYYY"
              )}
            </p>
            <label className={styles.lablesmall}>Tracking Id</label>
            <p className={styles.details}>
              {procurementData?.tracking_details?.tracking_id}{" "}
              <IconButton onClick={() => copyTextToClipboard()}>
                <ContentCopyIcon sx={{ fontSize: "1.2rem" }} />
              </IconButton>
            </p>
          </div>
        ) : (
          "---"
        )}
      </div>

      <AddTrackingDetailsMobile
        open={openTrackingDilog}
        addTracking={""}
        procurementStatusChange={procurementStatusChange}
        setTrackingDialogOpen={setTrackingDialogOpen}
        loading={false}
        getAllProcurementMaterials={getAllProcurementMaterials}
      />
    </div>
  );
};

export default TrackingDetails;
