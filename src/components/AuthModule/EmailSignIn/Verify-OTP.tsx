import { Button, Card, CircularProgress, Grid, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import ErrorMessagesComponent from '@/components/Core/ErrorMessagesComponent';
import setCookie from '../../../../lib/CookieHandler/setCookie';
import styles from "../SignUp/SignUp.module.css";
import EditIcon from '@mui/icons-material/Edit';
import OtpInput from 'react18-input-otp';

export default function VerifyOtpPage() {

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
                            placeholder='New Password'
                            sx={{ width: "100%" }}
                            size='small'
                            name="email"
                            type={"text"}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton edge="end">
                                            <Visibility />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        {/* <ErrorMessagesComponent errorMessage={errorMessages?.email} /> */}

                    </div>
                    <div>
                        <TextField
                            className={styles.phoneNo}
                            placeholder='Conform Password'
                            sx={{ width: "100%" }}
                            size='small'
                            name="email"
                            type={"text"}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {/* <IconButton onClick={togglePasswordVisibility} edge="end">
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton> */}
                                        <IconButton edge="end">
                                            <Visibility />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </div>
                    <Button variant='contained' fullWidth onClick={() => router.push('/farm')}>Update Password</Button>
                </div>
            </form>



        </div>
    );
}
