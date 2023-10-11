
import { Button, Card, CircularProgress, Grid, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import ErrorMessagesComponent from '@/components/Core/ErrorMessagesComponent';
import LoadingComponent from '@/components/Core/LoadingComponent';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { removeUserDetails } from '@/Redux/Modules/Auth';
import { deleteAllMessages } from '@/Redux/Modules/Conversations';
import { useDispatch, useSelector } from 'react-redux';
import styles from "./ProfilePage.module.css";
export default function UpdatePasswordPage() {
    const router = useRouter();
    const [password, setPassword] = useState<any>();
    const [confirmpassword, setConfirmPassword] = useState<any>();
    const [loading, setLoading] = useState(false);
    const [invalid, setInvalid] = useState<any>();
    const [errorMessages, setErrorMessages] = useState<any>();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const dispatch = useDispatch();

    const Updatepassword = async (e: any) => {
        setInvalid(false);
        setLoading(true);
        e.preventDefault();
        try {
            var requestOptions: any = {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJAZ21haWwuY29tIiwiaWQiOiI2NGYxM2YzMzE0ZWNiYjg1NmQyZjEyNDQiLCJwaG9uZSI6Iis5MTgxNDIyMTE1MjkiLCJ1c2VyX3R5cGUiOiJVU0VSIiwiaWF0IjoxNjk2MzEyNjI4LCJleHAiOjE3MDE0OTY2Mjh9.aq2B4CR33q6GwWFj7Dqn3k7-M7cpQBO5ai97KJBudWs'
                },
                body: JSON.stringify({
                    password: password,
                    confirmPassword: confirmpassword
                }),
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/update-password`, requestOptions)
            const res = await response.json();
            if (response.status == 200 || response.status == 201) {
                try {
                    const responseUserType = await fetch('/api/remove-cookie');
                    if (responseUserType) {
                        const responseLogin = await fetch('/api/remove-cookie');
                        if (responseLogin.status) {
                            router.push('/');
                        } else throw responseLogin;
                    }
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
        <div className={styles.updatePasswordPage}>
            <Card className={styles.formCard}>
                <div className={styles.cardHeader}>
                    <Button sx={{ justifyContent: "flex-start !important" }} onClick={() => router.back()}>
                        <KeyboardBackspaceIcon />
                    </Button>
                    <Typography variant="h5" sx={{ whiteSpace: "nowrap" }}>
                        Update Password
                    </Typography>
                </div>
                <form noValidate onSubmit={Updatepassword}>
                    <div className={styles.inputfield}>
                        <TextField
                            placeholder='Password'
                            sx={{
                                width: "100%",
                                '& .MuiInputBase-root': {
                                    background: "#fff"
                                }
                            }}
                            size='small'
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value)
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
                        <ErrorMessagesComponent errorMessage={errorMessages?.password} />
                    </div>
                    <div className={styles.inputfield}>
                        <TextField
                            placeholder='Conform Password'
                            sx={{
                                width: "100%",
                                '& .MuiInputBase-root': {
                                    background: "#fff"
                                }
                            }}
                            size='small'
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmpassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value)
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
                        <ErrorMessagesComponent errorMessage={errorMessages?.confirmPassword
                        } />
                        {invalid ?
                            <div style={{ marginTop: "0.5rem" }}>
                                <p style={{ margin: "0", color: "red" }}>{invalid}</p>
                            </div>
                            : ""}
                    </div>
                    <Button className={styles.update_Btn} variant='contained' fullWidth type='submit'>Save</Button>
                </form>
            </Card>
            <LoadingComponent loading={loading} />

        </div>
    );
}
