import { Button, Grid, Typography } from "@mui/material";
import styles from "./ProfilePage.module.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import LoadingComponent from "../Core/LoadingComponent";


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
      if (router.isReady && accessToken) {
        getProfile();
      }
    }, [router.isReady, accessToken]);
    return (
      <div className={styles.profilePage}>
        <div className={styles.profilePageCard}>
          <Typography variant="h5" className={styles.header}>
            My Profile
          </Typography>
          <Grid container className={styles.content}>
            <Grid item xs={12} className={styles.contentGrid}>
              <Typography variant="h6" className={styles.heading}>
                Full Name :
              </Typography>
              <Typography className={styles.value}>
                {data?.name ? data?.name : "-"}
              </Typography>
            </Grid>
            <Grid item xs={12} className={styles.contentGrid}>
              <Typography variant="h6" className={styles.heading}>
                Email :
              </Typography>
              <Typography className={styles.value}>
                {data?.email ? data?.email : "-"}
              </Typography>
            </Grid>
            <Grid item xs={12} className={styles.contentGrid}>
              <Typography variant="h6" className={styles.heading}>
                Mobile Number :
              </Typography>
              <Typography className={styles.value}>
                {data?.phone ? data?.phone : "-"}
              </Typography>
            </Grid>
            <Grid item xs={12} className={styles.contentGrid}>
              <Typography variant="h6" className={styles.heading}>
                User Type :
              </Typography>
              <Typography className={styles.value}>
                {data?.user_type ? data?.user_type : "-"}
              </Typography>
            </Grid>
            {/* <Grid item xs={12}>
                        <Button variant="contained" onClick={() => router.push('/profile/update-password')}>Update Password</Button>
                    </Grid> */}
          </Grid>
        </div>
        <LoadingComponent loading={loading} />
      </div>
    );
}

export default ProfilePage;