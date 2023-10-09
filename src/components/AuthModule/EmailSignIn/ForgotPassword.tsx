import { Button, Card, CircularProgress, Grid, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import ErrorMessagesComponent from '@/components/Core/ErrorMessagesComponent';
import setCookie from '../../../../lib/CookieHandler/setCookie';
import styles from "../SignUp/SignUp.module.css";
import EditIcon from '@mui/icons-material/Edit';
import OtpInput from 'react18-input-otp';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState<any>();
    const [loading, setLoading] = React.useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessages, setErrorMessages] = useState<any>();
    const [invalid, setInvalid] = useState<any>();
    const [otpvisible, setOtpVisible] = useState(false);
    const [otpvalue, setOtpValue] = useState("");
    const [otpinvalid, setOtpInvalid] = useState<any>();
    const [otperrormesseges, setOtpErrorMesseges] = useState<any>();
    const router = useRouter();
    const RequestOtp = async (e: any) => {
        setInvalid(false);
        setLoading(true);
        try {
            var requestOptions: any = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                }),
            };

            const response = await fetch(`https://peepul-agri-production.up.railway.app/v1.0/users/forgot-password`, requestOptions)
            const res = await response.json();
            if (response.status == 200 || response.status == 201) {
                setOtpVisible(true)
            }
            if (response.status == 422) {
                setErrorMessages(res.errors);
                setLoading(false);
                throw res;
            }
            else if (response.status === 401) {
                setInvalid(res.message);

            }

        } catch (err) {
            console.error(err);
        }
        finally {
            setLoading(false);
        }
    };

    const VerifyOtp = async (e: any) => {
        setOtpInvalid(false);
        // setLoading(true);
        try {
            var requestOptions: any = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    otp: otpvalue
                }),
            };

            const response = await fetch(`https://peepul-agri-production.up.railway.app/v1.0/users/forgot-password/verify-otp`, requestOptions)
            const res = await response.json();
            if (response.status == 200 || response.status == 201) {
                router.push('/forgot-password/update-password')
            }
            if (response.status == 422) {
                setOtpErrorMesseges(res.errors);
                // setLoading(false);
                throw res;
            }
            else if (response.status === 401) {
                setOtpInvalid(res.message);

            }

        } catch (err) {
            console.error(err);
        }
        finally {
            setLoading(false);
        }
    };
    return (
        <div id={styles.loginPage}>
            <div className={styles.bgImage}>
                <img src="/login-bg.webp" alt="Bg Image" />
            </div>

            <form noValidate className={styles.formCard}>
                <div className={styles.innerWrap}>

                    <div>
                        <TextField
                            className={styles.phoneNo}
                            placeholder='Email'
                            sx={{ width: "100%" }}
                            size='small'
                            name="email"
                            type={"text"}
                            onChange={(e) => {
                                setEmail(e.target.value)
                                // setErrorMessages(null)
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton >
                                            <EditIcon />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <ErrorMessagesComponent errorMessage={errorMessages?.email} />
                        <Button
                            className={styles.cta_button}

                            variant="contained"
                            color="primary"
                            onClick={RequestOtp}
                        >
                            Request OTP
                        </Button>
                    </div>
                    {otpvisible ?
                        <div>

                            <OtpInput
                                value={otpvalue}
                                onChange={(e: string) => setOtpValue(e)}
                                numInputs={4}
                                isInputNum
                                shouldAutoFocus
                                inputStyle="otpInputs"
                            // errorStyle={Boolean(errorMessages.otp)}
                            />
                            <Button
                                className={styles.cta_button}

                                variant="contained"
                                color="primary"
                                onClick={VerifyOtp}
                            >
                                Verify OTP
                            </Button>
                        </div>
                        : ""}
                </div>
            </form>



        </div>
    );
}
