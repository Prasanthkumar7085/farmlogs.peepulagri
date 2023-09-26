import type { NextPage } from "next";
import { useCallback } from "react";
import styles from "./otp-screen.module.css";
import { Button, TextField, Typography } from "@mui/material";
import ImageComponent from "@/components/Core/ImageComponent";

const MobileOtpScreen: NextPage = () => {
  const onSubmitOtpClick = useCallback(() => {
    // Please sync "Dashboard" to the project
  }, []);

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
                <span > *584</span></Typography>
            </div>
            <div className={styles.otpfield}>
              <div className={styles.otptextboxes}>
                <TextField
                  className={styles.textfield}
                  color="warning"
                  variant="outlined"
                />
                <TextField
                  className={styles.textfield}
                  color="warning"
                  variant="outlined"
                /><TextField
                  className={styles.textfield}
                  color="warning"
                  variant="outlined"
                /><TextField
                  className={styles.textfield}
                  color="warning"
                  variant="outlined"
                />
              </div>
              <h6 className={styles.didntYouReceivedContainer}>
                <span>{`Didn’t you received OTP? `}</span>
                <span className={styles.resentOtp}>{`Resent OTP `}</span>
              </h6>
            </div>
          </div>
          <Button
            className={styles.submitotp}
            color="error"
            name="verify"
            id="verify"
            size="large"
            variant="contained"
            onClick={onSubmitOtpClick}
          >
            Verify
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileOtpScreen;
