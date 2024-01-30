import AlertStautsChange from "@/components/Core/StatusChangeDilog/alert-stauts-change";
import { Button, Checkbox, FormControlLabel } from "@mui/material";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import updateStatusService from "../../../../lib/services/ProcurementServices/updateStatusService";
import styles from "./shipped-status.module.css";
import TrackingDetailsDilog from "@/components/Core/TrackingDetails/TrackingDetailsDilog";
import { toast } from "sonner";

const ShippedStatus = ({ data, afterStatusChange }: any) => {
  const router = useRouter();
  const [status, setStauts] = useState<any>();
  const [loading, setLoading] = useState<any>(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [openTrackingDilog, setTrackingDialogOpen] = useState<any>(false)

  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );

  const userDetails = useSelector(
    (state: any) => state.auth.userDetails?.user_details
  );

  const onBackButton1Click = useCallback(() => {
    router.back();
    // Please sync "table" to the project
  }, []);

  //change the status
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
        afterStatusChange(true)
        toast.success(response?.message)


      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }

  };



  const onMaterialsReceivedCheckboxClick = () => {
    onStatusChangeEvent()
  }


  //to captlize the upercase text
  const capitalizeFirstLetter = (string: any) => {
    let temp = string.toLowerCase();
    return temp.charAt(0).toUpperCase() + temp.slice(1);
  };

  return (
    <div className={styles.shippedstatus}>
      <Button
        className={styles.backbutton}
        sx={{ width: 40 }}
        color="primary"
        variant="contained"
        onClick={onBackButton1Click}
      >
        <img src="/arrow-left-back-white-black.svg" alt="" width={"16px"} />
      </Button>
      <div className={styles.statusrow}>
        <div className={styles.priority}>
          <label className={styles.label}>Priority</label>
          <div className={styles.prioritycontainer}>
            <p className={styles.priorityBtn}>
              {data?.priority ? capitalizeFirstLetter(data?.priority) : "---"}
            </p>
          </div>
        </div>
        <div className={styles.priority}>
          <label className={styles.label}>Status</label>
          {userDetails?.user_type == "manager" || userDetails?.user_type == "central_team" ?
            <div
              className={styles.statuscontainer}
              onClick={() => {
                if (data?.status == "PURCHASED") {
                  setTrackingDialogOpen(true);
                } else {
                  setDialogOpen(true)
                }
              }}
            >
              <p className={styles.statusBtn}>
                {data?.status ? capitalizeFirstLetter(data?.status) : "---"}
              </p>
            </div> :
            <div
              className={styles.statuscontainer}>
              <p className={styles.statusBtn} style={{ background: "#a05148 !important" }}>{data?.status ? capitalizeFirstLetter(data?.status) : "---"}</p>
            </div>}

        </div>
        <img className={styles.statusrowChild} alt="" src="/line-3@2x.png" />
        {data?.status == "SHIPPED" && userDetails?._id == data.requested_by?._id ? (
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
          </div>
        ) : (
          ""
        )}
      </div>
      {data?.status == "DELIVERED" ?
        <AlertStautsChange
          open={dialogOpen}
          statusChange={onStatusChangeEvent}
          setDialogOpen={setDialogOpen}
          loading={loading}
        /> : ""}


    </div>
  );
};

export default ShippedStatus;
