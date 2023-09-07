import {
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { ChangeEvent, useState } from "react";
import loginService from "../../../lib/services/AuthServices/loginService";
import LoadingComponent from "../Core/LoadingComponent";
import setCookie from "../../../lib/CookieHandler/setCookie";
import getAllFarmsService from "../../../lib/services/FarmsService/getAllFarmsService";
import { useRouter } from "next/router";
import ErrorMessages from "../Core/ErrorMessages";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useDispatch } from "react-redux";
import { setUserDetails } from "@/Redux/Modules/Auth";
import styles from "./login.module.css";
import ImageComponent from "../Core/ImageComponent";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {
  AuthResponseDataType,
  AuthResponseErrorDataType,
} from "@/types/AuthTypes";
import { setAllFarms } from "@/Redux/Modules/Farms";
type ResponseData = AuthResponseDataType | AuthResponseErrorDataType;

const Login = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [errorMessages, setErrorMessages] = useState<any>({});

  const login = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      let response: AuthResponseDataType | AuthResponseErrorDataType | any;
      response = await loginService({ email: email, password: password });

      if (response.success) {
        setCookie();
        if ("data" in response) {
          dispatch(setUserDetails(response?.data));
        }
        let accessToken = response.data.access_token;
        let farmResponse = await getAllFarmsService(accessToken);
        if (farmResponse.success) {
          dispatch(setAllFarms(farmResponse?.data))
          const id = farmResponse.data[0]._id;
          router.push(`/farm/${id}/logs`);
        }
      } else if (response.status == 422) {
        if ("errors" in response) {
          setErrorMessages(response.errors);
        }
      } else if (response.status == 401) {
        setErrorMessages({ message: response.message });
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id={styles.loginPage}>
      <ImageComponent
        src="./Logo-color.svg"
        width={140}
        height={100}
        alt="logo"
        className={styles.logo}
      />
      <Card sx={{ minWidth: 275 }} className={styles.formCard}>
        <CardContent>
          <Typography variant="h5" component="div" className={styles.title}>
            Welcome
          </Typography>
          <Typography
            color="text.secondary"
            gutterBottom
            className={styles.para}
          >
            Get started by login your account
          </Typography>
          <form onSubmit={login} className={styles.innerForm}>
            <div style={{ marginBottom: "20px" }}>
              <TextField
                label="Email Id"
                variant="outlined"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                fullWidth
                placeholder="Enter Email"
                size="small"
              />
              <div>
                <ErrorMessages
                  errorMessages={errorMessages}
                  keyname={"email"}
                />
              </div>
            </div>
            <div style={{ marginBottom: "0px" }}>
              <TextField
                label="Password"
                variant="outlined"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                fullWidth
                placeholder="Enter Password"
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {!showPassword ? (
                          <VisibilityIcon style={{}} />
                        ) : (
                          <VisibilityOffIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {errorMessages.password ? (
                <div style={{ minHeight: "25px" }}>
                  <ErrorMessages
                    errorMessages={errorMessages}
                    keyname={"password"}
                  />
                </div>
              ) : (
                <div style={{ minHeight: "25px" }}>
                  <ErrorMessages
                    errorMessages={errorMessages}
                    keyname={"message"}
                  />
                </div>
              )}
            </div>
            <Button
              type={"submit"}
              variant="contained"
              size="large"
              className={styles.submitButton}
              fullWidth
            >
              Login <ArrowForwardIcon />
            </Button>
          </form>
        </CardContent>
        {/* <CardActions>
          <Button size="small" color="warning">Forgot Password</Button>
        </CardActions> */}
      </Card>

      <LoadingComponent loading={loading} />
      <Typography
        color="text.secondary"
        gutterBottom
        className={styles.copyrightText}
      >
        © 2023-2033 Peepul Agri. All Rights Reserved.
      </Typography>
    </div>
  );
};

export default Login;
