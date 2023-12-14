import type { NextPage } from "next";
import { Button, Tooltip } from "@mui/material";
import styles from "./shipped-statusform.module.css";
import timePipe from "@/pipes/timePipe";

// type ShippedStatusformType = {
//   fARM1?: string;
//   fertilizersAndSoilAmendme?: string;
//   text?: string;
//   hemaGanesh?: string;
//   text1?: string;
// };

const ShippedStatusform = ({
  data
}: any) => {
  console.log(data);

  return (
    <div className={styles.shippedstatusform}>
      <Tooltip title={data?.farm_ids?.map((item: any, index: any) => item.title).join(",")} >
        <div className={styles.farmname}>

          {data?.farm_ids.length < 3 ? data?.farm_ids?.map((item: any, index: any) => item.title).join(",") : data?.farm_ids.slice(0, 2)?.map((item: any, index: any) => item.title).join(",") + "....."}
        </div>
      </Tooltip>
      <div className={styles.nameofoperation}>
        <h3 className={styles.fertilizersAndSoil}>
          {data?.title}
        </h3>
        <div className={styles.inputWithLabel}>
          <div className={styles.label}>Date Of Operation</div>
          <div className={styles.datecontainer}>
            <p className={styles.text}>{timePipe(data?.date_of_operation, "DD-MM-YYYY")}</p>
          </div>
        </div>
      </div>
      <div className={styles.pointofcontact}>
        <label className={styles.label1}>Point Of Contact</label>
        <h3 className={styles.hemaGanesh}>{data?.point_of_contact?.name ? data?.point_of_contact?.name : "----"}</h3>
      </div>
      <div className={styles.trackingid}>
        <label className={styles.label1}>Tracking ID</label>
        <div className={styles.information}>
          <div className={styles.id}>
            <p className={styles.text}>{"1234567890p"}</p>
          </div>
          <Button color="primary" variant="contained">
            Copy
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShippedStatusform;
