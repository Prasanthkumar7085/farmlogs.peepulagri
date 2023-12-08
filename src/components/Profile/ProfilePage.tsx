import { Button, Grid, Typography } from "@mui/material";
import styles from "./ProfilePage.module.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";


const ProfilePage = () => {

    const router = useRouter();

    const accessToken = useSelector(
        (state: any) => state.auth.userDetails?.access_token
    );
    const [loading, setLoading] = useState<any>()
    const [data, setData] = useState<any>()

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
        if (router.isReady) {
            getProfile()
        }
    }, [router.isReady])
    return (
        <div className={styles.profilePage}>
            <div >
                <Typography variant="h5">My Profile</Typography>
                <Grid container rowSpacing={2}>
                    <Grid item xs={12} sx={{ display: "flex", alignItems: "center", gap: "2rem" }}>
                        <Typography variant="h6">Full Name :</Typography>
                        <Typography>{data?.name ? data?.name : "-"}</Typography>
                    </Grid>
                    <Grid item xs={12} sx={{ display: "flex", alignItems: "center", gap: "2rem" }}>
                        <Typography variant="h6">Email :</Typography>
                        <Typography>{data?.email ? data?.email : "-"}</Typography>
                    </Grid>
                    <Grid item xs={12} sx={{ display: "flex", alignItems: "center", gap: "2rem" }}>
                        <Typography variant="h6">Mobile Number :</Typography>
                        <Typography>{data?.phone ? data?.phone : "-"}</Typography>
                    </Grid>
                    <Grid item xs={12} sx={{ display: "flex", alignItems: "center", gap: "2rem" }}>
                        <Typography variant="h6">User Type :</Typography>
                        <Typography>{data?.user_type ? data?.user_type : "-"}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" onClick={() => router.push('/profile/update-password')}>Update Password</Button>
                    </Grid>
                </Grid>
            </div>
        </div>
    );
}

export default ProfilePage;