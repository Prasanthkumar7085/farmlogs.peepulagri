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

const UpdateSummary = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const crop_id = router.query.crop_id
    const farm_id = router.query.farm_id

    const accessToken = useSelector(
        (state: any) => state.auth.userDetails?.access_token
    );

    const [, , removeCookie] = useCookies(["userType"]);
    const [, , loggedIn] = useCookies(["loggedIn"]);

    const [loading, setLoading] = useState(false);
    const [summaryData, setSummaryData] = useState<any>();
    const [comment, setComment] = useState<any>();
    const [date, setDate] = useState<any>();
    const [dateError, setDateError] = useState<any>();
    const [commentError, setCommentError] = useState<any>();
    const [summaryError, setSummaryError] = useState<any>();
    const [success, setSuccess] = useState<any>();
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [farmOptions, setFarmOptions] = useState<any>()
    const [cropOptions, setCropOptions] = useState<any>()
    const [cropId, setCropId] = useState<any>()
    const [farmId, setFarmID] = useState<any>()
    const [farmDefaultValue, setFarmDefaultValue] = useState<any>()
    const [cropDefaultValue, setCropDefaultValue] = useState<any>()
    const [errorMessages, setErrorMessages] = useState<any>()

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

    //get the single farm details
    const getSingleFarmDetails = async (id: any) => {
        let options = {
            method: "GET",

            headers: new Headers({
                "content-type": "application/json",
                authorization: accessToken,
            }),
        };
        try {
            let response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/farms/${id}`,
                options
            );

            let responseData: any = await response.json();

            if (responseData.status == 200) {
                await getAllFarmsOptions(responseData?.data?.title)

            } else if (responseData?.statusCode == 403) {
                await logout();
            }
        }
        catch (err) {
            console.log(err)
        }
    }

    //get one summary details 
    const getOneSummaryDetails = async () => {
        setLoading(true);
        let options = {
            method: "GET",

            headers: new Headers({
                "content-type": "application/json",
                authorization: accessToken,
            }),
        };
        try {
            let response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/crops/day-summary/${router.query.summary_id}`,
                options
            );

            let responseData: any = await response.json();

            if (responseData.status == 200) {
                setComment(responseData?.data?.content)
                setDate(formatDateForInput(responseData?.data?.date))
                setFarmDefaultValue(responseData?.data?.farm_id)
                setCropDefaultValue(responseData?.data?.crop_id)
                getAllCropsOptions("", responseData?.data?.farm_id)
                setFarmID(responseData?.data?.farm_id)
                setCropId(responseData?.data?.crop_id)
                await getSingleFarmDetails(responseData?.data?.farm_id)
                setSummaryData(responseData?.data)

            } else if (responseData?.statusCode == 403) {
                await logout();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }

    }

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
            getAllFarmsOptions()
            setFarmID("")
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

        if (value) {
            setCropId(value?._id)
            // getAllCropsOptions("", value._id)
        }
        else {
            setCropId("")

        }
    }


    //update the summary api
    const updateSummary = async () => {
        setLoading(true);
        setDateError('');
        setCommentError('');
        setSummaryError('');
        try {
            let body = {
                farm_id: farmId,
                content: comment,
                date: date,
                crop_id: cropId,

            };
            let options = {
                method: "PATCH",
                headers: new Headers({
                    "content-type": "application/json",
                    authorization: accessToken,
                }),
                body: JSON.stringify(body),
            };

            let response: any = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/crops/day-summary/${router.query.summary_id}`,
                options
            );
            let responseData = await response.json();

            if (responseData.status == 200) {
                setSuccess(responseData.message);
                setShowSuccessAlert(true);
                setTimeout(() => {
                    setShowSuccessAlert(false);
                }, 1500);
                router.back()

            } else if (responseData.status == 422) {
                setErrorMessages(responseData.errors)

                setDateError(responseData.errors.date);
                setCommentError(responseData.errors.content);
                setSummaryError(responseData.errors.summary);
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

    useEffect(() => {
        if (router.isReady && accessToken) {
            getOneSummaryDetails()

        }
    }, [router.isReady, accessToken])

    const getCurrentDate = () => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const formatDateForInput = (dateString: any) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    return (
        <div>
            <Typography variant="caption">Farm</Typography>

            <FarmsDropDown
                options={farmOptions}
                label={"title"}
                onSelectValueFromFarmsDropDown={onSelectValueFromFarmsDropDown}
                getFarmsSearchString={getFarmsSearchString}
                farmDefaultValue={farmDefaultValue}
            />
            <ErrorMessagesComponent errorMessage={errorMessages?.farm_id} />

            <Typography variant="caption">Crop</Typography>

            <CropsDropDown
                options={cropOptions}
                label={"title"}
                onSelectValueFromCropsDropDown={onSelectValueFromCropsDropDown}
                getCropSearchString={getCropSearchString}
                cropDefaultValue={cropDefaultValue}
            />
            <ErrorMessagesComponent errorMessage={errorMessages?.crop_id} />

            <Typography variant="caption">Date</Typography>
            <TextField
                type='date'
                placeholder="Select Date"
                color="primary"
                variant="outlined"
                value={date}
                onChange={(e) => {
                    const selectedDate = new Date(e.target.value);
                    const currentDate = new Date();

                    if (selectedDate > currentDate) {
                        setDateError('Date cannot be in the future');
                        return;
                    }

                    setDate(e.target.value);
                    setDateError('');
                    setSummaryError('');
                }}
                inputProps={{ max: getCurrentDate() }}
                sx={{ width: "100%" }}
            />
            <ErrorMessagesComponent errorMessage={errorMessages?.date} />

            <Typography variant="caption">Comments</Typography>
            <TextField
                color="primary"
                name="desciption"
                id="description"
                minRows={4}
                maxRows={4}
                placeholder="Enter your comment here"
                fullWidth={true}
                variant="outlined"
                multiline
                value={comment}
                onChange={(e) => {
                    setComment(e.target.value);
                    setCommentError('');
                    setSummaryError('');
                }}
                sx={{ background: "#fff" }}
            />
            <ErrorMessagesComponent errorMessage={errorMessages?.content} />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: 'center' }}>
                <Button type='submit' variant='contained' onClick={() => router.back()}>Cancel</Button>

                <Button type='submit' variant='contained' onClick={updateSummary}>Update</Button>
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
            <Snackbar
                open={showErrorAlert}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert severity='error'>
                    <AlertTitle>Error</AlertTitle>
                    {summaryError}
                </Alert>
            </Snackbar>
            <LoadingComponent loading={loading} />
        </div>
    )

}
export default UpdateSummary;