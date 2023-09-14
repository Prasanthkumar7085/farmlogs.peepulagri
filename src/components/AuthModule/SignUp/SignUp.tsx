import { Button, CircularProgress, TextField, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useState } from "react";
import getOtpService from "../../../../lib/services/AuthServices/getOtpService";
import styles from "./SignUp.module.css";
import ImageComponent from "../../../components/Core/ImageComponent";
import { setOtpCountDown } from "@/Redux/Modules/Otp";
import { useDispatch } from "react-redux";

const SignUp = () => {

    const router = useRouter();

    const dispatch = useDispatch();

    const [mobile, setMobile] = useState<string>();
    const [errorMessages, setErrorMessages] = useState<string>();
    const [loadingWhileGettingOtp, setLoadingWhileGettingOtp] = useState(false);
    const [responseErrorMesaages, setResponseErrorMessages] = useState<any>();

    const setMobileNumber = (e: ChangeEvent<HTMLInputElement>) => {

        let value = e.target.value;
        value = value.trim();;
        if (value.length <= 10) {
            setMobile(value)
        }
    }

    const handleKeyPress = (event: any) => {
        const keyPressed = event.key;
        const allowedCharacters = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

        if (!allowedCharacters.includes(keyPressed)) {
            event.preventDefault();
        }
    };


    const getOtp = async (e: FormEvent<HTMLFormElement>) => {
        setLoadingWhileGettingOtp(true);
        setErrorMessages('');
        setResponseErrorMessages({})
        e.preventDefault();
        const body = {
            phone: mobile
        }

        const response = await getOtpService(body);

        if (response?.success) {
            dispatch(setOtpCountDown(59));
            router.push({
                pathname: "/signup-verify",
                query: { mobile: mobile }
            });
        } else if (response?.status == 422) {
            setResponseErrorMessages(response?.errors)
        } else {
            setErrorMessages('Login Failed')
        }

        setLoadingWhileGettingOtp(false);
    }

    return (
        <div id={styles.loginPage}>
            <div className={styles.bgImage}>
                <img src="/login-bg.webp" alt="Bg Image" />
            </div>
            <form onSubmit={getOtp} className={styles.formCard}>
                <div className={styles.innerWrap}>
                    <div className={styles.header}>
                        <ImageComponent src="./Logo-color.svg" width="90" height="70" />
                        <span className={styles.content}>
                            <Typography variant="h5">
                                Welcome!
                            </Typography>
                            <Typography component="p">
                                Please enter your details
                            </Typography>
                        </span>
                    </div>
                    <div>
                        <Typography className={styles.label}>
                            Login with Mobile Number
                        </Typography>
                        <label  ></label>
                        <TextField
                            type='tel'
                            fullWidth
                            error={Boolean(responseErrorMesaages?.phone)}
                            helperText={responseErrorMesaages?.phone}
                            value={mobile}
                            size="small"
                            placeholder="9866xxxxxx"
                            onChange={setMobileNumber}
                            onKeyPress={handleKeyPress}
                            className={styles.phoneNo}
                            onKeyDown={(e: any) => { if (e.key == 'Enter') getOtp(e) }}
                        />
                    </div>
                    
                    <Button className={styles.cta_button} type='submit' size="large" variant="contained">
                        {loadingWhileGettingOtp ?
                            <CircularProgress size="1.5rem" sx={{ color: "white" }} />
                            : "Login"}
                    </Button>
                </div>
            </form>


        </div >
    )
}

export default SignUp;