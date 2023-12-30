import type { NextPage } from "next";
import { Button, Tooltip, Typography } from "@mui/material";
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

  const copyTextToClipboard = () => {
    navigator.clipboard.writeText(data?.tracking_details?.tracking_id)
      .then(() => {
        console.log("Text copied")
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
      <Tooltip
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
      </Tooltip>
      <div className={styles.nameofoperation}>
        <h3 className={styles.fertilizersAndSoil}>{data?.title}</h3>
        <div className={styles.inputWithLabel}>
          <div className={styles.label}>Date Of Operation</div>
          <div className={styles.datecontainer}>
            <p className={styles.text}>
              {timePipe(data?.date_of_operation, "DD-MM-YYYY")}
            </p>
          </div>
        </div>
      </div>
      <div className={styles.pointofcontact}>
        <label className={styles.label1}>Point Of Contact</label>
        <h3 className={styles.hemaGanesh}>
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
  );
};

export default ShippedStatusform;
