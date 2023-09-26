import type { NextPage } from "next";
import { useCallback } from "react";
import {
  TextField,
  InputAdornment,
  Icon,
  IconButton,
  Button,
  Typography,
} from "@mui/material";
import styles from "./login.module.css";
import ImageComponent from "@/components/Core/ImageComponent";

const MobileLogin: NextPage = () => {
  const onButtonClick = useCallback(() => {
    // Please sync "Log in " to the project
  }, []);

  return (
    <div id={styles.mobileLoginPage}>
      <div className={styles.login}>
        <div className={styles.bgImage}>
          <img src="./mobile-bg-login.png" alt="Bg Image" />
        </div>
        <div className={styles.logo} id="login-logo">
          <ImageComponent src="./Logo-color.svg" width="150" height="110" />
        </div>
        <div className={styles.loginform}>
          <div className={styles.loginfield}>
            <div className={styles.loginheader}>
              <Typography className={styles.welcomeBack1}>Welcome Back</Typography>
              <Typography className={styles.enterPhoneNumber}>
                Enter Phone Number to Access Your Account
              </Typography>
            </div>
            <TextField
              className={styles.logintextfield}
              color="primary"
              size="medium"
              placeholder="+91 9667849914"
              required={true}
              error={true}
              fullWidth={true}
              variant="outlined"
              type="tel"
            />
          </div>
          <Button
            className={styles.button}
            color="error"
            name="continue"
            id="signin"
            size="large"
            variant="contained"
            endIcon={<Icon>arrow_forward_sharp</Icon>}
            onClick={onButtonClick}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileLogin;
