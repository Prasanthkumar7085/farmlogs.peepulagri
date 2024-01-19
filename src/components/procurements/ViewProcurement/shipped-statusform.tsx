import type { NextPage } from "next";
import { Avatar, Button, Chip, Tooltip, Typography } from "@mui/material";
import styles from "./shipped-statusform.module.css";
import timePipe from "@/pipes/timePipe";
import { useState } from "react";

// type ShippedStatusformType = {
//   fARM1?: string;
//   fertilizersAndSoilAmendme?: string;
//   text?: string;
//   hemaGanesh?: string;
//   text1?: string;
// };

const ShippedStatusform = ({ data }: any) => {

  const [showTooltip, setShowTooltip] = useState<any>(false);
  const [showMore, setShowMore] = useState<boolean>(false)

  const copyTextToClipboard = () => {
    navigator.clipboard.writeText(data?.tracking_details?.tracking_id)
      .then(() => {

        setShowTooltip(true);
        setTimeout(() => {
          setShowTooltip(false);
        }, 2000);
      })
      .catch(err => {
        console.error('Unable to copy text: ', err);
      });

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
                {timePipe(data?.date_of_operation, "DD, MMM YYYY")}
              </p>
            </div>
          </div>
        </div>
        <div className={styles.pointofcontact}>
          <label className={styles.PointOfContactTitle}>Farm Name</label>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {showMore == false ?
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                {data?.farm_ids.length < 10
                  ? data?.farm_ids
                    ?.map((item: any, index: any) => (
                      <Chip
                        size="small"
                        color="success"
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

                    ))
                }

              </div> :
              data?.farm_ids
                ?.map((item: any, index: any) => (
                  <Chip
                    size="small"
                    color="success"
                    key={index}
                    label={item.title}
                  />

                ))
            }

            <div
              style={{ display: data?.farm_ids.length >= 10 ? "block" : "none" }}>
              {showMore == true ? <Avatar
                onClick={() => setShowMore(false)}

                sx={{ width: 24, height: 24, fontSize: "12px" }}
              >-</Avatar> :
                <Avatar
                  onClick={() => setShowMore(true)}

                  sx={{ width: 24, height: 24, fontSize: "12px" }}
                >+{data?.farm_ids.length - 9}</Avatar>}
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
          <label className={styles.PointOfContactTitle}>Point Of Contact</label>
          <h3 className={styles.contactPersonName}>
            {data?.point_of_contact?.name ? data?.point_of_contact?.name : "----"}
          </h3>
        </div>
        {data?.tracking_details?.tracking_id ?
          <div className={styles.trackingid}>
            <Typography variant="h6" color="ThreeDLightShadow">Tracking Details</Typography>
            <label className={styles.label1}>Tracking ID</label>
            <div className={styles.information}>
              <div className={styles.id}>
                <p className={styles.text}>{data?.tracking_details?.tracking_id}</p>
              </div>

              {showTooltip ?
                <Tooltip title="Text copied!" >
                  <Button color="primary" variant="contained">
                    Copy
                  </Button>
                </Tooltip> :
                <Button color="primary" variant="contained" onClick={() => copyTextToClipboard()}>
                  Copy
                </Button>
              }
            </div>

          </div> : ""}
      </div>

    </div >
  );
};

export default ShippedStatusform;
