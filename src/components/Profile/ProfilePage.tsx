import { Button, Grid, Typography } from "@mui/material";
import styles from "./ProfilePage.module.css";
import { useRouter } from "next/router";


const ProfilePage = () => {
    const router = useRouter();
    return (
        <div className={styles.profilePage}>
            <div >
                <Typography variant="h5">My Profile</Typography>
                <Grid container rowSpacing={2}>
                    <Grid item xs={12} sx={{ display: "flex", alignItems: "center", gap: "2rem" }}>
                        <Typography variant="h6">Email</Typography>
                        <Typography>mfather913@gmail.com</Typography>
                    </Grid>
                    <Grid item xs={12} sx={{ display: "flex", alignItems: "center", gap: "2rem" }}>
                        <Typography variant="h6">Mobile Number</Typography>
                        <Typography>8142211529</Typography>
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