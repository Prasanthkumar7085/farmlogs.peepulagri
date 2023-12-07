import { useDispatch, useSelector } from "react-redux";
import { removeUserDetails } from "@/Redux/Modules/Auth";
import { deleteAllMessages } from "@/Redux/Modules/Conversations";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Backdrop, Box, Card, CardContent, CircularProgress, IconButton, Menu, MenuItem, TextField, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import styles from "./summary.module.css"
import timePipe from "@/pipes/timePipe";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { prepareURLEncodedParams } from "../../../../../lib/requestUtils/urlEncoder";
import DateRangePickerComponent from "./DateRangePicker";


const AllSummaryComponents = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const crop_id = router.query.crop_id

    const accessToken = useSelector(
        (state: any) => state.auth.userDetails?.access_token
    );
    const [, , removeCookie] = useCookies(["userType"]);
    const [, , loggedIn] = useCookies(["loggedIn"]);

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any>();
    const [anchorEl, setAnchorEl] = useState<any>(null);
    const [searchString, setSearchString] = useState<any>([]);

    const handleMenu = (event: any) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };


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

    const getSummary = async () => {
        setLoading(true);
        try {
            let queryParams: any = {};

            let options = {
                method: "GET",
                headers: new Headers({
                    authorization: accessToken,
                }),
            };
            let url = prepareURLEncodedParams(
                `${process.env.NEXT_PUBLIC_API_URL}/crops/day-summaries/1/20`,
                queryParams
            );

            let response = await fetch(url, options);
            let responseData: any = await response.json();
            if (responseData.success) {
                setLoading(true);
                setData(responseData.data)

            } else if (responseData?.statusCode == 403) {
                await logout();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }

    }
    useEffect(() => {
        if (router.isReady && accessToken) {
            getSummary()
        }
    }, [router.isReady, accessToken]);

    const captureDateValue = (fromDate: string, toDate: string) => {
        setSearchString([fromDate, toDate])


    }


    return (
        <div>
            <DateRangePickerComponent captureDateValue={captureDateValue} />


            {data?.length ? data.map((item: any, index: any) => {
                return (
                    <div className={styles.summarycard}>
                        <div className={styles.header}>
                            <h4 className={styles.date}>{timePipe(item.date, "ddd DD-MMM-YYYY")}</h4>
                            <div className={styles.optopns}>
                                <img className={styles.vectorIcon} alt="" src="/vector.svg" />
                            </div>
                        </div>
                        <p className={styles.chilliBeingA}>
                            {item.content}
                        </p>
                    </div>
                )
            }) : ""}



            <div className="addFormPositionIcon">
                <IconButton
                    className={styles.AddSummarybtn}
                    aria-label="add to shopping cart"
                    onClick={() => {
                        router.push(
                            `/farms/${router?.query.farm_id}/crops/${router.query.crop_id}/summary/add-summary`
                        );
                    }}
                >
                    <AddIcon />
                </IconButton>

            </div>
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    )
}
export default AllSummaryComponents;