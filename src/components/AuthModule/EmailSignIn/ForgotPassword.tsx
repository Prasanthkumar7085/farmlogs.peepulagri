import { Button, Card, CircularProgress, IconButton, InputAdornment, Snackbar, Stack, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import ErrorMessagesComponent from '@/components/Core/ErrorMessagesComponent';
import styles from "../SignUp/SignUp.module.css";
import EditIcon from '@mui/icons-material/Edit';
import OtpInput from 'react18-input-otp';
import ClearIcon from '@mui/icons-material/Clear';
import MuiAlert from '@mui/material/Alert';
import LoadingComponent from '@/components/Core/LoadingComponent';



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
    const [alertMessage, setAlertMessage] = useState<string>('');
    const [alertType, setAlertType] = useState<boolean>(false);


    const RequestOtp = async () => {
        setInvalid(false);
        setButtonLoading(true);

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
                setTimeRemaining(30)
                setOtpVisible(true)
                setEditEmail(false)
                setAlertMessage(res.message)
                setAlertType(true)
            }
            if (response.status == 422) {
                setErrorMessages(res.errors);
                setButtonLoading(false);
                throw res;
            }
            else if (response.status === 401) {
                setInvalid(res.message);

            }

        } catch (err) {
            console.error(err);
        }
        finally {
            setButtonLoading(false);
        }
    };

    const VerifyOtp = async (e: any) => {
        setOtpInvalid(false);
        setLoading(true);
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
                router.push({
                    pathname: "/forgot-password/update-password",
                    query: { email: email }
                });
            }
            if (response.status == 422 || response.status == 400) {
                setOtpErrorMesseges(res);
                setLoading(false);
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


    const timer = () => {
        let timerInterval: any;

        if (timeRemaining > 0) {
            timerInterval = setInterval(() => {
                setTimeRemaining(prevTime => prevTime - 1);
            }, 1000);
        } else {
            clearInterval(timerInterval); // Clear the interval when timer reaches zero
        }

        return () => {
            clearInterval(timerInterval); // Clear the interval when component unmounts
        };
    }
    useEffect(() => {
        timer();
    }, []);
    return (
        <div id={styles.loginPage}>
            <div className={styles.bgImage}>
                <img src="/login-bg.webp" alt="Bg Image" />
            </div>

            <form noValidate className={styles.formCard}>
                <div className={styles.innerWrap}>
                    <div>
                        <div style={{ display: "flex", alignItems: "flex-start" }}>
                            <TextField
                                className={styles.phoneNo}
                                placeholder='Email'
                                sx={{ width: "100%" }}
                                disabled={!editEmail}
                                size='small'
                                name="email"
                                type={"text"}
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value)
                                    setErrorMessages(null)
                                }}
                            />
                            <IconButton onClick={() => {
                                setEditEmail(true)
                            }}>
                                < EditIcon />
                            </IconButton>

                        </div>
                        <ErrorMessagesComponent errorMessage={errorMessages?.email} />
                        {invalid ?
                            <p style={{ margin: "0", color: "red" }}>{invalid}</p> : ""}
                        {/* {otpsentsuccess ?
                            <p style={{ margin: "0", color: "green" }}>{otpsentsuccess}</p> : ""} */}
                        {otpvisible && !editEmail ?
                            <Typography>{"Didn't you receive the OTP?"}
                                {timeRemaining > 0
                                    ? ` Resend  in: ${timeRemaining} seconds`
                                    : (
                                        <span
                                            style={{ color: "#06A3AD", cursor: "pointer" }}
                                            onClick={RequestOtp}
                                        >
                                            Resend OTP
                                        </span>
                                    )}
                            </Typography>
                            :
                            <Button
                                className={styles.cta_button}
                                variant="contained"
                                color="primary"
                                onClick={RequestOtp}
                            >
                                {buttonLoading ?
                                    <CircularProgress color="inherit" size={'2rem'} />
                                    : "Request OTP"}
                            </Button>
                        }
                    </div>
                    {otpvisible && !editEmail ?
                        <div>
                            <OtpInput
                                value={otpvalue}
                                onChange={(e: string) => setOtpValue(e)}
                                numInputs={4}
                                isInputNum
                                shouldAutoFocus
                                inputStyle="otpInputs"
                            />
                            <ErrorMessagesComponent errorMessage={otperrormesseges?.message} />
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
            <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} open={Boolean(alertMessage)} autoHideDuration={3000} onClose={() => setAlertMessage('')}>
                <MuiAlert variant='filled' onClose={() => setAlertMessage('')} severity={`${alertType ? "success" : "error"}`} sx={{ width: '100%' }}>
                    {alertMessage}
                </MuiAlert>
            </Snackbar>
            <LoadingComponent loading={loading} />

        </div>
    );
}

