import { Button, Card, CircularProgress, Grid, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import ErrorMessagesComponent from '@/components/Core/ErrorMessagesComponent';
import setCookie from '../../../../lib/CookieHandler/setCookie';
import styles from "../SignUp/SignUp.module.css";



export default function SigninEmail() {
    const [email, setEmail] = useState<any>();
    const [password, setPassword] = useState<any>();
    const [loading, setLoading] = React.useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessages, setErrorMessages] = useState<any>();
    const [invalid, setInvalid] = useState<any>();
    const router = useRouter();

    const signInForm = async (e: any) => {
        setInvalid(false);
        setLoading(true);
        try {
            var requestOptions: any = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password
                }),
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/signin`, requestOptions)
            const res = await response.json();
            if (response.status == 200 || response.status == 201) {
                await setCookie();
                router.push(`/farm`);
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

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        signInForm({
            email,
            password
        });
    }

    const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };
    const forgotButton = () => {
        router.push('/forgot-password');
    }
    return (
        <div id={styles.loginPage}>
            <div className={styles.bgImage}>
                <img src="/login-bg.webp" alt="Bg Image" />
            </div>



            <form noValidate className={styles.formCard}>
                <div className={styles.innerWrap}>
                    <div className={styles.header}>
                        <Typography variant="h5" sx={{ whiteSpace: "nowrap" }}>
                            Sign in
                        </Typography>
                    </div>
                    <div>
                        <TextField
                            // className={styles.phoneNo}
                            placeholder='Email'
                            sx={{
                                width: "100%",
                                '& .MuiInputBase-root': {
                                    background: "#fff"
                                }
                            }}
                            size='small'
                            name="email"
                            type={"text"}
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value)
                                setErrorMessages(null)
                            }}
                        />
                        <ErrorMessagesComponent errorMessage={errorMessages?.email} />
                    </div>
                    <div>
                        <TextField
                            sx={{
                                width: "100%",
                                // '& .MuiOutlinedInput-notchedOutline': {
                                //     background: "#fff !important"
                                // },
                                // '& .MuiButtonBase-root': {
                                //     zIndex: "1 !important"
                                // }
                                '& .MuiInputBase-root': {
                                    background: "#fff"
                                }
                            }}
                            size='small'
                            // className={styles.phoneNo}
                            placeholder='Password'
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                        <Button onClick={forgotButton} >
                            Forgot Password
                        </Button>

                    </div>
                    {invalid ?
                        <p style={{ color: "red", margin: "0" }}>
                            {invalid}
                        </p>
                        : ""
                    }
                    <Button
                        className={styles.cta_button}
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                    >
                        {loading ?
                            <CircularProgress /> : "Sign In"}
                    </Button>
                </div>
            </form>



        </div>
    );
}
