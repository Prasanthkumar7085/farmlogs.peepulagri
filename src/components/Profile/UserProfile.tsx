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


  //to change the profile pic event
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



  //to capitalize the first letter
  const capitalizeFirstLetter = (string: any) => {
    let temp = string.toLowerCase();
    return temp.charAt(0).toUpperCase() + temp.slice(1);
  };


  return (
    <>
      <div className={styles.summaryHeader} id="header">
        <Image
          src="/mobileIcons/logo-mobile-white.svg"
          alt=""
          width={50}
          height={50}
          onClick={() => router.push("/dashboard")}
        />
        <Typography className={styles.viewFarm}>Profile</Typography>
        <div className={styles.headericon} id="header-icon"></div>
      </div>
      <div className={styles.profile} >

        <div className={styles.profiledetailscontainer}>
          <div className={styles.profiledetailscontainer}>
            <div className={styles.container}>
              <Image className={styles.imageIcon} width={140} height={140} alt="" src={data?.url} />
              <div className={styles.uploadimage}>
                <label style={{ height: "20px" }}>
                  <Image alt="" src="/camera-1.svg" width={20} height={20} />
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
            <div className={styles.name}>
              <h1 className={styles.mittalAakarshana}> {data?.name ? capitalizeFirstLetter(data?.name) : "-"}</h1>
              <div className={styles.role}>
                <p className={styles.centralTeam}>{data?.user_type ? capitalizeFirstLetter(data?.user_type) : "-"}</p>
              </div>
            </div>
          </div>
          <div className={styles.contactdetails}>
            <div className={styles.phonedetails}>
              <div className={styles.lable}>
                <label className={styles.lable1}>Phone</label>
              </div>
              <h2 className={styles.phone}>{data?.phone ? data?.phone : "-"}</h2>
            </div>
            <div className={styles.phonedetails}>
              <div className={styles.lable}>
                <label className={styles.lable3}>Email</label>
              </div>
              <h2 className={styles.phone}>{data?.email ? data?.email : "-"}</h2>
            </div>
          </div>
        </div>
        <div className={styles.optionscontainer}>
          <div className={styles.editprofile} onClick={() => {
            router.push("/profile/user/edit")
          }}>
            <Image className={styles.camera1Icon} width={20} height={20} alt="" src="/editicon.svg" />
            <p className={styles.editProfile}>Edit Profile</p>
          </div>
          <Image
            className={styles.optionscontainerChild}
            alt=""
            src="/line-30@2x.png"
            width={100}
            height={1}
          />
          {/* <div className={styles.editprofile} onClick={() => {
            router.push("/profile/update-password")
          }}>
            <Image className={styles.camera1Icon} width={20} height={20} alt="" src="/passwordicon.svg" />
            <p className={styles.editProfile}>{`Change Password `}</p>
          </div> */}
          <Image
            className={styles.optionscontainerChild}
            alt=""
            src="/line-30@2x.png"
            width={100}
            height={1}
          />
          <div className={styles.logout} onClick={() => {
            logout()

          }}>
            <Image className={styles.camera1Icon} width={20} height={20} alt="" src="/logouticon.svg" />
            <p className={styles.editProfile}>Log Out</p>
          </div>
        </div>
        <LoadingComponent loading={loading} />
      </div>
    </>
  );
};
export default UserProfile;