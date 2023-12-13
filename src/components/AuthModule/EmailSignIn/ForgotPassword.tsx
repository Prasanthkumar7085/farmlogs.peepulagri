import ErrorMessagesComponent from "@/components/Core/ErrorMessagesComponent";
import ImageComponent from "@/components/Core/ImageComponent";
import LoadingComponent from "@/components/Core/LoadingComponent";
import EditIcon from "@mui/icons-material/Edit";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import {
  Button,
  CircularProgress,
  IconButton,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import OtpInput from "react18-input-otp";
import styles from "../SignUp/SignUp.module.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState<any>();
  const [loading, setLoading] = React.useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState<any>();
  const [invalid, setInvalid] = useState<any>();
  const [otpvisible, setOtpVisible] = useState(false);
  const [otpvalue, setOtpValue] = useState("");
  const [otpinvalid, setOtpInvalid] = useState<any>();
  const [otperrormesseges, setOtpErrorMesseges] = useState<any>();
  const [timeRemaining, setTimeRemaining] = useState(30);
  const router = useRouter();
  const [editEmail, setEditEmail] = useState(true);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<boolean>(false);
  const [seconds, setSeconds] = useState(30);

  const RequestOtp = async (e: any) => {
    setInvalid(false);
    setButtonLoading(true);
    e.preventDefault();
    try {
      var requestOptions: any = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/forgot-password`,
        requestOptions
      );

      const res = await response.json();
      if (response.status == 200 || response.status == 201) {
        setTimeRemaining(30);
        setOtpVisible(true);
        setEditEmail(false);
        setAlertMessage(res.message);
        setAlertType(true);
      }
      if (response.status == 422) {
        setErrorMessages(res.errors);
        setButtonLoading(false);
        throw res;
      } else if (response.status === 401) {
        setInvalid(res.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setButtonLoading(false);
    }
  };

  const VerifyOtp = async (e: any) => {
    setOtpInvalid(false);
    setLoading(true);
    try {
      var requestOptions: any = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          otp: otpvalue,
        }),
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/forgot-password/verify-otp`,
        requestOptions
      );
      const res = await response.json();

      if (res.status >= 200 && res.status <= 300) {
        localStorage.setItem("email", email);
        router.push({
          pathname: "/forgot-password/reset-password",
          query: { isVerify: true },
        });
      }
      if (response.status == 422) {
        setOtpErrorMesseges(res.errors);
        setLoading(false);
        throw res;
      } else if (response.status === 401 || response.status == 400) {
        setOtpInvalid(res.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }

      if (seconds === 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [seconds]);

  return (
    <div id={styles.loginPage}>
      <div className={styles.bgImage}>
        <img src="/login-bg.webp" alt="Bg Image" />
      </div>

      <form noValidate className={styles.formCard} onSubmit={RequestOtp}>
        <div className={styles.innerWrap}>
          <div className={styles.header}>
            <ImageComponent src="/Logo-color.svg" width="80" height="60" />
            <span className={styles.content}>
              <Typography variant="h5">Forgot Password</Typography>
              <Typography component="p">
                Verify your email to reset password
              </Typography>
            </span>
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "flex-start" }}>
              <TextField
                placeholder="Email"
                sx={{
                  width: "100%",
                  "& .MuiInputBase-root": {
                    background: "#fff",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "0 !important",
                  },
                }}
                disabled={!editEmail}
                size="small"
                name="email"
                type={"text"}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrorMessages(null);
                }}
              />
              {!editEmail ? (
                <IconButton
                  onClick={() => {
                    setEditEmail(true);
                  }}
                >
                  <EditIcon />
                </IconButton>
              ) : (
                ""
              )}
            </div>
            <ErrorMessagesComponent errorMessage={errorMessages?.email} />
            {invalid ? <p className={styles.invalid}>{invalid}</p> : ""}

            {otpvisible && !editEmail ? (
              <Typography className={styles.resendContent}>
                {"Didn't you receive the OTP? "}
                {seconds > 0 ? (
                  ` Resend  in: ${seconds} seconds`
                ) : (
                  <span
                    style={{ color: "#3462cf", cursor: "pointer" }}
                    onClick={RequestOtp}
                  >
                    Resend OTP
                  </span>
                )}
              </Typography>
            ) : (
              <Button
                className={styles.otp_Btn}
                variant="contained"
                color="primary"
                type="submit"
              >
                {buttonLoading ? (
                  <CircularProgress color="inherit" size={"1.5rem"} />
                ) : (
                  "Request OTP"
                )}
              </Button>
            )}
          </div>

          {otpvisible && !editEmail ? (
            <div style={{ marginTop: "0.5rem" }}>
              <OtpInput
                value={otpvalue}
                onChange={(e: string) => {
                  setOtpValue(e);
                  setOtpErrorMesseges(null);
                }}
                numInputs={4}
                isInputNum
                shouldAutoFocus
                inputStyle="otpInputs"
              />
              <ErrorMessagesComponent errorMessage={otperrormesseges?.otp} />
              {otpinvalid ? (
                <p
                  style={{
                    margin: "0",
                    color: "red",
                    fontSize: "clamp(12px, 0.62vw, 14px)",
                    marginBottom: "8px",
                  }}
                >
                  {otpinvalid}
                </p>
              ) : (
                ""
              )}
              <Button
                className={styles.otp_Btn}
                variant="contained"
                color="primary"
                onClick={VerifyOtp}
              >
                Verify OTP
              </Button>
            </div>
          ) : (
            ""
          )}
          <div className={styles.backToLogin}>
            <div
              className={styles.backToLogin_btn}
              style={{ justifyContent: "flex-start !important" }}
              onClick={() => router.back()}
            >
              <KeyboardBackspaceIcon sx={{ marginRight: "0.5rem" }} />
              <Typography>Back To Login</Typography>
            </div>
          </div>
        </div>
      </form>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={Boolean(alertMessage)}
        autoHideDuration={3000}
        onClose={() => setAlertMessage("")}
      >
        <MuiAlert
          variant="filled"
          onClose={() => setAlertMessage("")}
          severity={`${alertType ? "success" : "error"}`}
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </MuiAlert>
      </Snackbar>
      <LoadingComponent loading={loading} />
    </div>
  );
}
