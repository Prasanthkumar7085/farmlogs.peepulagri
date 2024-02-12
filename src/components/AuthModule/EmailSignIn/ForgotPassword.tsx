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
        <picture>
          <img src="/login-bg.webp" alt="Bg Image" />
        </picture>
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




// import { Button, CircularProgress, TextField, Typography } from "@mui/material";
// import { useRouter } from "next/router";
// import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
// import verifyOtpService from "../../../../lib/services/AuthServices/verifyOtpService";
// import setCookie from "../../../../lib/CookieHandler/setCookie";
// import { setUserDetails } from "@/Redux/Modules/Auth";
// import getAllFarmsService from "../../../../lib/services/FarmsService/getAllFarmsService";
// import { useDispatch } from "react-redux";
// import styles from "../SignUp/SignUpVerify.module.css";
// import ImageComponent from "../../../components/Core/ImageComponent";
// import { doesSectionFormatHaveLeadingZeros } from "@mui/x-date-pickers/internals/hooks/useField/useField.utils";
// import serUserTypeCookie from "../../../../lib/CookieHandler/serUserTypeCookie";
// import { resetOtpCountDown, setOtpCountDown } from "@/Redux/Modules/Otp";
// import { useSelector } from "react-redux";
// import getOtpService from "../../../../lib/services/AuthServices/getOtpService";
// import { setAllFarms } from "@/Redux/Modules/Farms";

// const SignUpVerify = () => {

//   const router = useRouter();
//   const dispatch = useDispatch();

//   const otpCountDown = useSelector((state: any) => state.otp.resendOtpIn);

//   console.log(otpCountDown);


//   const [mobile, setMobile] = useState<string>();
//   const [otp, setOtp] = useState<string>("");
//   const [errorMessages, setErrorMessages] = useState<any>({});
//   const [loadingWhileVerifyingOtp, setLoadingWhileVerifyingOtp] = useState(false);

//   const descriptionElementRef = useRef<HTMLElement>(null);
//   const [minutes, setMinutes] = useState(0);
//   const [seconds, setSeconds] = useState(0);



//   useEffect(() => {
//     setMobile(router.query.mobile as string);
//     if (router?.isReady && otpCountDown) {
//       setSeconds(otpCountDown);
//       dispatch(setOtpCountDown(otpCountDown));
//     }
//   }, [router.isReady, otpCountDown]);

//   useEffect(() => {
//     setSeconds(otpCountDown)
//   }, [otpCountDown]);


//   useEffect(() => {
//     const { current: descriptionElement } = descriptionElementRef;
//     if (descriptionElement !== null) {
//       descriptionElement.focus();
//     }
//     const interval = setInterval(() => {
//       if (seconds > 0) {
//         setSeconds(seconds - 1);
//         dispatch(setOtpCountDown(seconds - 1));
//       }

//       if (seconds === 0) {
//         if (minutes === 0) {
//           clearInterval(interval);
//         } else {
//           setSeconds(30);
//           dispatch(setOtpCountDown(30));
//           setMinutes(minutes - 1);
//         }
//       }
//     }, 1000);

//     return () => {
//       clearInterval(interval);
//     };

//   }, [seconds]);

//   const resetCountdown = async () => {
//     setSeconds(30);
//     dispatch(resetOtpCountDown());
//     const body = {
//       phone: mobile
//     }

//     const response = await getOtpService(body);

//   }

//   const verifyOtp = async (e: FormEvent<HTMLFormElement>) => {

//     e.preventDefault();
//     setLoadingWhileVerifyingOtp(true);

//     const body = {
//       phone: mobile,
//       otp: otp,
//     };

//     const response = await verifyOtpService(body);

//     if (response.success) {

//       await setCookie();
//       if ("data" in response) {
//         dispatch(setUserDetails(response?.data));
//       }

//       let accessToken = response.data.access_token;

//       await serUserTypeCookie(response?.data?.user_details?.user_type);

//       if (response?.data?.user_details?.user_type == "ADMIN") {
//         router.push("/scouts");
//       }
//       else if ((response?.data?.user_details?.user_type == "USER" || response?.data?.user_details?.user_type == "AGRONOMIST")) {
//         router.push("/farm");

//       }
//     } else if (response.status == 422) {
//       if ("errors" in response) {
//         setErrorMessages(response.errors);
//       }
//     } else if (response.status == 401 || response.status == 409) {
//       setErrorMessages({ otp: response.message });
//     }
//     setLoadingWhileVerifyingOtp(false);
//   };
//   const handleKeyPress = (event: any) => {
//     const keyPressed = event.key;
//     const allowedCharacters = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

//     if (!allowedCharacters.includes(keyPressed)) {
//       event.preventDefault();
//     }
//   };
//   const handleOtpChange = (e: ChangeEvent<HTMLInputElement>) => {
//     let value = e.target.value;
//     value = value.trim();;
//     if (value.length <= 6) {
//       setOtp(value)
//     }
//   }

//   return (
//     <div id={styles.loginPage}>
//       <div className={styles.bgImage}>
//         <picture>
//           <img src="/login-bg.webp" alt="Bg Image" />
//         </picture>
//       </div>

//       <form onSubmit={verifyOtp} className={styles.formCard}>
//         <div className={styles.innerWrap}>
//           <div className={styles.header}>
//             <ImageComponent src="./Logo-color.svg" width="90" height="70" />
//             <span className={styles.content}>
//               <Typography variant="h5">Verify OTP!</Typography>
//               <Typography component="p"></Typography>
//             </span>
//           </div>

//           <div>
//             <Typography className={styles.label}>
//               {"We've sent an OTP to your phone number"}
//             </Typography>
//             <TextField
//               autoFocus
//               fullWidth
//               error={Boolean(errorMessages?.otp)}
//               helperText={errorMessages?.otp}
//               size="small"
//               placeholder="Enter OTP"
//               value={otp}
//               onChange={handleOtpChange}
//               className={styles.phoneNo}
//               onKeyPress={handleKeyPress}
//               onKeyDown={(e: any) => {
//                 if (e.key == "Enter") verifyOtp(e);
//               }}
//             />
//           </div>

//           <Button
//             className={styles.cta_button}
//             type="submit"
//             size="large"
//             variant="contained"
//           >
//             {loadingWhileVerifyingOtp ? (
//               <CircularProgress size="1.5rem" sx={{ color: "white" }} />
//             ) : (
//               "Submit"
//             )}
//           </Button>
//           <Button
//             variant="outlined"
//             onClick={() => router.push({ pathname: "/" })}
//           >
//             Cancel
//           </Button>

//           {!seconds ? (
//             <p className={styles.helperText}>
//               {"Did not receive an OTP?"}
//               <Button
//                 variant="text"
//                 onClick={resetCountdown}
//                 disabled={otpCountDown}
//                 sx={{ textTransform: "capitalize" }}
//               >
//                 Resend OTP
//               </Button>
//             </p>
//           ) : (
//             ""
//           )}
//           {seconds ? `Resend in ${otpCountDown}s` : ""}
//         </div>
//       </form>
//     </div>
//   );
// };

// export default SignUpVerify;
