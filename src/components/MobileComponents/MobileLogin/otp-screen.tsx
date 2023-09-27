import type { NextPage } from "next";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./otp-screen.module.css";
import { Button, CircularProgress, TextField, Typography } from "@mui/material";
import ImageComponent from "@/components/Core/ImageComponent";
import OtpInput from "react18-input-otp";
import { useRouter } from "next/router";
import { useSelector,useDispatch } from "react-redux";
import { resetOtpCountDown, setOtpCountDown } from "@/Redux/Modules/Otp";
import verifyOtpService from "../../../../lib/services/AuthServices/verifyOtpService";
import setCookie from "../../../../lib/CookieHandler/setCookie";
import { setUserDetails } from "@/Redux/Modules/Auth";
import serUserTypeCookie from "../../../../lib/CookieHandler/serUserTypeCookie";
import getAllFarmsService from "../../../../lib/services/FarmsService/getAllFarmsService";
import { setAllFarms } from "@/Redux/Modules/Farms";
import getOtpService from "../../../../lib/services/AuthServices/getOtpService";


const MobileOtpScreen: NextPage = () => {


  const router = useRouter();
  const dispatch = useDispatch();


    const otpCountDown = useSelector((state: any) => state.otp.resendOtpIn);


  const [errorMessages, setErrorMessages] = useState<any>({});
  const [loadingWhileVerifyingOtp, setLoadingWhileVerifyingOtp] = useState(false);
  const [mobile, setMobile] = useState<string>();
  const [otp, setOtp] = useState<string>("");
  const [seconds, setSeconds] = useState(0);

    useEffect(() => {
    setMobile(router.query.mobile as string);
    if (router?.isReady && otpCountDown) {
      setSeconds(otpCountDown);
      dispatch(setOtpCountDown(otpCountDown));
    }
  }, [router.isReady, otpCountDown]);

  useEffect(() => {
    setSeconds(otpCountDown)
  }, [otpCountDown]);

  const onSubmitOtpClick = async (value = '') => {
    setErrorMessages({});
    setLoadingWhileVerifyingOtp(true);

    let otpValue = '';
    if (value) {
      otpValue = value
    } else {
      otpValue = otp
    }
    const body = {
      phone: mobile,
      otp: otpValue,
    };

    const response = await verifyOtpService(body);

    if (response.success) {
      await setCookie();
      if ("data" in response) {
        dispatch(setUserDetails(response?.data));
      }
      let accessToken = response.data.access_token;
      await serUserTypeCookie(response?.data?.user_details?.user_type);

      router.push('/farms');

    } else if (response.status == 422) {
      if ("errors" in response) {
        setErrorMessages(response.errors);
      }
    } else if (response.status == 401 || response.status == 409) {
      setErrorMessages({ otp: response.message });
    }
    setLoadingWhileVerifyingOtp(false);
  }

  const resetCountdown = async () => {
    setSeconds(59);
    dispatch(resetOtpCountDown());
    const body = {
      phone: mobile
    }
    const response = await getOtpService(body);

  }

  const setOtpValue = (value: string) => {
    setErrorMessages({});
    setOtp(value)
    if (value.length == 6) {
      onSubmitOtpClick(value);
    }
  }
  
  return (
    <div className={styles.otpscreen}>
      <div className={styles.bgImage}>
        <img src="./verifyotp@3x.png" alt="Bg Image" />
      </div>
      <div className={styles.verifyotpscreen}>
        <ImageComponent alt="" src="/Logo-color.svg" width={130} height={100} />
        <div className={styles.verifyotpform}>
          <div className={styles.verifyotpdetails}>
            <div className={styles.verifyotpdetailsheader}>
              <Typography variant="h3" className={styles.otpVerification} >
                OTP Verification
              </Typography>
              <Typography className={styles.enterTheOtp}>Enter the OTP sent to your mobile number<br /> ends with
                <span>{' *'+mobile?.slice(7,)}</span></Typography>
            </div>
            <div className={styles.otpfield}>
              <div className={styles.otptextboxes}>
                <OtpInput
                  value={otp}
                  onChange={(e:string) => setOtpValue(e)}
                  numInputs={6}
                  isInputNum
                  shouldAutoFocus
                  inputStyle={{
                    width: '30px',
                    height: '40px',
                    fontSize: '18px',
                    borderRadius: '0px',
                    marginRight: '1.5rem',
                    textAlign: 'center',
                  }}
                  errorStyle={Boolean(errorMessages.otp)}
                />
              </div>
                <p style={{color:"red", fontSize:"10px",minHeight:"10px"}}>{errorMessages?.otp}</p>
               <Typography variant="h6" className={styles.resendContainer}>
                  {!seconds ? <p className={styles.helperText}>{"Did not receive an OTP?"}
                  <Button
                  variant="text"
                  onClick={resetCountdown}
                  disabled={otpCountDown}
                  sx={{ textTransform: "capitalize" }}>
                    Resend OTP
                  </Button>
                </p> : ""}
          {seconds ? `Resend in 00:${otpCountDown}s` : ""}
                </Typography>
            </div>
          </div>
          <Button
            className={styles.submitotp}
            color="error"
            name="verify"
            id="verify"
            size="large"
            variant="contained"
            onClick={()=>onSubmitOtpClick()}
            fullWidth
          >
            Verify
            {loadingWhileVerifyingOtp ?
              <CircularProgress size="1.5rem" sx={{color:"white"}} />
            : ""}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileOtpScreen;
