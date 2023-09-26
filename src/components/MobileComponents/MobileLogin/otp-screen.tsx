import type { NextPage } from "next";
import { useCallback } from "react";
import styles from "./otp-screen.module.css";
import { Button, TextField } from "@mui/material";

const MobileOtpScreen: NextPage = () => {
  const onSubmitOtpClick = useCallback(() => {
    // Please sync "Dashboard" to the project
  }, []);

  return (
    <div className={styles.otpscreen}>
      <div className={styles.verifyotp}>
        <div className={styles.verifyotpscreen}>
          <img className={styles.logoIcon} alt="" src="/logo.svg" />
          <div className={styles.verifyotpform}>
            <div className={styles.verifyotpdetails}>
              <div className={styles.verifyotpdetailsheader}>
                <h3 className={styles.otpVerification} id="heading">
                  OTP Verification
                </h3>
                <h6 className={styles.enterTheOtpContainer} id="description">
                  <p
                    className={styles.enterTheOtp}
                  >{`Enter the OTP sent to your mobile number `}</p>
                  <p className={styles.enterTheOtp}>
                    <span>{`ends with `}</span>
                    <span className={styles.span}>*584</span>
                  </p>
                </h6>
              </div>
              <div className={styles.otpfield}>
                <div className={styles.otptextboxes}>
                  <TextField
                    className={styles.textfield}
                    color="warning"
                    variant="outlined"
                  />
                  <div className={styles.div}>
                    <div className={styles.div1}>*</div>
                  </div>
                  <div className={styles.div}>
                    <div className={styles.div1}>*</div>
                  </div>
                  <div className={styles.div}>
                    <div className={styles.div1}>*</div>
                  </div>
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
    </div>
  );
};

export default MobileOtpScreen;
