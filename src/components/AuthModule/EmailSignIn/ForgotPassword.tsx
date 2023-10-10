import { Button, Card, CircularProgress, Grid, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import ErrorMessagesComponent from '@/components/Core/ErrorMessagesComponent';
import setCookie from '../../../../lib/CookieHandler/setCookie';
import styles from "../SignUp/SignUp.module.css";
import EditIcon from '@mui/icons-material/Edit';
import OtpInput from 'react18-input-otp';
import { useDispatch, useSelector } from 'react-redux';

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
    const [otpsentsuccess, setOtpSentSuccess] = useState();
    const [timeRemaining, setTimeRemaining] = useState(30);
    const router = useRouter();
    const [editEmail, setEditEmail] = useState(false);


    const RequestOtp = async () => {
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
                setTimeRemaining(30)
                setOtpSentSuccess(res.message)
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
    console.log(otpsentsuccess);


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
                router.push({
                    pathname: "/forgot-password/update-password",
                    query: { email: email }
                });
            }
            if (response.status == 422 || response.status == 400) {
                setOtpErrorMesseges(res);
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
                                size='small'
                                name="email"
                                type={"text"}
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value)
                                }}
                            />
                            <IconButton >
                                <EditIcon />
                            </IconButton>
                        </div>
                        <ErrorMessagesComponent errorMessage={errorMessages?.email} />
                        {invalid ?
                            <p style={{ margin: "0", color: "red" }}>{invalid}</p> : ""}
                        {/* {otpsentsuccess ?
                            <p style={{ margin: "0", color: "green" }}>{otpsentsuccess}</p> : ""} */}
                        {otpvisible ?
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
                                Request OTP
                            </Button>
                        }
                        {/* {seconds ? <p style={{ margin: "0", width: "100%", textAlign: "end" }}>Resend in {otpCountDown}s</p> : ""} */}
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
        </div>
    );
}

// ye chota vunnana nee venta lena
// samudramanta na kannullo kaneeti alalavootoonte
// yedari anta na gundello nitturpu segaloutunte
// repu leni choopu nenai shwasa leni aasha nenai migalana
// nuvve nuvve kaavaalantundi pade pade naa praanam
// ninne ninne ventaduthu undi prati kshanam na mounam

// nela vaipu choose neram chesavani
// neeli mabbu nindistunda vaana chinukuni
// gali venta velle maram manukomani
// talli teega bhandistunda malle poovuni
// emanta papam prema preminchadam
// ikanaina chalinchamma vedhinchadam
// chelimai kurise sirivennelava kshanamai karige kalava

// nuvve nuvve kaavaalantundi pade pade naa praanam
// ninne ninne ventaduthu undi prati kshanam na mounam
// ye chota vunnana nee venta lena

// velu patti nadipisthunte chanti papala
// na adugulu adige teeram cheredela
// verevaro choopisthunte naa prati kala
// kanti papa kore swapnam choosedela
// naakkuda choteleni na manasulo
// ninnunchagalana prema yee janmalo
// vetike majili dorike varaku nadipe velugai rava