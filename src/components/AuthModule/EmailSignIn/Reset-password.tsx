import { Button, Card, CircularProgress, Grid, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import ErrorMessagesComponent from '@/components/Core/ErrorMessagesComponent';
import styles from "../SignUp/SignUp.module.css";
import LoadingComponent from '@/components/Core/LoadingComponent';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ImageComponent from '@/components/Core/ImageComponent';

export default function ResetPasswordPage() {

    const router = useRouter();
    const [newpassword, setNewPassword] = useState<any>();
    const [conformpassword, setConformPassword] = useState<any>();
    const [loading, setLoading] = useState(false);
    const [invalid, setInvalid] = useState<any>();
    const [errorMessages, setErrorMessages] = useState<any>();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [resetSuccess, setResetSuccess] = useState(false);

    const Resetpassword = async (e: any) => {
        setInvalid(false);
        setLoading(true);
        e.preventDefault();
        const email = localStorage.getItem("email");
        try {
            var requestOptions: any = {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    new_password: newpassword,
                    confirm_password: conformpassword
                }),
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/reset-password`, requestOptions)
            const res = await response.json();
            if (response.status == 200 || response.status == 201) {
                setResetSuccess(true)
                setTimeout(() => {
                    router.push('/')
                }, 5000);
            }
            if (response.status == 422) {
                setErrorMessages(res.errors);
                setLoading(false);
                throw res;
            }
            else if (response.status === 401) {
                setInvalid(res.message);
            }
            if (response.status == 400) {
                setInvalid(res.message)
            }

        } catch (err) {
            console.error(err);
        }
        finally {
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
        <div id={styles.loginPage}>
            <div className={styles.bgImage}>
                <img src="/login-bg.webp" alt="Bg Image" />
            </div>
            {resetSuccess ?
                <div>
                    <div className={styles.formCard}>
                        <div className={styles.innerWrap}>
                            <div style={{ textAlign: "center" }}>
                                <ImageComponent src="/Logo-color.svg" width="100" height="80" />
                                <Typography className={styles.passwordSuccessmg}>Password updated  successfully</Typography>
                            </div>
                            <div className={styles.backToLogin}>
                                <div className={styles.backToLogin_btn} style={{ justifyContent: "flex-start !important" }} onClick={() => router.push('/')}>
                                    <KeyboardBackspaceIcon sx={{ marginRight: "0.5rem" }} />
                                    <Typography>
                                        Back To Login
                                    </Typography>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                :
                <form noValidate className={styles.formCard} onSubmit={Resetpassword}>
                    <div className={styles.innerWrap}>
                        <div className={styles.header}>
                            <ImageComponent src="/Logo-color.svg" width="90" height="70" />
                            <span className={styles.content}>
                                <Typography variant="h5">
                                    Reset Password
                                </Typography>
                                <Typography component="p">
                                    Create new password
                                </Typography>
                            </span>
                        </div>
                        <div>
                            <TextField
                                placeholder='New password'
                                sx={{
                                    width: "100%",
                                    '& .MuiInputBase-root': {
                                        background: "#fff"
                                    }
                                }}
                                size='small'
                                type={showPassword ? "text" : "password"}
                                value={newpassword}
                                onChange={(e) => {
                                    setNewPassword(e.target.value)
                                    setErrorMessages(null)
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
                            <ErrorMessagesComponent errorMessage={errorMessages?.new_password} />

                        </div>
                        <div>
                            <TextField
                                placeholder='Conform password'
                                sx={{
                                    width: "100%",
                                    '& .MuiInputBase-root': {
                                        background: "#fff"
                                    }
                                }}
                                size='small'
                                type={showConfirmPassword ? "text" : "password"}
                                value={conformpassword}
                                onChange={(e) => {
                                    setConformPassword(e.target.value)
                                    setErrorMessages(null)
                                }}

                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={toggleConfirmPasswordVisibility
                                            } edge="end">
                                                {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <ErrorMessagesComponent errorMessage={errorMessages?.confirm_password
                            } />
                            {invalid ?
                                <p style={{ margin: "0", color: "red", fontSize: "12px" }}>{invalid}</p>
                                : ""}
                        </div>
                        <Button className={styles.reset_Btn} variant='contained' fullWidth type='submit'>Save</Button>
                        <div className={styles.backToLogin}>
                            <div className={styles.backToLogin_btn} style={{ justifyContent: "flex-start !important" }} onClick={() => router.push('/')}>
                                <KeyboardBackspaceIcon sx={{ marginRight: "0.5rem" }} />
                                <Typography>

                                    Back To Login
                                </Typography>
                            </div>
                        </div>
                    </div>
                </form>
            }
            <LoadingComponent loading={loading} />

        </div>
    );
}

