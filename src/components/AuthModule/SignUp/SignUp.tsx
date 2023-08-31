import { Button, TextField } from "@mui/material";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useState } from "react";

const SignUp = () => {

    const [name, setName] = useState<string>();
    const [email, setEmail] = useState<string>();
    const [mobile, setMobile] = useState<string>();


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

    const router = useRouter();
    const getOtp = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.push({
            pathname: "/signup-verify",
            query: { mobile: mobile }
        });

    }

    return (
        <div style={{ display: "flex", justifyContent: "center", padding: '5%' }}>
            <form onSubmit={getOtp} style={{ minWidth: "100%", display: "flex", justifyContent: "center" }}>
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: '2% 5% 5% 5%', border: "2px solid", borderRadius: "10px", gap: "20px", width: "300px" }}>
                    <h3>
                        Login with OTP
                    </h3>
                    <div>
                        <label>Name</label>
                        <TextField
                            required
                            fullWidth
                            value={name}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Email</label>
                        <TextField
                            required
                            fullWidth
                            value={email}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Mobile</label>
                        <TextField
                            required
                            fullWidth
                            value={mobile}
                            onChange={setMobileNumber}
                            onKeyPress={handleKeyPress}
                        />
                    </div>
                    <Button type='submit' variant="contained">
                        Login
                    </Button>
                </div>
            </form>


        </div >
    )
}

export default SignUp;