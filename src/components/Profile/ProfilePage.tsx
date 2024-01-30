import { Avatar, Grid, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import LoadingComponent from "../Core/LoadingComponent";
import styles from "./ProfilePage.module.css";
import Image from "next/image";
import { toast } from "sonner";
import CameraAltIcon from '@mui/icons-material/CameraAlt';

const ProfilePage = () => {
  const router = useRouter();

  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );
  const [loading, setLoading] = useState<any>();
  const [data, setData] = useState<any>();

  //get the details of user
  const getProfile = async () => {
    setLoading(true);
    let options = {
      method: "GET",
      headers: new Headers({
        authorization: accessToken,
      }),
    };
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/profile`,
        options
      );
      const responseData = await response.json();
      if (responseData.success) {
        setData(responseData.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: any) => {
    console.log(e.target.files[0])
    uploadProfile(e.target.files[0])
  }
  //upload profile  api event
  const uploadProfile = async (file: any) => {
    setLoading(true)
    let options = {
      method: "POST",
      headers: new Headers({
        'content-type': 'application/json',
        authorization: accessToken,
      }),
      body: JSON.stringify({
        original_name: file?.name,
        type: file.type,
        size: file.size
      })
    };
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/upload-profile`,
        options
      );
      const responseData = await response.json();
      if (responseData.success) {
        toast.success("Profile Updated successfully")
        let preSignedResponse = await fetch(responseData.data.target_url, {
          method: "PUT",
          body: file,
        });
        await getProfile()

      }
      else {
        toast.error("Update Profile Failed!")
      }
    }
    catch (err) {
      console.error(err)
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h5" className={styles.header}>
            My Profile
          </Typography>
          <div
            style={{
              border: "1px solid #D94841",
              padding: "5px",
              borderRadius: "50%",
              width: "130px",
            }}
          >
            {data?.url ?
              <Image
                src={data?.url}
                width={130}
                height={130}
                alt="profile"
                style={{
                  borderRadius: "50%",
                  width: "130px",
                  fontWeight: "700",
                  fontSize: "2.4rem",
                }}
              /> :
              <Avatar
                alt="Remy Sharp"
                sx={{
                  width: 130,
                  height: 130,
                  fontWeight: "700",
                  fontSize: "2.4rem",
                  color: "#D94841",
                  background: "#f5e7d6",
                }}
              >
                {data?.name.slice(0, 1)}

              </Avatar>}

            <label style={{ position: "absolute", right: "32%", top: "27%", backgroundColor: "whitesmoke", cursor: "pointer" }}>
              <CameraAltIcon />
              <input
                type="file"
                alt="images-upload"
                accept="image/*"
                hidden
                onChange={handleChange}
              />
            </label>
          </div>
        </div>
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
};

export default ProfilePage;
