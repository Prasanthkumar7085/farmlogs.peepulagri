import { setUserDetails } from "@/Redux/Modules/Auth";
import ErrorMessagesComponent from "@/components/Core/ErrorMessagesComponent";
import ImageComponent from "@/components/Core/ImageComponent";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import styles from "../SignUp/SignUp.module.css";
import { useCookies } from "react-cookie";
import { Toaster, toast } from "sonner";
import DeviceDetector from "device-detector-js";

export default function SigninEmail() {
  const dispatch = useDispatch();
  const [, userType_v2] = useCookies(["userType_v2"]);
  const [, loggedIn_v2] = useCookies(["loggedIn_v2"]);

  const [email, setEmail] = useState<any>();
  const [password, setPassword] = useState<any>();
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessages, setErrorMessages] = useState<any>();
  const [invalid, setInvalid] = useState<any>();
  const router = useRouter();
  const [deviceType, setDeviceType] = useState<any>()



  //to know the mobile or desktop

  useEffect(() => {
    const deviceDetector = new DeviceDetector();
    const userAgent = navigator.userAgent;
    const device = deviceDetector.parse(userAgent);

    setDeviceType(device.device?.type) // This will log the parsed device information
  }, []);

  const signInForm = async (e: any) => {
    e.preventDefault();
    setInvalid(false);
    setLoading(true);
    try {
      var requestOptions: any = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/signin`,
        requestOptions
      );
      const res = await response.json();
      if (response.status == 200 || response.status == 201) {
        loggedIn_v2("loggedIn_v2", "true");
        userType_v2("userType_v2", res?.data?.user_details?.user_type);

        if ("data" in res) {
          dispatch(setUserDetails(res?.data));
        }

        if (
          deviceType == "desktop"
        ) {
          router.push("/scouts");
        }
        if (deviceType !== "desktop") {
          router.push("/dashboard");
        }
      } else if (response.status == 422) {
        setErrorMessages(res.errors);
        setLoading(false);
        throw res;
      } else if (response.status === 401) {
        setInvalid(res.message);
      } else {
        toast.error(res.message || 'Error while login')
      }
    } catch (err) {
      console.error(err);
      toast.error('Error while login')
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div id={styles.loginPage}>
      <div className={styles.bgImage}>
        <ImageComponent
          src="./auth/clouds.svg"
          className={styles.vectorTop}
          width="400"
          height="100"
        />
        <ImageComponent
          src="./auth/bottom-cart.svg"
          className={styles.vectorBottom}
          width="400"
          height="150"
        />
      </div>
      <form noValidate className={styles.formCard} onSubmit={signInForm}>
        <div className={styles.innerWrap}>
          <div className={styles.header}>
            <ImageComponent
              src="./logo-p0.svg"
              className={styles.logo}
              width="90"
              height="70"
            />
            <span className={styles.content}>
              <Typography variant="h5">Sign in</Typography>
              <Typography component="p">Please enter your details</Typography>
            </span>
          </div>
          <div>
            <TextField
              placeholder="Email"
              sx={{
                width: "100%",
                "& .MuiInputBase-root": {
                  background: "#fff",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderWidth: "1px !important",
                },
              }}
              size="small"
              name="email"
              type={"text"}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrorMessages(null);
              }}
            />
            <ErrorMessagesComponent errorMessage={errorMessages?.email} />
          </div>
          <div>
            <TextField
              sx={{
                width: "100%",
                "& .MuiInputBase-root": {
                  background: "#fff",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderWidth: "1px !important",
                },
              }}
              size="small"
              placeholder="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrorMessages(null);
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <ErrorMessagesComponent errorMessage={errorMessages?.password} />

            {invalid ? (
              <p
                style={{
                  color: "red",
                  margin: "0 !important",
                  fontSize: "12px !important",
                }}
              >
                {invalid}
              </p>
            ) : (
              ""
            )}
            {/* <div style={{ textAlign: "end" }}>
              <div onClick={forgotButton} className={styles.forgotBtn}>
                Forgot Password?
              </div>
            </div> */}
          </div>

          <Button
            className={styles.signin_button}
            fullWidth
            variant="contained"
            type="submit"
          >
            {loading ? (
              <CircularProgress color="inherit" size={"1.8rem"} />
            ) : (
              "Sign In"
            )}
          </Button>
        </div>
      </form>

      <Toaster closeButton richColors position="top-right" />
    </div>
  );
}
