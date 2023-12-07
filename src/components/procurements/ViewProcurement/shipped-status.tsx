import type { NextPage } from "next";
import { useCallback } from "react";
import { Button, Icon, Checkbox, FormControlLabel } from "@mui/material";
import styles from "./shipped-status.module.css";
import { useRouter } from "next/router";

const ShippedStatus = ({
  data,
}: any) => {
  const router = useRouter();
  const onBackButton1Click = useCallback(() => {
    router.back();
    // Please sync "table" to the project
  }, []);

  const onStatusContainerClick = useCallback(() => {
    // Please sync "Procurement Module/View/Delivered" to the project
  }, []);

  const onMaterialsReceivedCheckboxClick = useCallback(() => {
    // Please sync "Procurement Module/View/Delivered" to the project
  }, []);

  return (
    <div className={styles.shippedstatus}>
      <Button
        className={styles.backbutton}
        sx={{ width: 40 }}
        color="primary"
        variant="contained"
        onClick={onBackButton1Click}
      >
        <img src="/arrow-left-back-white.svg" alt="" width={"18px"} />
      </Button>
      <div className={styles.statusrow}>
        <div className={styles.priority}>
          <label className={styles.label}>Priority</label>
          <div className={styles.prioritycontainer}>
            <p className={styles.text}>{data?.priority ? data?.priority : "---"}</p>
          </div>
        </div>
        <div className={styles.priority}>
          <label className={styles.label}>Status</label>
          <div
            className={styles.statuscontainer}
            onClick={onStatusContainerClick}
          >
            <p className={styles.text}>{data?.status ? data?.status : "---"}</p>
          </div>
        </div>
        <img className={styles.statusrowChild} alt="" src="/line-3@2x.png" />
        {data?.status == "shipped" ?
          <div
            className={styles.materialsreceivedcheckbox}
            onClick={onMaterialsReceivedCheckboxClick}
          >
            <FormControlLabel
              className={styles.unselected}
              label=""
              control={<Checkbox color="primary" />}
            />
            <p className={styles.materialsReceived}>Materials Received</p>
          </div> : ""}
      </div>
    </div>
  );
};

export default ShippedStatus;
