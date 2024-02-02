import { Avatar, Button, Grid, TextField, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import LoadingComponent from "../Core/LoadingComponent";
import styles from "./ProfilePage.module.css";
import Image from "next/image";
import { toast } from "sonner";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import editProfileService from "../../../lib/services/AuthServices/editProfileService";
import ErrorMessages from "../Core/ErrorMessages";

const ProfilePage = () => {
  const router = useRouter();

  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );
  const [loading, setLoading] = useState<any>();
  const [data, setData] = useState<any>();
  const [editProfile, setEditProfile] = useState<boolean>(false)
  const [full_name, setFullName] = useState<any>()
  const [email, setEmail] = useState<any>()
  const [phone, setPhone] = useState<any>()
  const [errorMessages, setErrorMessages] = useState<any>({});

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
        setFullName(responseData?.data?.name)
        setEmail(responseData?.data?.email)
        setPhone(responseData?.data?.phone)
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



  //to capitalize the first letter
  const capitalizeFirstLetter = (string: any) => {
    let temp = string?.toLowerCase();
    return temp?.charAt(0).toUpperCase() + temp?.slice(1);
  };

  //edit profile event
  const editProfileEvent = async () => {
    let body = {
      name: full_name,
      phone: phone,
      email: email
    }
    setLoading(true)
    try {
      const response = await editProfileService({ body, accessToken })
      if (response.success) {
        setEditProfile(false)
        setErrorMessages({})
        getProfile();
        toast.success(response.message)
      }
      else if (response.status == 422) {
        setErrorMessages(response.errors)
      }
      else {
        toast.error(response.message)
      }
    }
    catch (err) {
      console.error(err)

    }
    finally {
      setLoading(false)

    }
  }

  //phone number textfeild
  const handleInput = (event: any) => {
    const value = event.target.value.replace(/\D/g, '');
    event.target.value = value.slice(0, 10);
  };

  return (
    <div className={styles.profilecontainer}>
      <div className={styles.header}>
        <div className={styles.banner}>
          <picture>
            <img
              className={styles.backgroundimageIcon}
              alt=""
              src="/backgroundimage@2x.png"
            />
          </picture>
        </div>
        <div className={styles.profileimagecontainer}>
          <div className={styles.profileimage}>
            <Image
              height={130}
              width={130}
              className={styles.profileimageChild}
              alt=""
              src={data?.url}
            />

            <div className={styles.uploadaction}>
              <label >
                <Image className={styles.camera1Icon} height={20} width={20} alt="" src="/camera-1.svg" />
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
        </div>
      </div>
      <main className={styles.details}>
        {editProfile ? <section className={styles.profileDetailsEditBlock}>
          <div className={styles.sectionHeaderBlock}>
            <h2 className={styles.heading1}>Edit Personal info</h2>
            <div className={styles.buttonGrp}>
              <Button
                className={styles.cancelBtn}
                disableElevation={true}
                variant="text"
                onClick={() => {
                  setEditProfile(false)
                }}
              >
                Cancel
              </Button>
              <Button
                className={styles.saveBtn}
                disableElevation={true}
                variant="contained"
                onClick={() => {
                  editProfileEvent()
                }}
              >
                Save
              </Button>
            </div>
          </div>
          <div className={styles.textfieldsgroup}>
            <div className={styles.eachDetailGrp}>
              <label className={styles.lable1}>First Name<span style={{ color: "red" }}>*</span></label>
              <TextField
                fullWidth
                placeholder="Full Name"
                variant="outlined"
                sx={{ "& .MuiInputBase-root": { height: "38px" } }}
                value={full_name}
                onChange={(e) => setFullName(e.target.value)}
              />
              <ErrorMessages
                errorMessages={errorMessages}
                keyname={"name"}
              />
            </div>
            <div className={styles.eachDetailGrp}>
              <label className={styles.lable1}>Email<span style={{ color: "red" }}>*</span></label>
              <TextField
                fullWidth
                placeholder="Email"
                variant="outlined"
                sx={{ "& .MuiInputBase-root": { height: "38px" } }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <ErrorMessages
                errorMessages={errorMessages}
                keyname={"email"}
              />
            </div>
            <div className={styles.eachDetailGrp}>
              <label className={styles.lable1}>Phone</label>
              <TextField
                fullWidth
                placeholder="Phone Number"
                variant="outlined"
                sx={{ "& .MuiInputBase-root": { height: "38px" } }}
                value={phone}
                onInput={handleInput}
                onChange={(e) => setPhone(e.target.value)}
              />
              <ErrorMessages
                errorMessages={errorMessages}
                keyname={"phone"}
              />
            </div>
            <div className={styles.eachDetailGrp}>
              <label className={styles.lable1}>User Type</label>
              <TextField
                fullWidth
                disabled
                placeholder="User Type"
                variant="outlined"
                sx={{ "& .MuiInputBase-root": { height: "38px" } }}
                value={data?.user_type}
              />
            </div>
          </div>
        </section> :
          <section className={styles.profileDetailsViewBlock}>
            <div className={styles.sectionHeaderBlock}>
              <h2 className={styles.heading1}>Personal info</h2>
              <Button
                disableElevation={true}
                variant="outlined"
                onClick={() => {
                  getProfile();
                  setEditProfile(true)
                }}
                startIcon={<Image src="/profile/edit-icon.svg" alt="" width={15} height={15} />}
                className={styles.editBtn}
              >
                Edit Details
              </Button>
            </div>
            <div className={styles.detailsgroup}>
              <div className={styles.eachDetailGrp}>
                <label className={styles.lable1}>Full Name</label>

                <p className={styles.content} style={{ color: "#35353D" }}>{capitalizeFirstLetter(data?.name)}</p>
              </div>
              <div className={styles.eachDetailGrp}>
                <label className={styles.lable1}>Role</label>
                <p className={styles.content} style={{ color: "#FF8D00" }}>{capitalizeFirstLetter(data?.user_type)}</p>
              </div>
              <div className={styles.eachDetailGrp}>
                <label className={styles.lable1}>Email</label>
                <p className={styles.content} style={{ color: "#35353D" }}>{data?.email}</p>
              </div>
              <div className={styles.eachDetailGrp}>
                <label className={styles.lable1}>Mobile Number</label>
                <p className={styles.content} style={{ color: "#35353D", fontWeight: 500 }}>{data?.phone}</p>
              </div>
            </div>
          </section>}
        <div className={styles.password}>
          <div className={styles.passwordBlock}>
            <h2 className={styles.heading1}>Password</h2>
            <Button variant="outlined" className={styles.changePasswordBtn}>Change Password</Button>
          </div>
        </div>
        <div className={styles.logoutBtnBlock}>
          <Button variant="outlined" className={styles.logoutBtn}> <Image src="/profile/sign-out-icon.svg" alt="" width={15} height={15} /> <span>LogOut</span> </Button>
        </div>
      </main>

      <LoadingComponent loading={loading} />
    </div>
  );
};

export default ProfilePage;
