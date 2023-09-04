import { Button, CircularProgress, TextField, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import verifyOtpService from "../../../../lib/services/AuthServices/verifyOtpService";
import setCookie from "../../../../lib/CookieHandler/setCookie";
import { setUserDetails } from "@/Redux/Modules/Auth";
import getAllFarmsService from "../../../../lib/services/FarmsService/getAllFarmsService";
import { useDispatch } from "react-redux";
import styles from "./SignUpVerify.module.css";
import ImageComponent from "../../../components/Core/ImageComponent";

const SignUpVerify = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [mobile, setMobile] = useState<string>();
  const [otp, setOtp] = useState<string>("");
  const [errorMessages, setErrorMessages] = useState<any>({});
  const [loadingWhileVerifyingOtp, setLoadingWhileVerifyingOtp] =
    useState(false);

  useEffect(() => {
    if (router?.isReady) {
      setMobile(router.query.mobile as string);
    }
  }, [router.isReady]);

  const verifyOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingWhileVerifyingOtp(true);
    const body = {
      phone: mobile,
      otp: otp,
    };
    const response = await verifyOtpService(body);

    if (response.success) {
      setCookie();
      if ("data" in response) {
        dispatch(setUserDetails(response?.data));
      }
      let accessToken = response.data.access_token;
      if (response?.data?.user_details?.user_type == "ADMIN") {
        router.push("/support");
      } else {
        let farmResponse = await getAllFarmsService(accessToken);

        if (
          farmResponse.success &&
          farmResponse.data &&
          farmResponse?.data.length
        ) {
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
      setErrorMessages({ message: response.message });
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
            //   error={ Boolean(errorMessages) }
            //   helperText={errorMessages}
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
          {errorMessages.message ? (
            <p style={{ color: "red", margin: "0" }}>
                {errorMessages.message}
            </p>) : ("")}           
          <p className={styles.helperText}>Don't receive an OTP <Button variant="text">Resent OTP</Button> </p>
        </div>
      </form>
    </div>
  );
};

export default SignUpVerify;
