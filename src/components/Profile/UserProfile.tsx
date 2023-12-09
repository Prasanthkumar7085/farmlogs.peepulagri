import { removeUserDetails } from "@/Redux/Modules/Auth";
import { deleteAllMessages } from "@/Redux/Modules/Conversations";
import { Avatar, Button, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import styles from "./userProfile.module.css"
import LoadingComponent from "../Core/LoadingComponent";

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
        <div>
            <div className={styles.summaryHeader} id="header" >
                <img src="/mobileIcons/logo-mobile-white.svg" alt="" width={"50px"} onClick={() => router.push("/dashboard")} />
                <Typography className={styles.viewFarm}>Profile</Typography>
                <div className={styles.headericon} id="header-icon">
                </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "1rem", paddingTop: "5rem", gap: "6rem" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ border: "1px solid #D94841", padding: "5px", borderRadius: "50%", width: "130px", }}>
                        <Avatar
                            alt="Remy Sharp"
                            sx={{ width: 130, height: 130, fontWeight: "700", fontSize: "2.4rem", color: "#D94841", background: "#f5e7d6" }}
                        >
                            {data?.name.slice(0, 1)}
                        </Avatar>
                    </div>
                    <div className={styles.userDetails}>
                        <Typography variant="h6">{data?.name ? data?.name : "-"}</Typography>
                        <Typography >{data?.email ? data?.email : "-"}</Typography>

                    </div>
                </div>
                <Button fullWidth className={styles.logOutBtn} variant="outlined" onClick={logout}><img src="/mobileIcons/summary/sign-out-light.svg" alt="" width={"20px"} /> Log out</Button>

            </div>
            <LoadingComponent loading={loading} />
        </div >
    )
}
export default UserProfile;