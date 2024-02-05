import type { NextPage } from "next";
import { Button, Icon } from "@mui/material";
import ProcurementDetails from "./procurement-details";
import styles from "./procurement-details.module.css";
import ProcurementCard from "../ProcurementCard";
import ProcurementDetailsCard from "./ProcurementCard";

const ProcurementDetailsMobile = ({ materials }: any) => {

  return (
    <div className={styles.yourprocurementdetails}>
      <div className={styles.headingcontainer}>
        <img
          className={styles.procurementiconred}
          alt=""
          src="/procurement-11.svg"
        />
        <div className={styles.headingandcount}>
          <div className={styles.heading}>{`Your Procurement `}</div>
          <div className={styles.countcontainer}>
            <p className={styles.count}>10</p>
          </div>
        </div>
      </div>
      {materials?.length ?

        <div className={styles.datatable}>
          <ul className={styles.listofitems}>
            {materials.map((item: any, index: any) => {
              return (
                <ProcurementDetailsCard item={item} />

              )
            })
            }


          </ul>
          <div className={styles.totalamount}>
            <h3 className={styles.total}>Total</h3>
            <p className={styles.amount}>₹4,04,796</p>
          </div>
        </div> : ""}
    </div>
  );
};

export default ProcurementDetailsMobile;
