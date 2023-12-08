import type { NextPage } from "next";
import { useCallback, useState } from "react";
import { Button, Icon, Checkbox, FormControlLabel } from "@mui/material";
import styles from "./shipped-status.module.css";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import updateStatusService from "../../../../lib/services/ProcurementServices/updateStatusService";
import AlertStautsChange from "@/components/Core/StatusChangeDilog/alert-stauts-change";

const ShippedStatus = ({
  data,
  afterStatusChange
}: any) => {

  const router = useRouter();
  const [status, setStauts] = useState<any>()
  const [loading, setLoading] = useState<any>(false)
  const [dialogOpen, setDialogOpen] = useState(false);

  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );
  const userDetails = useSelector((state: any) => state.auth.userDetails);


  const onBackButton1Click = useCallback(() => {
    router.back();
    // Please sync "table" to the project
  }, []);

  //change the status
  const onStatusChangeEvent = async () => {
    console.log("oiuyhgf")
    setLoading(true)
    try {
      let changedStatus: any;
      // if (data?.status == "PENDING") {
      //   changedStatus = "APPROVED"
      // }
      // if (data?.status == "APPROVED") {
      //   changedStatus = "PURCHASED"
      // }
      // if (data?.status == "PURCHASED") {
      //   changedStatus = "SHIPPED"
      // }
      // if (data?.status == "SHIPPED") {
      //   changedStatus = "DELIVERED"
      // }
      // if (data?.status == "DELIVERED") {
      //   changedStatus = "COMPLETED"
      // }
      const response = await updateStatusService({
        procurement_id: data?._id,
        status: "APPROVED",
        accessToken,
      });
      if (response.success) {
        setDialogOpen(false)
        afterStatusChange(true)
      }
      console.log(response)
    }
    catch (err) {
      console.log(err)
    }
    finally {
      setLoading(false)
    }
  };

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
            onClick={() => setDialogOpen(true)}
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
      <AlertStautsChange open={dialogOpen} statusChange={onStatusChangeEvent} setDialogOpen={setDialogOpen} loading={loading} />

    </div>
  );
};

export default ShippedStatus;
