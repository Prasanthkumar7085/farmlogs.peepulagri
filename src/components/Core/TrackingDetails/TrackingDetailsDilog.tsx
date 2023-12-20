import { Button, CircularProgress, Dialog, TextField } from "@mui/material";
import styles from "./tracking-details.module.css"
import { useForm } from "react-hook-form";
import { useState } from "react";
import ErrorMessages from "../ErrorMessages";
import { DatePicker, Stack } from 'rsuite';
import "rsuite/dist/rsuite.css";
import isBefore from 'date-fns/isBefore';
import { v4 as uuidv4 } from 'uuid';
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { toast } from "sonner";


interface pagePropsType {
    open: boolean;
    addTracking: any;
    setTrackingDialogOpen: (newValue: boolean) => void;
    loading: boolean;
}
const TrackingDetailsDilog = ({
    open,
    addTracking,
    setTrackingDialogOpen,
    loading,
}: pagePropsType) => {

    const router = useRouter()

    const [errorMessages, setErrorMessages] = useState<any>([])
    const [phoneNumber, setPhoneNumber] = useState<any>()
    const [date, setDate] = useState<any>()
    const [service_name, setServiceName] = useState<any>()
    const [trackingId, setTrackingId] = useState<any>()
    const [trackingLoading, setTrackingLoading] = useState<any>(false)

    const accessToken = useSelector(
        (state: any) => state.auth.userDetails?.access_token
    );

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();


    //event call after the form submit
    const onSubmitClick = async (data: any) => {
        setErrorMessages({});

    };

    //only allow the number and (mobile number validation)
    const handleInput = (event: any) => {
        const value = event.target.value.replace(/\D/g, '');
        event.target.value = value.slice(0, 10);
    };


    const Datestyles = { width: 555, display: 'block', marginBottom: 10, };

    //function to generate the uuid randomly
    const generateUUID = () => {
        const newUUID = uuidv4(); // Generate UUID
        setTrackingId(newUUID); // Update state with the generated UUID
    };

    //add tracking details eveent
    const addTrackingDetails = async () => {

        setTrackingLoading(true)
        let body = {
            "service_name": service_name,
            "delivery_date": date,
            "contact_number": phoneNumber,
            "tracking_id": trackingId
        }
        try {
            let options = {
                method: "POST",
                headers: new Headers({
                    "content-type": "application/json",
                    authorization: accessToken,
                }),
                body: JSON.stringify(body),
            };

            let response: any = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/procurement-requests/${router.query.procurement_id}/tracking-details`,
                options
            );
            let responseData = await response.json();
            if (responseData.success) {
                toast.success(responseData?.message)
                setTrackingDialogOpen(false)
                addTracking(true)
            }
            if (responseData.status == 422) {
                setErrorMessages([responseData?.errors])
            }

        }
        catch (err) {
            console.error(err)
        }
        finally {
            setTrackingLoading(false)

        }
    }

    return (
        <Dialog
            open={open}
            PaperProps={{
                sx: {
                    "& .css-zw3mfo-MuiModal-root-MuiDialog-root": {
                        zIndex: "100 !important"
                    },
                    borderRadius: "16px", minWidth: "400px", maxWidth: "800px"
                }
            }}
        >
            <div className={styles.alertdelete}>
                <img className={styles.infoIcon} alt="" src="/info-icon.svg" />
                <div>
                    <div
                        className={styles.areYouSure}
                    >{`If You want to change status to shipped pleaseadd tracking details `}</div>
                    <div className={styles.textfeild} id="farm-name">
                        <div className={styles.label}>Service Name</div>
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
                            value={service_name}
                            onChange={(e) => setServiceName(e.target.value)}
                            name="service_name"
                            fullWidth
                            className={styles.inputfarmname}
                            size="small"
                            placeholder="Service Name"
                            variant="outlined"
                            error={Boolean(errorMessages?.["service_name"])}
                            helperText={
                                errorMessages?.["service_name"] ? errorMessages?.["service_name"] : ""
                            }

                        />
                        <div className={styles.label}>Delivery Date</div>
                        <Stack direction="column" alignItems="flex-start" >

                            <DatePicker
                                editable={false}
                                size="lg"
                                style={Datestyles}
                                placeholder="DD-MM-YYYY"
                                value={date}
                                onChange={setDate}
                                shouldDisableDate={date => isBefore(date, new Date())}
                            />
                            <ErrorMessages errorMessages={errorMessages} keyname="delivery_date" />

                        </Stack>

                        <div className={styles.label}>Contact Number</div>
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
                            size="small"
                            className={styles.inputfarmname}
                            fullWidth
                            placeholder="Contact Number"
                            value={phoneNumber}
                            onInput={handleInput}
                            onChange={(e: any) => setPhoneNumber(e.target.value)}
                            helperText={errorMessages?.find((error: any) => error.key === "contact_number") && (
                                <ErrorMessages errorMessages={errorMessages} keyname="contact_number" />
                            )}
                        />

                        <div style={{
                            display: "flex", justifyContent: "space-between", alignSelf: "stretch", alignItems: "center"
                        }}>
                            <div className={styles.label}>
                                Tracking Id
                            </div>
                            <div>
                                <Button variant="text" onClick={generateUUID}>Generate Id</Button>
                            </div>
                        </div>
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

                            fullWidth
                            disabled
                            value={trackingId}
                            className={styles.inputfarmname}
                            size="small"
                            placeholder="Tracking Id"
                            variant="outlined"
                            error={Boolean(errorMessages?.["tracking_id"])}
                            helperText={
                                errorMessages?.["tracking_id"] ? errorMessages?.["tracking_id"] : ""
                            }

                        />
                    </div>




                </div>
                <div className={styles.buttons}>
                    <Button
                        className={styles.buttoncancel}
                        onClick={() => setTrackingDialogOpen(false)}
                        size="small"
                    >
                        <div className={styles.text}>Cancel</div>
                    </Button>
                    <Button
                        className={styles.buttongotit}
                        variant="contained"
                        color="info"
                        size="small"
                        disabled={loading}
                        onClick={() => addTrackingDetails()}
                        sx={{
                            "&.Mui-disabled": {
                                background: "#c62828",
                                color: "#000"
                            }
                        }}
                    >
                        <div className={styles.text}>
                            {trackingLoading ? (
                                <CircularProgress size="1.3rem" sx={{ color: "white" }} />
                            ) : (
                                "Done"
                            )}
                        </div>
                    </Button>
                </div>
            </div>
        </Dialog>
    );
};

export default TrackingDetailsDilog;
