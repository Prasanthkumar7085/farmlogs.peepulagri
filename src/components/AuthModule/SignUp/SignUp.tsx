import { Button, CircularProgress, TextField } from "@mui/material";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useState } from "react";
import getOtpService from "../../../../lib/services/AuthServices/getOtpService";

const SignUp = () => {

    const router = useRouter();

    const [name, setName] = useState<string>();
    const [email, setEmail] = useState<string>();
    const [mobile, setMobile] = useState<string>();
    const [errorMessages, setErrorMessages] = useState<string>();
    const [loadingWhileGettingOtp, setLoadingWhileGettingOtp] = useState(false);

    const setMobileNumber = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.length <= 10) {
            setMobile(e.target.value)
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
        e.preventDefault();
        const body = {
            full_name: name,
            email: email,
            phone: mobile
        }

        const response = await getOtpService(body);
        if (response.success) {
            router.push({
                pathname: "/signup-verify",
                query: { mobile: mobile }
            });
        } else {
            setErrorMessages('Login Failed')
        }

        setLoadingWhileGettingOtp(false);
    }

    return (
        <div style={{ display: "flex", justifyContent: "center", padding: '5%' }}>
            <form onSubmit={getOtp} style={{ minWidth: "100%", display: "flex", justifyContent: "center" }}>
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: '2% 5% 5% 5%', border: "2px solid", borderRadius: "10px", gap: "20px", width: "400px" }}>
                    <h3>
                        Login with OTP
                    </h3>
                    <div>
                        <label>Name</label>
                        <TextField
                            fullWidth
                            value={name}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                            onKeyDown={(e: any) => { if (e.key == 'Enter') getOtp(e) }}
                        />
                    </div>
                    <div>
                        <label>Email</label>
                        <TextField
                            fullWidth
                            value={email}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                            onKeyDown={(e: any) => { if (e.key == 'Enter') getOtp(e) }}
                        />
                    </div>
                    <div>
                        <label>Mobile</label>
                        <TextField
                            fullWidth
                            value={mobile}
                            onChange={setMobileNumber}
                            onKeyPress={handleKeyPress}
                            onKeyDown={(e: any) => { if (e.key == 'Enter') getOtp(e) }}
                        />
                    </div>
                    {errorMessages ?
                        <p style={{ color: "red" }}>
                            {errorMessages}
                        </p>
                        : ""}
                    <Button type='submit' variant="contained">
                        {loadingWhileGettingOtp ?
                            <CircularProgress size="1.5rem" sx={{ color: 'white' }} />
                            : 'Login'}
                    </Button>
                </div>
            </form>


        </div >
    )
}

export default SignUp;