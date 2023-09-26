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
import { useRouter } from "next/router";

const MobileLogin: NextPage = () => {
  const router = useRouter();
  const onButtonClick = useCallback(() => {
    router.push('/signup-verify')
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
              <Typography variant="h5" className={styles.welcomeBack1}>Welcome Back</Typography>
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
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderRadius: "8px !important",
                }
              }}
            />
          </div>
          <Button
            className={styles.button}
            fullWidth
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
