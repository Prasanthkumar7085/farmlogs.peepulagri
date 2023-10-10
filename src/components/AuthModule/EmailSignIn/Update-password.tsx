import { Button, Card, CircularProgress, Grid, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import ErrorMessagesComponent from '@/components/Core/ErrorMessagesComponent';
import styles from "../SignUp/SignUp.module.css";
import LoadingComponent from '@/components/Core/LoadingComponent';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

export default function UpdatePasswordPage() {

    const router = useRouter();
    const [newpassword, setNewPassword] = useState<any>();
    const [conformpassword, setConformPassword] = useState<any>();
    const [loading, setLoading] = useState(false);
    const [invalid, setInvalid] = useState<any>();
    const [errorMessages, setErrorMessages] = useState<any>();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [resetSuccess, setResetSuccess] = useState(false);
    const { email } = router.query
    const [timeout, setTimeOut] = useState();
    const Updatepassword = async (e: any) => {
        setInvalid(false);
        setLoading(true);
        e.preventDefault();
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
                }, 3000);
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
                        <Typography sx={{ color: "white" }}>Password updated  successfully</Typography>
                        <Button onClick={() => router.push('/')}>Back to login</Button>
                    </div>
                </div>
                :
                <form noValidate className={styles.formCard} onSubmit={Updatepassword}>
                    <div className={styles.innerWrap}>
                        <Button sx={{ justifyContent: "flex-start !important" }} onClick={() => router.back()}>
                            <KeyboardBackspaceIcon />
                        </Button>
                        <div className={styles.header}>
                            <Typography variant="h5" sx={{ whiteSpace: "nowrap" }}>
                                Reset Password
                            </Typography>
                        </div>
                        <div>
                            <TextField
                                placeholder='Password'
                                sx={{
                                    width: "100%",
                                    '& .MuiInputBase-root': {
                                        background: "#fff"
                                    }
                                }}
                                size='small'
                                name="email"
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
                                placeholder='Conform Password'
                                sx={{
                                    width: "100%",
                                    '& .MuiInputBase-root': {
                                        background: "#fff"
                                    }
                                }}
                                size='small'
                                name="email"
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
                        </div>
                        {invalid ?
                            <p style={{ margin: "0", color: "red" }}>{invalid}</p>
                            : ""}
                        <Button variant='contained' fullWidth type='submit'>Update Password</Button>
                    </div>
                </form>
            }
            <LoadingComponent loading={loading} />

        </div>
    );
}
