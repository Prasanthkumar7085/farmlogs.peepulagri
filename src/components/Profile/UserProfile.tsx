import { removeUserDetails } from "@/Redux/Modules/Auth";
import { deleteAllMessages } from "@/Redux/Modules/Conversations";
import { Avatar, Button, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";

const UserProfile = () => {
    const router = useRouter();
    const dispatch = useDispatch()

    const accessToken = useSelector(
        (state: any) => state.auth.userDetails?.access_token
    );
    const [loading, setLoading] = useState<any>()
    const [data, setData] = useState<any>()

    const [, , removeCookie] = useCookies(["userType"]);
    const [, , loggedIn] = useCookies(["loggedIn"]);

    const logout = async () => {
        try {
            removeCookie("userType");
            loggedIn("loggedIn");
            router.push("/");
            await dispatch(removeUserDetails());
            await dispatch(deleteAllMessages());
        } catch (err: any) {
            console.error(err);
        }
    };

    //get the details of user
    const getProfile = async () => {
        setLoading(true)
        let options = {
            method: "GET",
            headers: new Headers({
                'authorization': accessToken

            }),
        };
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile`, options);
            const responseData = await response.json();
            if (responseData.success) {
                setData(responseData.data)
            }
        }
        catch (err) {
            console.log(err)
        }
        finally {
            setLoading(false)

        }
    }

    //api call
    useEffect(() => {
        if (router.isReady && accessToken) {
            getProfile()
        }
    }, [router.isReady, accessToken])
    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div>
                <Avatar
                    alt="Remy Sharp"
                    src="/static/images/avatar/1.jpg"
                    sx={{ width: 56, height: 56 }}
                />
            </div>
            <div>
                <Typography variant="caption">{data?.name ? data?.name : "-"}</Typography><br />
                <Typography variant="caption">{data?.email ? data?.email : "-"}</Typography>

            </div>
            <div >
                <Button variant="outlined" onClick={logout}>Log out</Button>
            </div>

        </div>
    )
}
export default UserProfile;