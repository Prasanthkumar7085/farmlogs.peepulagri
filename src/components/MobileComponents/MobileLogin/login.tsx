import type { NextPage } from "next";
import { ChangeEvent, WheelEvent, useCallback, useState } from "react";
import {
  TextField,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import styles from "./login.module.css";
import ImageComponent from "@/components/Core/ImageComponent";
import { useRouter } from "next/router";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import getOtpService from "../../../../lib/services/AuthServices/getOtpService";
import { useDispatch } from "react-redux";
import { setOtpCountDown } from "@/Redux/Modules/Otp";


const MobileLogin: NextPage = () => {
  
  const router = useRouter();
    const dispatch = useDispatch();

  const [mobile, setMobile] = useState('');
  const [loadingWhileGettingOtp, setLoadingWhileGettingOtp] = useState(false);
  const [responseErrorMesaages, setResponseErrorMessages] = useState<any>();

  const onButtonClick = async () => {
    setLoadingWhileGettingOtp(true);
    setResponseErrorMessages({});

    const body = {
      phone: mobile
    }

    const response = await getOtpService(body);

    if (response?.success) {
      dispatch(setOtpCountDown(59));
      router.push({
        pathname: "/signup-verify",
        query: { mobile: mobile }
      });
    } else if (response?.status == 422) {
      setResponseErrorMessages(response?.errors)
    } 
    setLoadingWhileGettingOtp(false);
  };

    const handleKeyPress = (event: any) => {
        const keyPressed = event.key;
        const allowedCharacters = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

        if (!allowedCharacters.includes(keyPressed)) {
            event.preventDefault();
        }
    };
    const setMobileNumber = (e: ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        value = value.trim();;
        if (value.length <= 10) {
            setMobile(value)
        }
    }
  
  
  return (
    <div id={styles.mobileLoginPage}>
      <div className={styles.login}>
        <div className={styles.bgImage}>
          <img src="./mobile-bg-login.png" alt="Bg Image" />
        </div>
        <div className={styles.logo} id="login-logo">
          <ImageComponent src="./Logo-color.svg" width="150" height="110" alt={'logo'} />
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
              required
              placeholder="96678 XXXXX"
              fullWidth={true}
              variant="outlined"
              type="number"
              value={mobile}
              onKeyPress={handleKeyPress}
              error={Boolean(responseErrorMesaages?.phone)}
              helperText={responseErrorMesaages?.phone}
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderRadius: "8px !important",
                }
              }}
              onChange={setMobileNumber}
              onKeyDown={(e) => {
              if (e.key == 'Enter') {
                onButtonClick()
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
            onClick={onButtonClick}
            
          >
            Continue
            {loadingWhileGettingOtp ?
              <CircularProgress size="1.5rem" sx={{ color: "white" }} /> :
              <ArrowForwardIcon sx={{ marginTop: "5px" }} />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileLogin;
