import { Button, TextField } from "@mui/material";
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
    const [errorMessages, setErrorMessages] = useState<any>({});

    useEffect(() => {
        if (router?.isReady) {
            setMobile(router.query.mobile as string);
        }
    }, [router.isReady])

    const verifyOtp = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const body = {
            phone: mobile,
            otp: "123456"
        }
        const response = await verifyOtpService(body);
        console.log(response);

        if (response.success) {
            setCookie();
            if ("data" in response) {
                dispatch(setUserDetails(response?.data));
            }
            let accessToken = response.data.access_token;
            let farmResponse = await getAllFarmsService(accessToken);
            if (farmResponse.success) {
                const id = farmResponse.data[0]._id;
                router.push(`/farm/${id}/logs`);
            }
        } else if (response.status == 422) {
            if ("errors" in response) {
                setErrorMessages(response.errors);
            }
        } else if (response.status == 401) {
            setErrorMessages({ message: response.message });
        }
    }
    return (
        <div>
            <form onSubmit={verifyOtp}>
                <TextField
                    value={mobile}
                    onChange={(e: any) => setMobile(e.tartget.value)}

                />
                <Button type={'submit'}>
                    Submit
                </Button>
            </form>
        </div>
    )
}


export default SignUpVerify;