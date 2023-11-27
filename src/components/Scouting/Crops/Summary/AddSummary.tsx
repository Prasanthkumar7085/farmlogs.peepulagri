import { removeUserDetails } from "@/Redux/Modules/Auth";
import { deleteAllMessages } from "@/Redux/Modules/Conversations";
import { Alert, AlertTitle, Backdrop, Button, CircularProgress, Snackbar, TextField } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";


const AddSummary = () => {
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
    const [comment, setComment] = useState<any>();
    const [date, setDate] = useState<any>();
    const [dateError, setDateError] = useState<any>();
    const [commentError, setCommentError] = useState<any>();
    const [summaryError, setSummaryError] = useState<any>();
    const [success, setSuccess] = useState<any>();
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);


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

    const addSummary = async () => {
        setLoading(true);
        setDateError('');
        setCommentError('');
        setSummaryError('');
        try {
            let body = {
                farm_id: farm_id,
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
                `${process.env.NEXT_PUBLIC_API_URL}/crops/${crop_id}/day-summary`,
                options
            );
            let responseData = await response.json();
            console.log(responseData);

            if (responseData.status == 200) {
                setSuccess(responseData.message);
                setShowSuccessAlert(true);
                setLoading(false);
                setTimeout(() => {
                    setShowSuccessAlert(false);
                    router.back()
                }, 1500);
            } else if (responseData.status == 422) {
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

    const getCurrentDate = () => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    return (
        <div>
            <div>Date</div>
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
                sx={{ background: "#fff" }}
            />
            <p style={{ color: 'red' }}>{dateError}</p>
            <div >Comments</div>
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
            <p style={{ color: 'red' }}>{commentError}</p>
            <div>
                <Button type='submit' variant='contained' onClick={addSummary}>Submit</Button>
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
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    )
}
export default AddSummary;