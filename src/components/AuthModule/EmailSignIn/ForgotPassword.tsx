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

    const router = useRouter();


    return (
        <div id={styles.loginPage}>
            <div className={styles.bgImage}>
                <img src="/login-bg.webp" alt="Bg Image" />
            </div>

            <form noValidate className={styles.formCard}>
                <div className={styles.innerWrap}>
                    {/* <div className={styles.header}>
                        <Typography variant="h5" sx={{ whiteSpace: "nowrap" }}>
                            Reset Password
                        </Typography>
                    </div> */}
                    <div>
                        <TextField
                            className={styles.phoneNo}
                            placeholder='Email'
                            sx={{ width: "100%" }}
                            size='small'
                            name="email"
                            type={"text"}
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
                        {/* <ErrorMessagesComponent errorMessage={errorMessages?.email} /> */}
                        <Button
                            className={styles.cta_button}

                            variant="contained"
                            color="primary"
                        >
                            Request OTP
                        </Button>
                    </div>
                    <div>

                        <OtpInput
                            // value={otp}
                            // onChange={(e: string) => setOtpValue(e)}
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
                            onClick={() => router.push('/forgot-password/verify-otp')}
                        >
                            Verify OTP
                        </Button>
                    </div>
                </div>
            </form>



        </div>
    );
}
