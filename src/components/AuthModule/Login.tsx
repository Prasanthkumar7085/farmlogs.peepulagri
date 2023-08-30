import { Button, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import { ChangeEvent, useState } from "react";
import loginService from "../../../lib/services/AuthServices/loginService";
import LoadingComponent from "../Core/LoadingComponent";
import setCookie from "../../../lib/CookieHandler/setCookie";
import getAllFarmsService from "../../../lib/services/FarmsService/getAllFarmsService";
import { useRouter } from "next/router";
import ErrorMessages from "../Core/ErrorMessages";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useDispatch } from "react-redux";
import { setUserDetails } from "@/Redux/Modules/Auth";
import { AuthResponseDataType, AuthResponseErrorDataType } from "@/types/AuthTypes";
type ResponseData = AuthResponseDataType | AuthResponseErrorDataType;

const Login = () => {

    const router = useRouter();
    const dispatch = useDispatch();

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const [errorMessages, setErrorMessages] = useState<any>({});


    const login = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        try {
            let response: AuthResponseDataType | AuthResponseErrorDataType;
            response = await loginService({ email: email, password: password });

            if (response.success) {
                setCookie();
                if ('data' in response) {
                    dispatch(setUserDetails(response?.data));
                }
                let FarmResponse = await getAllFarmsService();
                const id = FarmResponse.data[0]._id;
                router.push(`/farm/${id}/logs`);
            } else if (response.status == 422) {
                if ('errors' in response) {
                    setErrorMessages(response.errors)
                }

            } else if (response.status == 401) {
                setErrorMessages({ message: response.message })
            }
        } catch (err: any) {
            console.error(err);
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ border: "1px solid", display: "flex", padding: '50px', justifyContent: "center" }}>

            <form onSubmit={login} style={{
                display: "flex",
                flexDirection: "column",
                border: "3px solid #315dca",
                minWidth: "350px",
                height: "300px",
                padding: "3%",
                paddingTop: "50px",
                gap: "30px",
                alignItems: "center",
                borderRadius: "10px"
            }}>
                <div style={{ width: "100%" }}>
                    <Typography>Email</Typography>
                    <TextField
                        value={email}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                        fullWidth
                        placeholder="Enter Email"
                    />
                    <div style={{ minHeight: "25px" }}>
                        <ErrorMessages errorMessages={errorMessages} keyname={'email'} />
                    </div>
                </div>
                <div style={{ width: "100%" }}>
                    <Typography>Password</Typography>
                    <TextField
                        type={showPassword ? "text" : 'password'}
                        value={password}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                        fullWidth
                        placeholder="Enter Password"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                                        {!showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <div style={{ minHeight: "25px" }}>
                        {errorMessages.password ? <ErrorMessages errorMessages={errorMessages} keyname={'password'} /> :
                            <ErrorMessages errorMessages={errorMessages} keyname={'message'} />}
                    </div>
                </div>
                <Button type={'submit'}>Login</Button>
            </form>

            <LoadingComponent loading={loading} />
        </div>
    )
}


export default Login;