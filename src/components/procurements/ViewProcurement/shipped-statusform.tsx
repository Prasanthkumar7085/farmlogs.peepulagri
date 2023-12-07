import type { NextPage } from "next";
import { Button } from "@mui/material";
import styles from "./shipped-statusform.module.css";

type ShippedStatusformType = {
  fARM1?: string;
  fertilizersAndSoilAmendme?: string;
  text?: string;
  hemaGanesh?: string;
  text1?: string;
};

const ShippedStatusform: NextPage<ShippedStatusformType> = ({
  fARM1 = "Farm-1",
  fertilizersAndSoilAmendme = "Fertilizers and amendments",
  text = "05, Aug 2023",
  hemaGanesh = "Hema & Ganesh",
  text1 = "1Z 999 AA1 01 2345 6784",
}) => {
  return (
    <div className={styles.shippedstatusform}>
      <div className={styles.farmname}>
        <p className={styles.farm1}>{fARM1}</p>
      </div>
      <div className={styles.nameofoperation}>
        <h3 className={styles.fertilizersAndSoil}>
          {fertilizersAndSoilAmendme}
        </h3>
        <div className={styles.inputWithLabel}>
          <div className={styles.label}>Date Of Operation</div>
          <div className={styles.datecontainer}>
            <p className={styles.text}>{text}</p>
          </div>
        </div>
      </div>
      <div className={styles.pointofcontact}>
        <label className={styles.label1}>Point Of Contact</label>
        <h3 className={styles.hemaGanesh}>{hemaGanesh}</h3>
      </div>
      <div className={styles.trackingid}>
        <label className={styles.label1}>Tracking ID</label>
        <div className={styles.information}>
          <div className={styles.id}>
            <p className={styles.text}>{text1}</p>
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
