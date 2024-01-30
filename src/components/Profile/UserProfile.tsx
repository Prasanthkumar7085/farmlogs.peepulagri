import { removeUserDetails } from "@/Redux/Modules/Auth";
import { deleteAllMessages } from "@/Redux/Modules/Conversations";
import { Avatar, Button, IconButton, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import LoadingComponent from "../Core/LoadingComponent";
import styles from "./userProfile.module.css";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { toast } from "sonner";
import Image from "next/image";
const UserProfile = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );
  const [loading, setLoading] = useState<any>();
  const [data, setData] = useState<any>();

  const [, , removeCookie] = useCookies(["userType_v2"]);
  const [, , loggedIn_v2] = useCookies(["loggedIn_v2"]);

  const logout = async () => {
    try {
      removeCookie("userType_v2");
      loggedIn_v2("loggedIn_v2");
      router.push("/");
      await dispatch(removeUserDetails());
      await dispatch(deleteAllMessages());
    } catch (err: any) {
      console.error(err);
    }
  };

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
        let preSignedResponse = await fetch(responseData.data.target_url, {
          method: "PUT",
          body: file,
        });
        toast.success("Profile Updated successfully")
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



  //
  return (
    <div>
      <div className={styles.summaryHeader} id="header">
        <img
          src="/mobileIcons/logo-mobile-white.svg"
          alt=""
          width={"50px"}
          onClick={() => router.push("/dashboard")}
        />
        <Typography className={styles.viewFarm}>Profile</Typography>
        <div className={styles.headericon} id="header-icon"></div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "1rem",
          paddingTop: "5rem",
          gap: "6rem",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
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

            <label style={{ position: "absolute", right: "34%", top: "27%", backgroundColor: "whitesmoke" }}>
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
          <div className={styles.userDetails}>
            <Typography variant="h6">
              {data?.name ? data?.name : "-"}
            </Typography>
            <Typography>{data?.email ? data?.email : "-"}</Typography>
          </div>
        </div>
        <Button
          fullWidth
          className={styles.logOutBtn}
          variant="outlined"
          onClick={logout}
        >
          <img
            src="/mobileIcons/summary/sign-out-light.svg"
            alt=""
            width={"20px"}
          />{" "}
          Log out
        </Button>
      </div>
      <LoadingComponent loading={loading} />
    </div>
  );
};
export default UserProfile;