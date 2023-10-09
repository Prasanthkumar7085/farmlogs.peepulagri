import { Button, Card, CircularProgress, Grid, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import ErrorMessagesComponent from '@/components/Core/ErrorMessagesComponent';
import styles from "../SignUp/SignUp.module.css";

export default function UpdatePasswordPage() {

    const router = useRouter();
    const [newpassword, setNewPassword] = useState<any>();
    const [conformpassword, setConformPassword] = useState<any>();
    const [loading, setLoading] = useState(false);
    const [invalid, setInvalid] = useState<any>();
    const [errorMessages, setErrorMessages] = useState<any>();
    const { email } = router.query

    const Updatepassword = async (e: any) => {
        setInvalid(false);
        setLoading(true);
        try {
            var requestOptions: any = {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJAZ21haWwuY29tIiwiaWQiOiI2NGYxM2YzMzE0ZWNiYjg1NmQyZjEyNDQiLCJwaG9uZSI6Iis5MTgxNDIyMTE1MjkiLCJ1c2VyX3R5cGUiOiJVU0VSIiwiaWF0IjoxNjk2MzEyNjI4LCJleHAiOjE3MDE0OTY2Mjh9.aq2B4CR33q6GwWFj7Dqn3k7-M7cpQBO5ai97KJBudWs'
                },
                body: JSON.stringify({
                    email: email,
                    password: newpassword,
                    confirmPassword: conformpassword
                }),
            };

            const response = await fetch(`https://peepul-agri-production.up.railway.app/v1.0/users/update-password`, requestOptions)
            const res = await response.json();
            if (response.status == 200 || response.status == 201) {
                router.push('/')
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
    return (
        <div id={styles.loginPage}>
            <div className={styles.bgImage}>
                <img src="/login-bg.webp" alt="Bg Image" />
            </div>

            <form noValidate className={styles.formCard}>
                <div className={styles.innerWrap}>
                    <div className={styles.header}>
                        <Typography variant="h5" sx={{ whiteSpace: "nowrap" }}>
                            Update Password
                        </Typography>
                    </div>
                    <div>
                        <TextField
                            className={styles.phoneNo}
                            placeholder='New Password'
                            sx={{ width: "100%" }}
                            size='small'
                            name="email"
                            type={"text"}
                            value={newpassword}
                            onChange={(e) => {
                                setNewPassword(e.target.value)
                                // setErrorMessages(null)
                            }}
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
                            value={conformpassword}
                            onChange={(e) => {
                                setConformPassword(e.target.value)
                                // setErrorMessages(null)
                            }}
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
                    <Button variant='contained' fullWidth onClick={Updatepassword}>Update Password</Button>
                </div>
            </form>



        </div>
    );
}
