import { Button, CircularProgress, TextField, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useRef, useState } from "react";
import verifyOtpService from "../../../../lib/services/AuthServices/verifyOtpService";
import setCookie from "../../../../lib/CookieHandler/setCookie";
import { setUserDetails } from "@/Redux/Modules/Auth";
import getAllFarmsService from "../../../../lib/services/FarmsService/getAllFarmsService";
import { useDispatch } from "react-redux";
import styles from "./SignUpVerify.module.css";
import ImageComponent from "../../../components/Core/ImageComponent";
import { doesSectionFormatHaveLeadingZeros } from "@mui/x-date-pickers/internals/hooks/useField/useField.utils";
import serUserTypeCookie from "../../../../lib/CookieHandler/serUserTypeCookie";
import { setOtpCountDown } from "@/Redux/Modules/Otp";
import { useSelector } from "react-redux";
import getOtpService from "../../../../lib/services/AuthServices/getOtpService";
import { setAllFarms } from "@/Redux/Modules/Farms";

const SignUpVerify = () => {

  const router = useRouter();
  const dispatch = useDispatch();

  const otpCountDown = useSelector((state: any) => state.otp.resendOtpIn);

  const [mobile, setMobile] = useState<string>();
  const [otp, setOtp] = useState<string>("");
  const [errorMessages, setErrorMessages] = useState<any>({});
  const [loadingWhileVerifyingOtp, setLoadingWhileVerifyingOtp] = useState(false);

  const descriptionElementRef = useRef<HTMLElement>(null);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(59);

  useEffect(() => {
    if (router?.isReady) {
      setMobile(router.query.mobile as string);
      setSeconds(59);
      dispatch(setOtpCountDown(59));
    }
  }, [router.isReady]);

  useEffect(() => {
    setSeconds(otpCountDown)
  }, [otpCountDown])
  useEffect(() => {


    const { current: descriptionElement } = descriptionElementRef;
    if (descriptionElement !== null) {
      descriptionElement.focus();
    }
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
        dispatch(setOtpCountDown(seconds - 1));
      }

      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(interval);
        } else {
          setSeconds(59);
          dispatch(setOtpCountDown(59));
          setMinutes(minutes - 1);
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };

  }, [seconds]);

  const resetCountdown = async () => {
    setSeconds(59);
    dispatch(setOtpCountDown(59));
    const body = {

      phone: mobile
    }

    const response = await getOtpService(body);

  }

  const verifyOtp = async (e: FormEvent<HTMLFormElement>) => {

    e.preventDefault();
    setLoadingWhileVerifyingOtp(true);

    const body = {
      phone: mobile,
      otp: otp,
    };

    const response = await verifyOtpService(body);

    if (response.success) {

      await setCookie();
      if ("data" in response) {
        dispatch(setUserDetails(response?.data));
      }

      let accessToken = response.data.access_token;

      await serUserTypeCookie(response?.data?.user_details?.user_type);

      if (response?.data?.user_details?.user_type == "ADMIN") {
        router.push("/support");
      } else if ((response?.data?.user_details?.user_type == "USER")) {
        let farmResponse = await getAllFarmsService(accessToken);

        if (
          farmResponse.success &&
          farmResponse.data &&
          farmResponse?.data.length
        ) {
          dispatch(setAllFarms(farmResponse?.data))
          const id = farmResponse?.data[0]?._id;
          router.push(`/farm/${id}/logs`);
        } else {
          router.push("/farm");
        }
      }
    } else if (response.status == 422) {
      if ("errors" in response) {
        setErrorMessages(response.errors);
      }
    } else if (response.status == 401 || response.status == 409) {
      setErrorMessages({ otp: response.message });
    }
    setLoadingWhileVerifyingOtp(false);
  };
  
  return (
    <div id={styles.loginPage}>
      <div className={styles.bgImage}>
        <img src="/login-bg.webp" alt="Bg Image" />
      </div>

      <form onSubmit={verifyOtp} className={styles.formCard}>
        <div className={styles.innerWrap}>
          <div className={styles.header}>
            <ImageComponent src="./Logo-color.svg" width="90" height="70" />
            <span className={styles.content}>
              <Typography variant="h5">Verify OTP!</Typography>
              <Typography component="p"></Typography>
            </span>
          </div>
          <div>
            <Typography className={styles.label}>We sent a verification code to <span>+91 {mobile}</span></Typography>
            <TextField
            autoFocus
              fullWidth
              error={Boolean(errorMessages?.otp) }
              helperText={errorMessages?.otp}
              size="small"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e: any) => setOtp(e.target.value)}
              className={styles.phoneNo}
            />
          </div>
          
          <Button
            className={styles.cta_button}
            type="submit"
            size="large"
            variant="contained"

          >
            {loadingWhileVerifyingOtp ? (
              <CircularProgress size="1.5rem" sx={{ color: "white" }} />
            ) : (
              "Submit"
            )}
          </Button>
                    
          <p className={styles.helperText}>{"Don't receive an OTP "}
            <Button variant="text" onClick={resetCountdown} disabled={otpCountDown}>Resent OTP</Button>
            {seconds ? `Resend in 00:${otpCountDown}s` : ""}
          </p>

        </div>
      </form>
    </div>
  );
};

export default SignUpVerify;
