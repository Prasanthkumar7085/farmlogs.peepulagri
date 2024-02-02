import AddLocationDialog from "@/components/Core/AddLocationDialog/AddLocationDialog";
import AlertComponent from "@/components/Core/AlertComponent";
import LoadingComponent from "@/components/Core/LoadingComponent";
import { FarmDataType } from "@/types/farmCardTypes";
import AddIcon from "@mui/icons-material/Add";
import {
    Autocomplete,
    Button,
    CircularProgress,
    TextField,
    Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import styles from "./editProfile.module.css";
import { toast } from "sonner";
import editProfileService from "../../../lib/services/AuthServices/editProfileService";
import getProfileService from "../../../lib/services/AuthServices/getSingleUserDetails";
const EditProfile = () => {
    const router = useRouter();
    const accessToken = useSelector(
        (state: any) => state.auth.userDetails?.access_token
    );
    const [errorMessages, setErrorMessages] = useState<any>();
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<FarmDataType>();
    const [full_name, setFullName] = useState<any>()
    const [email, setEmail] = useState<any>()
    const [phone, setPhone] = useState<any>()

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    //edit profile event
    const editProfile = async (data: any) => {
        let body = {
            name: data.name ? data.name : full_name,
            phone: data?.phone ? data?.phone : phone,
            email: data?.email ? data?.email : email
        }
        setLoading(true)
        try {
            const response = await editProfileService({ body, accessToken })
            if (response.success) {
                router.back()
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

    //get the profile details
    const getProfileDetails = async () => {
        setLoading(true)
        try {
            const response = await getProfileService(accessToken);
            if (response.success) {
                setFullName(response?.data?.name);
                setEmail(response?.data?.email)
                setPhone(response?.data?.phone)
            }

            else {
                toast.error(response?.message)
            }
        }
        catch (err) {
            console.error(err)

        }
        finally {
            setLoading(false)
        }
    }


    useEffect(() => {
        if (router.isReady && accessToken) {
            getProfileDetails()
        }

    }, [accessToken, router.isReady])

    return (
        <div>
            <div className={styles.header} id="header">
                <img
                    className={styles.iconsiconArrowLeft}
                    alt=""
                    src="/iconsiconarrowleft.svg"
                    onClick={() => router.back()}
                />
                <Typography className={styles.viewFarm}>
                    Edit Profile
                </Typography>
                <div className={styles.headericon} id="header-icon"></div>
            </div>
            <form onSubmit={handleSubmit(editProfile)}>
                {!loading ? (
                    <div className={styles.addfarmform} id="add-farm">
                        <div className={styles.formfields} id="form-fields">
                            <div className={styles.farmname} id="farm-name">
                                <div className={styles.label}>Full Name</div>
                                <TextField
                                    sx={{
                                        "& .MuiInputBase-root": {
                                            background: "#fff",
                                        },
                                        "& .MuiInputBase-input": {
                                            padding: "11.5px 14px",
                                            height: "inherit",
                                            fontFamily: "'Inter', sans-serif",
                                        },
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "grey !important",
                                        },
                                    }}
                                    {...register("name")}
                                    name="name"
                                    fullWidth
                                    className={styles.inputfarmname}
                                    size="small"
                                    placeholder="Full Name"
                                    variant="outlined"
                                    error={Boolean(errorMessages?.["name"])}
                                    helperText={
                                        errorMessages?.["name"] ? errorMessages?.["name"] : ""
                                    }
                                    value={full_name}
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                            </div>


                            <div className={styles.farmname} id="farm-name">
                                <div className={styles.label}>Email</div>
                                <TextField
                                    sx={{
                                        "& .MuiInputBase-root": {
                                            background: "#fff",
                                        },
                                        "& .MuiInputBase-input": {
                                            padding: "11.5px 14px",
                                            height: "inherit",
                                            fontFamily: "'Inter', sans-serif",
                                        },
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "grey !important",
                                        },
                                    }}
                                    {...register("email")}
                                    name="email"
                                    fullWidth
                                    className={styles.inputfarmname}
                                    size="small"
                                    placeholder="Email"
                                    variant="outlined"
                                    error={Boolean(errorMessages?.["email"])}
                                    helperText={
                                        errorMessages?.["email"] ? errorMessages?.["email"] : ""
                                    }
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>


                            <div className={styles.farmname} id="farm-name">
                                <div className={styles.label}>Phone</div>
                                <TextField
                                    sx={{
                                        "& .MuiInputBase-root": {
                                            background: "#fff",
                                        },
                                        "& .MuiInputBase-input": {
                                            padding: "11.5px 14px",
                                            height: "inherit",
                                            fontFamily: "'Inter', sans-serif",
                                        },
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "grey !important",
                                        },
                                    }}
                                    {...register("phone")}
                                    name="phone"
                                    fullWidth
                                    className={styles.inputfarmname}
                                    size="small"
                                    placeholder="Phone Number"
                                    variant="outlined"
                                    error={Boolean(errorMessages?.["phone"])}
                                    helperText={
                                        errorMessages?.["phone"] ? errorMessages?.["phone"] : ""
                                    }
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>


                            <div className={styles.buttons}>
                                <Button
                                    className={styles.back}
                                    name="back"
                                    size="medium"
                                    variant="outlined"
                                    onClick={() => router.back()}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className={styles.submit}
                                    color="primary"
                                    name="submit"
                                    variant="contained"
                                    type="submit"
                                >
                                    Submit
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    ""
                )}
                <LoadingComponent loading={loading} />
            </form>
        </div>
    );
};

export default EditProfile;
