import { removeUserDetails } from "@/Redux/Modules/Auth";
import { deleteAllMessages } from "@/Redux/Modules/Conversations";
import ErrorMessagesComponent from "@/components/Core/ErrorMessagesComponent";
import LoadingComponent from "@/components/Core/LoadingComponent";
import {
  Alert,
  AlertTitle,
  Button,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { prepareURLEncodedParams } from "../../../../../lib/requestUtils/urlEncoder";

import styles from "./summary.module.css";
import { LocalizationProvider, MobileDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from 'dayjs';
import { toast } from "sonner";
import timePipe from "@/pipes/timePipe";

const UpdateSummary = () => {

  const router = useRouter();
  const dispatch = useDispatch();


  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );
  const summaryFarmTitleName = useSelector(
    (state: any) => state.farms?.summaryFarmTitle

  );
  const summaryCropTitleName = useSelector(
    (state: any) => state.farms?.summaryCropTitle

  );
  const [, , removeCookie] = useCookies(["userType_v2"]);
  const [, , loggedIn_v2] = useCookies(["loggedIn_v2"]);
  const [loading, setLoading] = useState(false);
  const [summaryData, setSummaryData] = useState<any>();
  const [comment, setComment] = useState<any>();
  const [date, setDate] = useState<any>(null);
  const [dateError, setDateError] = useState<any>();
  const [commentError, setCommentError] = useState<any>();
  const [summaryError, setSummaryError] = useState<any>();
  const [success, setSuccess] = useState<any>();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [farmOptions, setFarmOptions] = useState<any>();
  const [cropOptions, setCropOptions] = useState<any>();
  const [cropId, setCropId] = useState<any>();
  const [farmId, setFarmID] = useState<any>();
  const [farmDefaultValue, setFarmDefaultValue] = useState<any>();
  const [cropDefaultValue, setCropDefaultValue] = useState<any>();
  const [errorMessages, setErrorMessages] = useState<any>();

  const logout = async () => {
    try {
      removeCookie("userType_v2");
      loggedIn_v2("loggedIn_v2");
      router.push("/");
      await dispatch(removeUserDetails());
      await dispatch(deleteAllMessages());
    } catch (err: any) {
      console.error(err);
    }
  };


  //get one summary details
  const getOneSummaryDetails = async () => {
    setLoading(true);
    let options = {
      method: "GET",

      headers: new Headers({
        "content-type": "application/json",
        authorization: accessToken,
      }),
    };
    try {
      let response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/crops/day-summary/${router.query.summary_id}`,
        options
      );
      let responseData: any = await response.json();
      if (responseData.status == 200) {
        setComment(responseData?.data?.content);
        setDate(formatDateForInput(responseData?.data?.date));
        setFarmDefaultValue(responseData?.data?.farm_id);
        console.log(responseData?.data?.farm_id);
        setCropDefaultValue(responseData?.data?.crop_id);
        setFarmID(responseData?.data);
        setCropId(responseData?.data?.crop_id);
        setSummaryData(responseData?.data);
      } else if (responseData?.statusCode == 403) {
        await logout();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  //update the summary api
  const updateSummary = async () => {
    setLoading(true);
    setDateError("");
    setCommentError("");
    setSummaryError("");

    const originalDate = new Date(date);
    let dateNow = new Date();
    if (
      !(
        originalDate.getFullYear() == dateNow.getFullYear() &&
        originalDate.getMonth() == dateNow.getMonth() &&
        originalDate.getDate() == dateNow.getDate()
      )
    ) {
      dateNow = new Date(
        originalDate.getFullYear(),
        originalDate.getMonth(),
        originalDate.getDate(),
        23,
        59,
        59,
        999
      );
    }

    try {
      let body = {
        farm_id: farmId,
        content: comment,
        date: date
          ? `${originalDate.getFullYear()}-${(originalDate.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${originalDate
              .getDate()
              .toString()
              .padStart(2, "0")}T${dateNow
                .getHours()
                .toString()
                .padStart(2, "0")}:${dateNow
                  .getMinutes()
                  .toString()
                  .padStart(2, "0")}:${dateNow
                    .getSeconds()
                    .toString()
                    .padStart(2, "0")}.${dateNow
                      .getMilliseconds()
                      .toString()
                      .padStart(3, "0")}Z`
          : "",
        crop_id: cropId,
      };
      let options = {
        method: "PATCH",
        headers: new Headers({
          "content-type": "application/json",
          authorization: accessToken,
        }),
        body: JSON.stringify(body),
      };

      let response: any = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/crops/day-summary/${router.query.summary_id}`,
        options
      );
      let responseData = await response.json();

      if (responseData.status == 200) {
        setSuccess(responseData.message);
        setShowSuccessAlert(true);
        router.back();
        setTimeout(() => {
          setShowSuccessAlert(false);
        }, 1500);
      } else if (responseData.status == 422) {
        setErrorMessages(responseData.errors);

        setDateError(responseData.errors.date);
        setCommentError(responseData.errors.content);
        // setSummaryError(responseData.errors.summary);
        setShowErrorAlert(true);
        setTimeout(() => {
          setShowErrorAlert(false);
        }, 1500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (router.isReady && accessToken) {
      getOneSummaryDetails();
    }
  }, [router.isReady, accessToken]);


  const formatDateForInput = (dateString: any) => {
    const date = new Date(dateString?.slice(0, 10));
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <div>
      <div className={styles.summaryHeader} id="header">
        <img
          className={styles.iconsiconArrowLeft}
          alt=""
          src="/iconsiconarrowleft.svg"
          onClick={() => router.back()}
        />
        <Typography className={styles.viewFarm}>Edit Summary  </Typography>
        <div className={styles.headericon} id="header-icon"></div>
      </div>

      <div className={styles.updatedSummaryContainer}>
        <div style={{ textAlign: "center", marginBottom: "0.8rem" }}>
          <p style={{ margin: "0", fontSize: "14px", fontFamily: "'Inter', sans-serif", color: "#d94841" }}>{summaryFarmTitleName} (<span>{summaryCropTitleName})</span></p>
        </div>
        <div className={styles.singleFarmBlock}>
          <Typography variant="h6">Date</Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>

            <MobileDatePicker sx={{
              width: "100%",
              '& .MuiOutlinedInput-notchedOutline ': {
                borderColor: "grey !important",
                borderRadius: "8px !important",
                color: "#000"
              },
              '& .MuiInputBase-input': {
                padding: "12px 14px",
                borderRadius: "10px !important",
                color: "#000",
                background: "#fff",


              }
            }}
              disableFuture
              value={dayjs(date)}

              format="DD-MM-YYYY"
              onChange={(e) => {

                setDate(timePipe(e, "YYYY-MM-DD"));
                setDateError('');
                setSummaryError('');
                setErrorMessages('');
              }} />
          </LocalizationProvider>
          <ErrorMessagesComponent errorMessage={errorMessages?.date} />
        </div>

        <div className={styles.singleFarmBlock}>
          <Typography variant="h6">Summary</Typography>
          <TextField
            color="primary"
            name="desciption"
            id="description"
            minRows={5}
            maxRows={5}
            placeholder="Add Summary"
            fullWidth={true}
            variant="outlined"
            multiline
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
              setCommentError("");
              setSummaryError("");
              setErrorMessages("");
            }}
            sx={{
              background: "#fff",
              borderRadius: "10px !important",

              "& .MuiOutlinedInput-notchedOutline ": {
                border: "1px solid grey !important",
                borderRadius: "10px !important",
              },
            }}
          />
          <ErrorMessagesComponent errorMessage={errorMessages?.content} />
        </div>
        <div className={styles.UpdateBtnGrp}>
          <Button
            className={styles.updateCancelBtn}
            type="submit"
            variant="outlined"
            onClick={() => router.back()}
          >
            Cancel
          </Button>

          <Button
            className={styles.updatedSaveBtn}
            type="submit"
            variant="contained"
            onClick={updateSummary}
          >
            Update
          </Button>
        </div>
      </div>
      <Snackbar
        open={showSuccessAlert}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity="success">
          <AlertTitle>Success</AlertTitle>
          {success}
        </Alert>
      </Snackbar>
      {/* <Snackbar
                open={showErrorAlert}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert severity='error'>
                    <AlertTitle>Error</AlertTitle>
                    {summaryError}
                </Alert>
            </Snackbar> */}
      <LoadingComponent loading={loading} />
    </div>
  );
};
export default UpdateSummary;