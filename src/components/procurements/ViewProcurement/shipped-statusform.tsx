import type { NextPage } from "next";
import { Avatar, Button, ButtonBase, Chip, IconButton, Tooltip, Typography } from "@mui/material";
import styles from "./shipped-statusform.module.css";
import timePipe from "@/pipes/timePipe";
import { useState } from "react";
import TrackingDetailsDilog from "@/components/Core/TrackingDetails/TrackingDetailsDilog";
import updateStatusService from "../../../../lib/services/ProcurementServices/updateStatusService";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LoadingComponent from "@/components/Core/LoadingComponent";

// type ShippedStatusformType = {
//   fARM1?: string;
//   fertilizersAndSoilAmendme?: string;
//   text?: string;
//   hemaGanesh?: string;
//   text1?: string;
// };

const ShippedStatusform = ({ data, afterStatusChange }: any) => {
  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );

  const userDetails = useSelector(
    (state: any) => state.auth.userDetails?.user_details
  );

  const [showTooltip, setShowTooltip] = useState<any>(false);
  const [showMore, setShowMore] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [openTrackingDilog, setTrackingDialogOpen] = useState<any>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const copyTextToClipboard = () => {
    navigator.clipboard
      .writeText(data?.tracking_details?.tracking_id)
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

  const addTracking = (value: any) => {
    if (value == true) {
      setDialogOpen(true);
      if (data?.tracking_details?._id) {
        setDialogOpen(false);
        afterStatusChange(true);
      } else {
        onStatusChangeEvent();
      }
    }
  };

  const onStatusChangeEvent = async () => {
    setLoading(true);
    try {
      let changedStatus: any;
      if (data?.status == "PENDING") {
        changedStatus = "APPROVED";
      }
      if (data?.status == "APPROVED") {
        changedStatus = "PURCHASED";
      }
      if (data?.status == "PURCHASED") {
        changedStatus = "SHIPPED";
      }
      if (data?.status == "SHIPPED") {
        changedStatus = "DELIVERED";
      }
      if (data?.status == "DELIVERED") {
        changedStatus = "COMPLETED";
      }
      const response = await updateStatusService({
        procurement_id: data?._id,
        status: changedStatus,
        accessToken,
      });

      if (response.success) {
        setDialogOpen(false);
        afterStatusChange(true);
        toast.success(response?.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.shippedstatusform}>
      <div className={styles.procurementDetailsViewCard}>
        <div className={styles.nameofoperation}>
          <h3 className={styles.procurementTitle}>{data?.title}</h3>
          <div className={styles.procurementDate}>
            <div className={styles.procurementDateLabel}>Date Of Operation</div>
            <div className={styles.datecontainer}>
              <p className={styles.dateBlock}>
                {timePipe(data?.date_of_operation, "DD, MMM YYYY  hh:mm A")}
              </p>
            </div>
          </div>
        </div>
        <div className={styles.pointofcontact}>
          <label className={styles.PointOfContactTitle}>Farm Name</label>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {showMore == false ? (
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                {data?.farm_ids.length < 10
                  ? data?.farm_ids?.map((item: any, index: any) => (
                      <Chip
                        sx={{
                          color: "#000",
                          fontSize: "clamp(12px, 0.72vw, 14px)",
                          fontFamily: "'Inter', sans-serif",
                          background: "#CBFFE6",
                          padding: "2px 8px",
                          height: "inherit",
                          minWidth: "inherit",
                          "& .MuiChip-label": {
                            paddingInline: "0",
                          },
                        }}
                        key={index}
                        label={item.title}
                      />
                    ))
                  : data?.farm_ids
                      .slice(0, 9)
                      ?.map((item: any, index: any) => (
                        <Chip
                          size="small"
                          color="success"
                          key={index}
                          label={item.title}
                        />
                      ))}
              </div>
            ) : (
              data?.farm_ids?.map((item: any, index: any) => (
                <Chip
                  size="small"
                  color="success"
                  key={index}
                  label={item.title}
                />
              ))
            )}

            <div
              style={{
                display: data?.farm_ids.length >= 10 ? "block" : "none",
              }}
            >
              {showMore == true ? (
                <Avatar
                  onClick={() => setShowMore(false)}
                  sx={{ width: 24, height: 24, fontSize: "12px" }}
                >
                  -
                </Avatar>
              ) : (
                <Avatar
                  onClick={() => setShowMore(true)}
                  sx={{ width: 24, height: 24, fontSize: "12px" }}
                >
                  +{data?.farm_ids.length - 9}
                </Avatar>
              )}
            </div>
          </div>
        </div>
        {/* <Tooltip
          title={data?.farm_ids
            ?.map((item: any, index: any) => item.title)
            .join(",")}
        >
          <div className={styles.farmname}>
            {data?.farm_ids.length < 3
              ? data?.farm_ids
                ?.map((item: any, index: any) => item.title)
                .join(",")
              : data?.farm_ids
                .slice(0, 2)
                ?.map((item: any, index: any) => item.title)
                .join(",") + "....."}
          </div>
        </Tooltip> */}
        <div className={styles.pointofcontact}>
          <label className={styles.PointOfContactTitle}>
            Person Of Contact
          </label>
          <h3 className={styles.contactPersonName}>
            {data?.point_of_contact?.name
              ? data?.point_of_contact?.name
              : "----"}
          </h3>
        </div>
        {data?.tracking_details?.tracking_id ? (
          <div className={styles.trackingid}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" className={styles.trackingBlockHeading}>
                Tracking Details
              </Typography>

              {data?.tracking_details?._id &&
              userDetails?.user_type == "central_team" &&
              data?.status !== "DELIVERED" &&
              data?.status !== "COMPLETED" ? (
                <div className={styles.trackingid}>
                  <Button
                    className={styles.addTrackingDetailsBtn}
                    variant="text"
                    onClick={() => {
                      setTrackingDialogOpen(true);
                    }}
                  >
                    + Edit Tracking Details
                  </Button>
                </div>
              ) : (
                ""
              )}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "3rem",
              }}
            >
              <div className={styles.information}>
                <label className={styles.label1}>Service Name</label>

                <Typography variant="body2">
                  {data?.tracking_details?.service_name}
                </Typography>
              </div>

              <div className={styles.information}>
                <label className={styles.label1}>Contact Number</label>

                <Typography variant="body2">
                  {data?.tracking_details?.contact_number}
                </Typography>
              </div>

              <div className={styles.information}>
                <label className={styles.label1}>Delivery Date</label>

                <Typography variant="body2">
                  {timePipe(
                    data?.tracking_details?.delivery_date,
                    "DD MMM YYYY hh:mm A"
                  )}
                </Typography>
              </div>

              <div className={styles.information}>
                <label className={styles.label1}>Tracking Id</label>

                <Typography
                  sx={{ display: "flex", alignItems: "center" }}
                  variant="body2"
                >
                  {data?.tracking_details?.tracking_id}
                  {showTooltip ? (
                    <Tooltip title="Text copied!">
                      <IconButton>
                        <ContentCopyIcon sx={{ fontSize: "1.2rem" }} />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <IconButton onClick={() => copyTextToClipboard()}>
                      <ContentCopyIcon sx={{ fontSize: "1.2rem" }} />
                    </IconButton>
                  )}
                </Typography>
              </div>
            </div>
            {/* <div className={styles.id}>
                jn
              </div> */}
          </div>
        ) : (
          ""
        )}
        {data?.status == "PURCHASED" &&
        userDetails?.user_type == "central_team" &&
        !data?.tracking_details?.service_name ? (
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
      </div>
      <TrackingDetailsDilog
        open={openTrackingDilog}
        addTracking={addTracking}
        setTrackingDialogOpen={setTrackingDialogOpen}
        loading={false}
      />
      <LoadingComponent loading={loading} />
    </div>
  );
};

export default ShippedStatusform;
