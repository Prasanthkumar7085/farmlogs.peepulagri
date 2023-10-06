import { Button, Card, CircularProgress, Grid, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import ErrorMessagesComponent from '@/components/Core/ErrorMessagesComponent';
import setCookie from '../../../../lib/CookieHandler/setCookie';



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

            const response = await fetch(`https://peepul-agri-production.up.railway.app/v1.0/users/signin`, requestOptions)
            console.log(response.status);

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

    return (
        <div>
            <Card>
                <Grid container >
                    <Grid item xs={12} md={5}>
                        <div>
                            <Typography component="h1" variant="h5">
                                Sign in
                            </Typography>
                            <form noValidate >
                                <div>
                                    <TextField
                                        sx={{ marginTop: "1rem", width: "100%" }}
                                        name="username"
                                        label="Username"
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
                                        sx={{ width: "100%" }}
                                        name="password"
                                        label="Password"
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

                                </div>
                                {invalid ?
                                    <p style={{ color: "red" }}>
                                        {invalid}
                                    </p>
                                    : ""
                                }
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSubmit}
                                >
                                    {loading ?
                                        <CircularProgress /> : "Sign In"}
                                </Button>
                            </form>
                        </div>
                    </Grid>
                </Grid>
            </Card>
        </div>
    );
}





