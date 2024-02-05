
import { removeUserDetails } from "@/Redux/Modules/Auth";
import { deleteAllMessages } from "@/Redux/Modules/Conversations";
import ErrorMessagesComponent from "@/components/Core/ErrorMessagesComponent";
import LoadingComponent from "@/components/Core/LoadingComponent";
import { Logout, Visibility, VisibilityOff } from "@mui/icons-material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import {
    Button,
    Card,
    IconButton,
    InputAdornment,
    TextField,
    Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./updateProfile.module.css";
import { useCookies } from "react-cookie";
export default function UpdatePasswordPageWeb({ setChangePassword }: any) {
    const accessToken = useSelector(
        (state: any) => state.auth.userDetails?.access_token
    );

    const router = useRouter();
    const [password, setPassword] = useState<any>();
    const [confirmpassword, setConfirmPassword] = useState<any>();
    const [loading, setLoading] = useState(false);
    const [invalid, setInvalid] = useState<any>();
    const [errorMessages, setErrorMessages] = useState<any>();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const dispatch = useDispatch();
    const [, , removeCookie] = useCookies(["userType_v2"]);
    const [, , loggedIn_v2] = useCookies(["loggedIn_v2"]);

    const logout = async () => {
        try {
            removeCookie("userType_v2");
            loggedIn_v2("loggedIn_v2");
            router.push("/");
            await dispatch(removeUserDetails());
            await dispatch(deleteAllMessages());
        } catch (err: any) {
            console.error(err);
        }
    };

    const Updatepassword = async (e: any) => {
        setInvalid(false);
        setLoading(true);
        e.preventDefault();
        setErrorMessages({});
        try {
            var requestOptions: any = {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: accessToken,
                },
                body: JSON.stringify({
                    password: password,
                    confirm_password: confirmpassword,
                }),
            };

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/users/update-password`,
                requestOptions
            );
            const res = await response.json();
            if (response.status == 200 || response.status == 201) {
                try {

                    logout()

                    await dispatch(removeUserDetails());
                    await dispatch(deleteAllMessages());
                } catch (err: any) {
                    console.error(err);
                }
            }
            if (response.status == 422) {
                setErrorMessages(res.errors);
                setLoading(false);
                throw res;
            } else if (response.status === 401) {
                setInvalid(res.message);
            }
            if (response.status == 400) {
                setInvalid(res.message);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };
    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword((prevShowPassword) => !prevShowPassword);
    };

    return (

        <div className={styles.updatedPasswordContainer}>
            <form noValidate onSubmit={Updatepassword} style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gridColumnGap: "2.5rem", alignItems: "flex-start", width: "75%" }}>
                <div className={styles.singleFarmBlock}>
                    <TextField
                        placeholder="New Password"
                        name="new password"
                        sx={{
                            // "& .MuiInputBase-root": {
                            //     background: "",
                            // },
                            "& .MuiInputBase-input": {
                                padding: "8px 14px",
                                height: "inherit",
                                fontFamily: "'Inter', sans-serif",
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#B4C1D6 !important",
                            },
                            width: "100%"
                        }}

                        size="small"
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
                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <ErrorMessagesComponent errorMessage={errorMessages?.password} />
                </div>
                <div className={styles.singleFarmBlock}>
                    <TextField
                        placeholder="Confirm Password"
                        name="confirm password"
                        sx={{
                            width: "100%",
                            // "& .MuiInputBase-root": {
                            //     background: "#fff",
                            // },
                            "& .MuiInputBase-input": {
                                padding: "8px 14px",
                                height: "inherit",
                                fontFamily: "'Inter', sans-serif",
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#B4C1D6 !important",
                            },
                        }}
                        size="small"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmpassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setErrorMessages(null);
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={toggleConfirmPasswordVisibility}
                                        edge="end"
                                    >
                                        {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <ErrorMessagesComponent
                        errorMessage={errorMessages?.confirm_password}
                    />
                    {invalid ? (
                        <div style={{ marginTop: "0.5rem" }}>
                            <p style={{ margin: "0", color: "red" }}>{invalid}</p>
                        </div>
                    ) : (
                        ""
                    )}
                </div>
                <div className={styles.buttonGrp}>
                    <Button
                        className={styles.cancelBtn}
                        variant="outlined"
                        fullWidth
                        onClick={() => {
                            setChangePassword(false)
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        className={styles.saveBtn}
                        variant="contained"
                        fullWidth
                        type="submit"
                    >
                        Update
                    </Button>
                </div>

            </form>
            <LoadingComponent loading={loading} />

        </div>
    );
}
