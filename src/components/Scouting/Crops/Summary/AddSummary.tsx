import { removeUserDetails } from "@/Redux/Modules/Auth";
import { deleteAllMessages } from "@/Redux/Modules/Conversations";
import CropsDropDown from "@/components/Core/CropsDropDown";
import FarmsDropDown from "@/components/Core/FarmsDropDown";
import { Alert, AlertTitle, Backdrop, Button, CircularProgress, Snackbar, TextField, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { prepareURLEncodedParams } from "../../../../../lib/requestUtils/urlEncoder";
import ErrorMessagesComponent from "@/components/Core/ErrorMessagesComponent";
import LoadingComponent from "@/components/Core/LoadingComponent";
import styles from "./summary.module.css";
import { LocalizationProvider, MobileDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const AddSummary = () => {
    const router = useRouter();
    const dispatch = useDispatch();


    const accessToken = useSelector(
        (state: any) => state.auth.userDetails?.access_token
    );

    const [, , removeCookie] = useCookies(["userType"]);
    const [, , loggedIn] = useCookies(["loggedIn"]);

    const [loading, setLoading] = useState(false);
    const [comment, setComment] = useState<any>();
    const [date, setDate] = useState<any>();
    const [summaryError, setSummaryError] = useState<any>();
    const [success, setSuccess] = useState<any>();
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [farmOptions, setFarmOptions] = useState<any>()
    const [cropOptions, setCropOptions] = useState<any>()
    const [cropId, setCropId] = useState<any>()
    const [farmId, setFarmID] = useState<any>()
    const [errorMessages, setErrorMessages] = useState<any>()






    const addSummary = async () => {
        setLoading(true);
        setErrorMessages('')

        try {
            let body = {
                farm_id: farmId,
                crop_id: cropId,
                content: comment,
                date: date
            };
            let options = {
                method: "POST",
                headers: new Headers({
                    "content-type": "application/json",
                    authorization: accessToken,
                }),
                body: JSON.stringify(body),
            };

            let response: any = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/crops/day-summary`,
                options
            );
            let responseData = await response.json();

            if (responseData.status == 200) {
                setSuccess(responseData.message);
                setShowSuccessAlert(true);
                setLoading(false);
                router.back()
                setTimeout(() => {
                    setShowSuccessAlert(false);

                }, 1500);
            } else if (responseData.status == 422) {
                setErrorMessages(responseData.errors)

                setShowErrorAlert(true);
                setTimeout(() => {
                    setShowErrorAlert(false);
                }, 1500);
            }

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    //get all farm options api
    const getAllFarmsOptions = async (searchString = "") => {

        try {
            let queryParams: any = {};

            if (searchString) {
                queryParams["search_string"] = searchString
            }
            let options = {
                method: "GET",
                headers: new Headers({
                    authorization: accessToken,
                }),
            };
            let url = prepareURLEncodedParams(
                `${process.env.NEXT_PUBLIC_API_URL}/farms/1/100`,
                queryParams
            );

            let response = await fetch(url, options);
            let responseData: any = await response.json();
            if (responseData.success) {
                setFarmOptions(responseData.data)
            }
        }
        catch (err) {
            console.log(err)
        }
    }

    //get all crops 
    const getAllCropsOptions = async (searchString = "", farmId: "") => {

        try {
            let queryParams: any = {};

            if (searchString) {
                queryParams["search_string"] = searchString
            }
            let options = {
                method: "GET",
                headers: new Headers({
                    authorization: accessToken,
                }),
            };
            let url = prepareURLEncodedParams(
                `${process.env.NEXT_PUBLIC_API_URL}/farms/${farmId}/crops/list`,
                queryParams
            );

            let response = await fetch(url, options);
            let responseData: any = await response.json();
            if (responseData.success) {
                setCropOptions(responseData.data)
            }
        }
        catch (err) {
            console.log(err)
        }
    }
    //get the search value from the farms dropDown
    const getFarmsSearchString = (value: any) => {
        if (value) {
            getAllFarmsOptions(value)
        }
        else {
            getAllFarmsOptions("")
        }
    }
    const onSelectValueFromFarmsDropDown = (value: any) => {

        if (value?._id) {
            getAllCropsOptions("", value?._id)
            setFarmID(value?._id)
        }
        else {
            setCropOptions([])
        }
    }

    //get the values from the crops drop down
    const getCropSearchString = (value: any) => {
        if (value) {
            getAllCropsOptions(value, "")
        }
        else {
            getAllFarmsOptions("")
        }
    }
    const onSelectValueFromCropsDropDown = (value: any) => {
        console.log(value);

        if (value) {
            setCropId(value?._id)
            // getAllCropsOptions("", value._id)
        }
    }
    useEffect(() => {
        if (router.isReady && accessToken) {
            getAllFarmsOptions()
        }
    }, [router.isReady, accessToken])

    const getCurrentDate = () => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };



    return (
        <div>
            <div className={styles.summaryHeader} id="header" >
                <img
                    className={styles.iconsiconArrowLeft}
                    alt=""
                    src="/iconsiconarrowleft.svg"
                    onClick={() => router.back()}
                />
                <Typography className={styles.viewFarm}>Add Summary</Typography>
                <div className={styles.headericon} id="header-icon">
                </div>
            </div>
            <div className={styles.updatedSummaryContainer}>

                <div className={styles.singleFarmBlock}>
                    <Typography variant="h6">Farm</Typography>
                    <FarmsDropDown
                        options={farmOptions}
                        label={"title"}
                        onSelectValueFromFarmsDropDown={onSelectValueFromFarmsDropDown}
                        getFarmsSearchString={getFarmsSearchString}
                    />
                    <ErrorMessagesComponent errorMessage={errorMessages?.farm_id} />
                </div>
                <div className={styles.singleFarmBlock}>

                    <Typography variant="h6">Crop</Typography>

                    <CropsDropDown
                        options={cropOptions}
                        label={"title"}
                        onSelectValueFromCropsDropDown={onSelectValueFromCropsDropDown}
                        getCropSearchString={getCropSearchString}
                    />

                    <ErrorMessagesComponent errorMessage={errorMessages?.crop_id} />
                </div>
                <div className={styles.singleFarmBlock}>

                    <Typography variant="h6">Date</Typography>
                    {/* <TextField
                        type='date'
                        placeholder="Select Date"
                        color="primary"
                        variant="outlined"
                        value={date}
                        sx={{
                            width: "100%", background: "#fff", '& .MuiOutlinedInput-notchedOutline ': {
                                border: "1px solid grey !important",
                                borderRadius: "10px !important"
                            }
                        }}
                        onChange={(e) => {
                            const selectedDate = new Date(e.target.value);
                            const currentDate = new Date();

                            if (selectedDate > currentDate) {
                                return;
                            }

                            setDate(e.target.value);
                            setErrorMessages('');

                        }}
                        inputProps={{ max: getCurrentDate() }}
                    /> */}
                    <LocalizationProvider dateAdapter={AdapterDayjs}>

                        <MobileDatePicker sx={{
                            width: "100%",
                            '& .MuiOutlinedInput-notchedOutline ': {
                                background: "#fff",
                                borderColor: "grey !important",
                                borderRadius: "8px !important"
                            },
                            '& .MuiInputBase-input': {
                                padding: "12px 14px",
                                borderRadius: "10px !important"

                            }
                        }}
                            value={date}

                            format="DD-MM-YYYY"
                            onChange={(e) => {
                                const selectedDate = new Date(e);
                                const currentDate = new Date();
                                console.log(e);
                                if (selectedDate > currentDate) {
                                    return;
                                }

                                setDate(e);
                                setErrorMessages('');

                            }} />
                    </LocalizationProvider>

                    <ErrorMessagesComponent errorMessage={errorMessages?.date} />
                </div>
                <div className={styles.singleFarmBlock}>

                    <Typography variant="h6">Comment</Typography>
                    <TextField
                        color="primary"
                        name="desciption"
                        id="description"
                        minRows={5}
                        maxRows={5}
                        placeholder="Enter your comment here"
                        fullWidth={true}
                        variant="outlined"
                        multiline
                        value={comment}
                        onChange={(e) => {
                            setComment(e.target.value);
                            setErrorMessages('');
                        }}
                        sx={{
                            background: "#fff", '& .MuiOutlinedInput-notchedOutline ': {
                                border: "1px solid grey !important",
                                borderRadius: "10px !important"
                            },
                            '& .MuiInputBase-input': {
                                borderRadius: "10px !important"

                            }
                        }}
                    />
                    <ErrorMessagesComponent errorMessage={errorMessages?.content} />
                </div>
                <div className={styles.UpdateBtnGrp} >
                    <Button className={styles.updateCancelBtn} type='submit' variant='outlined' onClick={() => router.back()}>Cancel</Button>

                    <Button className={styles.updatedSaveBtn} type='submit' variant='contained' onClick={addSummary}>Add</Button>
                </div>
            </div>
            <Snackbar
                open={showSuccessAlert}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert severity="success">
                    <AlertTitle>Success</AlertTitle>
                    {success}
                </Alert>
            </Snackbar>
            {/* <Snackbar
                open={showErrorAlert}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert severity='error'>
                    <AlertTitle>Validation Errors</AlertTitle>
                    {summaryError}
                </Alert>
            </Snackbar> */}
            <LoadingComponent loading={loading} />

        </div>
    )
}
export default AddSummary;