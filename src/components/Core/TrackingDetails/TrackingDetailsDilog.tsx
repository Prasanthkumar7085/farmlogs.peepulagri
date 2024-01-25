import { Button, CircularProgress, Dialog, Drawer, IconButton, TextField } from "@mui/material";
import styles from "./tracking-details.module.css"
import { useForm } from "react-hook-form";
import { useState } from "react";
import ErrorMessages from "../ErrorMessages";
import { DatePicker, Stack } from 'rsuite';
import "rsuite/dist/rsuite.css";
import isBefore from 'date-fns/isBefore';
import { v4 as uuidv4 } from 'uuid';
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { Clear } from "@mui/icons-material";


interface pagePropsType {
  open: boolean;
  addTracking: any;
  setTrackingDialogOpen: (newValue: boolean) => void;
  loading: boolean;
}
const TrackingDetailsDilog = ({
  open,
  addTracking,
  setTrackingDialogOpen,
  loading,
}: pagePropsType) => {

  const router = useRouter()

  const [errorMessages, setErrorMessages] = useState<any>([])
  const [phoneNumber, setPhoneNumber] = useState<any>()
  const [date, setDate] = useState<any>()
  const [service_name, setServiceName] = useState<any>()
  const [trackingId, setTrackingId] = useState<any>()
  const [trackingLoading, setTrackingLoading] = useState<any>(false)

  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  //event call after the form submit
  const onSubmitClick = async (data: any) => {
    setErrorMessages({});

  };

  //only allow the number and (mobile number validation)
  const handleInput = (event: any) => {
    const value = event.target.value.replace(/\D/g, '');
    event.target.value = value.slice(0, 10);
  };


  const Datestyles = { width: "100%", display: 'block', marginBottom: 10, zIndex: 1500 };

  //function to generate the uuid randomly
  const generateUUID = () => {
    const newUUID = uuidv4(); // Generate UUID
    setTrackingId(newUUID); // Update state with the generated UUID
  };

  //add tracking details eveent
  const addTrackingDetails = async () => {

    setTrackingLoading(true)
    let body = {
      "service_name": service_name,
      "delivery_date": date,
      "contact_number": phoneNumber,
      "tracking_id": trackingId
    }
    try {
      let options = {
        method: "POST",
        headers: new Headers({
          "content-type": "application/json",
          authorization: accessToken,
        }),
        body: JSON.stringify(body),
      };

      let response: any = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/procurement-requests/${router.query.procurement_id}/tracking-details`,
        options
      );
      let responseData = await response.json();
      if (responseData.success) {
        toast.success(responseData?.message)
        setTrackingDialogOpen(false)
        addTracking(true)
      }
      if (responseData.status == 422) {
        setErrorMessages(responseData?.errors)
      }

    }
    catch (err) {
      console.error(err)
    }
    finally {
      setTrackingLoading(false)

    }
  }

  return (
    <Drawer
      open={open}
      anchor={"right"}

    >
      <div className={styles.addTrackingDetailsDrawer}>
        <div className={styles.drawerHeader}>
          <h6 className={styles.drawerHeading}>Add Tracking Details</h6>
          <IconButton
            onClick={() => {
              setTrackingDialogOpen(false)
            }}
          >
            <Clear sx={{ color: "#000", fontSize: "1.5rem", fontWeight: "200" }} />
          </IconButton>
        </div>
        <div className={styles.eachFormField}>

          <p className={styles.label}>Service Name</p>
          <TextField
            sx={{
              "& .MuiInputBase-root": {
                background: "#fff",
              },
              "& .MuiInputBase-input": {
                padding: "8px 14px",
                height: "inherit",
                fontFamily: "'Inter', sans-serif",
                fontSize: "clamp(12px, 0.72vw, 14px)",
                borderRadius: "8px !important"

              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#D0D5DD !important",
                borderWidth: "1px !important",
                borderRadius: "8px !important"
              },
            }}
            value={service_name}
            onChange={(e) => setServiceName(e.target.value)}
            name="service_name"
            fullWidth
            size="small"
            placeholder="Service Name"
            variant="outlined"
            error={Boolean(errorMessages?.["service_name"])}
            helperText={
              errorMessages?.["service_name"]
                ? errorMessages?.["service_name"]
                : ""
            }
          />
        </div>
        <div className={styles.eachFormField} id="tracking-details-datePicker">
          <p className={styles.label}>Delivery Date</p>
          <DatePicker
            editable={false}
            size="lg"
            style={Datestyles}
            placeholder="DD-MM-YYYY"
            value={date}
            onChange={setDate}
            shouldDisableDate={(date) => isBefore(date, new Date())}
          />

          <ErrorMessages
            errorMessages={errorMessages}
            keyname="delivery_date"
          />
        </div>
        <div className={styles.eachFormField}>

          <p className={styles.label}>Contact Number</p>
          <TextField
            sx={{
              "& .MuiInputBase-root": {
                background: "#fff",
              },
              "& .MuiInputBase-input": {
                padding: "8px 14px",
                height: "inherit",
                fontFamily: "'Inter', sans-serif",
                fontSize: "clamp(12px, 0.72vw, 14px)",
                borderRadius: "8px !important"

              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#D0D5DD !important",
                borderWidth: "1px !important",
                borderRadius: "8px !important"
              },
            }}
            size="small"
            fullWidth
            placeholder="Contact Number"
            value={phoneNumber}
            onInput={handleInput}
            onChange={(e: any) => setPhoneNumber(e.target.value)}
            error={Boolean(errorMessages?.["contact_number"])}

            helperText={
              errorMessages?.["contact_number"]
                ? errorMessages?.["contact_number"]
                : ""
            }

          />
        </div>
        <div className={styles.eachFormField}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignSelf: "stretch",
              alignItems: "center",
            }}
          >
            <p className={styles.label}>Tracking Id</p>
            <div>
              <Button className={styles.generateIdBtn} variant="text" onClick={generateUUID}>
                Generate Id
              </Button>
            </div>
          </div>
          <TextField
            sx={{
              "& .MuiInputBase-root": {
                background: "#fff",
              },
              "& .MuiInputBase-input": {
                padding: "8px 14px",
                height: "inherit",
                fontFamily: "'Inter', sans-serif",
                fontSize: "clamp(12px, 0.72vw, 14px)",
                borderRadius: "8px !important"

              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#D0D5DD !important",
                borderWidth: "1px !important",
                borderRadius: "8px !important"
              },
            }}
            fullWidth
            disabled
            value={trackingId}
            size="small"
            placeholder="Tracking Id"
            variant="outlined"
            error={Boolean(errorMessages?.["tracking_id"])}
            helperText={
              errorMessages?.["tracking_id"]
                ? errorMessages?.["tracking_id"]
                : ""
            }
          />
        </div>
        <div className={styles.drawerBtnGrp}>
          <Button
            className={styles.buttonCancel}
            onClick={() => {
              setTrackingDialogOpen(false)
              setServiceName("")
              setDate(null)
              setPhoneNumber("")
              setTrackingId("")

            }}
            size="small"
          >
            <div className={styles.text}>Cancel</div>
          </Button>
          <Button
            className={styles.buttonSubmit}
            variant="contained"
            color="info"
            size="small"
            disabled={loading}
            onClick={() => addTrackingDetails()}
            sx={{
              "&.Mui-disabled": {
                background: "#c62828",
                color: "#000",
              },
            }}
          >
            <div className={styles.text}>
              {trackingLoading ? (
                <CircularProgress size="1.3rem" sx={{ color: "white" }} />
              ) : (
                "Submit"
              )}
            </div>
          </Button>
        </div>
      </div>
    </Drawer>
  );
};

export default TrackingDetailsDilog;
