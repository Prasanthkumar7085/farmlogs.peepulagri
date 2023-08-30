import { Button, TextField, Typography } from "@mui/material";
import { ChangeEvent, useState } from "react";
import loginService from "../../../lib/services/AuthServices/loginService";
import LoadingComponent from "../Core/LoadingComponent";
import setCookie from "../../../lib/CookieHandler/setCookie";
import getAllFarmsService from "../../../lib/services/FarmsService/getAllFarmsService";
import { useRouter } from "next/router";

const Login = () => {

    const router = useRouter();

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);


    const login = async () => {
        setLoading(true);
        try {
            let response = await loginService({ email: email, password: password });
            console.log(response);

            if (response.success) {
                setCookie();
                let response = await getAllFarmsService();
                const id = response.data[0]._id;
                router.push('/farm/${id}/logs');

            }
        } catch (err: any) {
            console.error(err);
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ display: "flex", padding: '50px', justifyContent: "center" }}>

            <div style={{
                display: "flex",
                flexDirection: "column",
                border: "3px solid #315dca",
                width: "300px",
                height: "250px",
                padding: "5%",
                paddingTop: "5%",
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
                </div>
                <div style={{ width: "100%" }}>
                    <Typography>Password</Typography>
                    <TextField
                        type={'password'}
                        value={password}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                        fullWidth
                        placeholder="Enter Password"
                    />
                </div>
                <Button onClick={login}>Login</Button>
            </div>

            <LoadingComponent loading={loading} />
        </div>
    )
}


export default Login;