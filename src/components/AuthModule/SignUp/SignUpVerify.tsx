import { Button, CircularProgress, TextField, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import verifyOtpService from "../../../../lib/services/AuthServices/verifyOtpService";
import setCookie from "../../../../lib/CookieHandler/setCookie";
import { setUserDetails } from "@/Redux/Modules/Auth";
import getAllFarmsService from "../../../../lib/services/FarmsService/getAllFarmsService";
import { useDispatch } from "react-redux";


const SignUpVerify = () => {

    const router = useRouter();
    const dispatch = useDispatch()

    const [mobile, setMobile] = useState<string>();
    const [otp, setOtp] = useState<string>('');
    const [errorMessages, setErrorMessages] = useState<any>({});
    const [loadingWhileVerifyingOtp, setLoadingWhileVerifyingOtp] = useState(false);

    useEffect(() => {
        if (router?.isReady) {
            setMobile(router.query.mobile as string);
        }
    }, [router.isReady])

    const verifyOtp = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoadingWhileVerifyingOtp(true)
        const body = {
            phone: mobile,
            otp: otp
        }
        const response = await verifyOtpService(body);
        console.log(response);

        if (response.success) {
            setCookie();
            if ("data" in response) {
                dispatch(setUserDetails(response?.data));
            }
            let accessToken = response.data.access_token;
            if (response?.data?.user_details?.user_type == 'ADMIN') {
                router.replace('/support')
            } else {
                let farmResponse = await getAllFarmsService(accessToken);
                console.log(farmResponse);

                if (farmResponse.success && farmResponse.data && farmResponse?.data.length) {
                    const id = farmResponse?.data[0]?._id;
                    router.replace(`/farm/${id}/logs`);
                } else {
                    router.replace('/farm')
            }
            }

        } else if (response.status == 422) {
            if ("errors" in response) {
                setErrorMessages(response.errors);
            }
        } else if (response.status == 401 || response.status == 409) {
            setErrorMessages({ message: response.message });
        }
        setLoadingWhileVerifyingOtp(false);
    }
    return (
        <div style={{ flexDirection: "row", display: "flex", justifyContent: "center" }}>

            <form onSubmit={verifyOtp}>
                <div style={{ border: "2px solid", display: "flex", flexDirection: "column", minWidth: "400px", padding: "30px", gap: "30px" }}>
                    <Typography>
                        Mobile: {mobile}
                    </Typography>
                <TextField
                        autoFocus
                        fullWidth
                        placeholder="Enter Otp"
                        value={otp}
                        onChange={(e: any) => setOtp(e.target.value)}
                />
                    <p style={{ color: "red" }}>
                        {errorMessages.message}
                    </p>
                    <Button type={'submit'} variant='contained'>
                        {loadingWhileVerifyingOtp ?
                            <CircularProgress size="1.5rem" sx={{ color: 'white' }} />
                            : 'Submit'}
                </Button>
                </div>
            </form>
        </div>
    )
}


export default SignUpVerify;