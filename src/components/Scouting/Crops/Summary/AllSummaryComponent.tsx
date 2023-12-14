import { removeUserDetails } from "@/Redux/Modules/Auth";
import { deleteAllMessages } from "@/Redux/Modules/Conversations";
import CropsDropDown from "@/components/Core/CropsDropDown";
import FarmsDropDown from "@/components/Core/FarmsDropDown";
import LoadingComponent from "@/components/Core/LoadingComponent";
import NoFarmDataComponent from "@/components/Core/NoFarmDataComponent";
import timePipe from "@/pipes/timePipe";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Box, IconButton, Menu, MenuItem, Tooltip, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { prepareURLEncodedParams } from "../../../../../lib/requestUtils/urlEncoder";
import styles from "./summary.module.css";
import NoDataMobileComponent from "@/components/Core/NoDataMobileComponent";
import AlertDelete from "@/components/Core/DeleteAlert/alert-delete";
import AlertComponent from "@/components/Core/AlertComponent";

const AllSummaryComponents = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const crop_id = router.query.crop_id;

    const accessToken = useSelector(
        (state: any) => state.auth.userDetails?.access_token
    );
    const [, , removeCookie] = useCookies(["userType"]);
    const [, , loggedIn] = useCookies(["loggedIn"]);

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any>([]);
    const [anchorEl, setAnchorEl] = useState<any>(null);
    const [searchString, setSearchString] = useState<any>([]);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [pageNumber, setPageNumber] = useState(1);
    const [rowId, setRowID] = useState<any>()
    const [farmOptions, setFarmOptions] = useState<any>()
    const [cropOptions, setCropOptions] = useState<any>()
    const [cropId, setCropId] = useState<any>()
    const [farmId, setFarmID] = useState<any>()
    const [dialogOpen, setDialogOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState(false);
    const open = Boolean(anchorEl);
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

    const getSummary = async (farmId = "", cropId = "", page: any) => {
        setLoading(true);
        try {
            let queryParams: any = {};

            if (farmId) {
                queryParams["farm_id"] = farmId
            }

            if (cropId) {
                queryParams["crop_id"] = cropId
            }


            let options = {
                method: "GET",
                headers: new Headers({
                    authorization: accessToken,
                }),
            };
            let url = prepareURLEncodedParams(
                `${process.env.NEXT_PUBLIC_API_URL}/crops/day-summaries/${page}/20`,
                queryParams
            );



            let response = await fetch(url, options);
            let responseData: any = await response.json();
            if (responseData.success) {
                if (responseData?.has_more) {
                    if (page !== 1) {
                        setHasMore(responseData?.has_more);
                        setData([...data, ...responseData.data]);
                    }
                    else {
                        setHasMore(responseData?.has_more);
                        setData(responseData.data);
                    }

                }
                else {
                    setHasMore(false);

                    setData(responseData.data);
                }

            } else if (responseData?.statusCode == 403) {
                await logout();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (router.isReady && accessToken) {
            getSummary("", "", pageNumber);
        }
    }, [router.isReady, accessToken]);

    const captureDateValue = (fromDate: string, toDate: string) => {
        setSearchString([fromDate, toDate]);
    };

    //infinite scroll 
    //scroll to the last element of the previous calls
    const lastItemRef = useRef<HTMLDivElement>(null);
    const scrollToLastItem = () => {
        if (lastItemRef.current) {
            lastItemRef.current.scrollIntoView({
                behavior: "smooth",
                block: "end",
                inline: "nearest",
            });
        }
    };

    //api call after the last element was in the dom (visible)
    const observer: any = useRef()

    const lastBookElementRef = useCallback((node: any) => {

        if (loading) return
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore && data.length > 0) {
                setPageNumber((prevPageNumber) => prevPageNumber + 1);
                getSummary(farmId, cropId, pageNumber + 1);
                scrollToLastItem(); // Restore scroll position after new data is loaded
            }
        })
        if (node) observer.current.observe(node)
    }, [loading, hasMore])


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
            console.error(err);
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
            console.error(err);
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
            // {
            //     value?._id ?
            //         value?._id?.length > 20 ? (value?._id?.slice(0, 17)) + '...' : value?._id
            //     : ""
            // }
            setFarmID(value?._id)
            getSummary(value?._id, cropId, 1)

        }
        else {
            setFarmID("")
            setCropId("")
            setCropOptions([])
            getSummary("", "", 1)
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
            getSummary(farmId, value?._id, 1)
        }
        else {
            setCropId("")
            getSummary(farmId, "", 1)

        }
    }
    const deleteSummary = async () => {
        setLoading(true);
        handleClose();

        let options = {
            method: "DELETE",
            headers: new Headers({
                "content-type": "application/json",
                authorization: accessToken,
            }),
        };

        let response: any = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/crops/day-summary/${rowId}`,
            options
        );
        let responseData = await response.json();
        if (responseData?.success) {
            setAlertMessage(responseData?.message);
            setDialogOpen(false);
            setAlertType(true);
            getSummary("", "", pageNumber);
        } else {
            setAlertMessage(responseData?.message);
            setAlertType(false);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (router.isReady && accessToken) {
            getAllFarmsOptions()
        }
    }, [router.isReady, accessToken])

    return (
        <div >
            <div className={styles.summaryHeader} id="header" >
                <img
                    className={styles.iconsiconArrowLeft}
                    alt=""
                    src="/iconsiconarrowleft.svg"
                    onClick={() => router.back()}
                />
                <Typography className={styles.viewFarm}>Summary</Typography>
                <div className={styles.headericon} id="header-icon">
                </div>
            </div>
            <div className={styles.searchBlock} style={{ display: "grid", gridTemplateColumns: farmId ? "1fr 1fr" : "1fr", gridGap: "1rem" }}>
                <Box sx={{
                    "& .MuiInputBase-root": {
                        background: "#fff",
                        color: "#000",
                        borderRadius: "24px !important"
                    },
                    '& .MuiOutlinedInput-notchedOutline ': {
                        border: "0",
                        color: "#fff",
                        borderRadius: "24px !important"

                    },
                    '& .MuiButtonBase-root': {
                        color: "#000",
                        padding: "4px !important"
                    },
                    '& .MuiInputBase-input': {
                        padding: "11px 14px"
                    }
                }}>
                    <FarmsDropDown
                        options={farmOptions}
                        label={"title"}
                        onSelectValueFromFarmsDropDown={onSelectValueFromFarmsDropDown}
                        getFarmsSearchString={getFarmsSearchString}
                    />
                </Box>

                {farmId ?
                    <Box sx={{
                        "& .MuiInputBase-root": {
                            background: "#fff",
                            color: "#000",
                            borderRadius: "24px !important"
                        },
                        '& .MuiOutlinedInput-notchedOutline ': {
                            border: "0",
                            color: "#fff",
                            borderRadius: "24px !important"

                        },
                        '& .MuiButtonBase-root': {
                            color: "#000",
                            padding: "4px !important"
                        },
                        '& .MuiInputBase-input': {
                            padding: "11px 14px"
                        }
                    }}>
                        <CropsDropDown
                            options={cropOptions}
                            label={"title"}
                            onSelectValueFromCropsDropDown={onSelectValueFromCropsDropDown}
                            getCropSearchString={getCropSearchString}
                        />
                    </Box> : ""}
            </div>
            <div className={styles.allSummaryCardsBlock}>
                {data?.length ? data.map((item: any, index: any) => {
                    if (data.length === index + 1 && hasMore == true) {
                        return (

                            <div className={styles.summarycard}
                                key={index}
                                ref={lastBookElementRef}
                            >
                                <div className={styles.header}>
                                    <div className={styles.summaryHeading}>
                                        <h4 className={styles.date}>{timePipe(item.date, "ddd DD-MMM-YYYY")}</h4>
                                        <h6 className={styles.cropTitle}>
                                            <span> {item?.farm_id?.title
                                                ? item?.farm_id?.title?.length > 18
                                                    ? item?.farm_id?.title?.slice(0, 1).toUpperCase() +
                                                    item?.farm_id?.title?.slice(1, 17) +
                                                    "..."
                                                    : item?.farm_id?.title[0].toUpperCase() +
                                                    item?.farm_id?.title?.slice(1)
                                                : "ty"}</span>
                                            {item?.crop_id?.title
                                                ? item?.crop_id?.title?.length > 18
                                                    ? item?.crop_id?.title?.slice(0, 1).toUpperCase() +
                                                    item?.crop_id?.title?.slice(1, 20) +
                                                    "..."
                                                    : item?.crop_id?.title[0].toUpperCase() +
                                                    item?.crop_id?.title?.slice(1)
                                                : ""}

                                        </h6>
                                        {/* <h4 className={styles.cropTitle}>{item?.crop_id?.title}</h4> */}
                                    </div>
                                    <div className={styles.vectorIcon} onClick={(e) => {
                                        handleMenu(e)
                                        setRowID(item._id)
                                    }}>

                                        <MoreVertIcon sx={{ fontSize: "1.5rem" }} />
                                    </div>
                                </div>
                                <p className={styles.chilliBeingA}>
                                    {item.content}
                                </p>

                            </div>

                        )
                    }
                    else {
                        return (

                            <div className={styles.summarycard}
                                key={index}
                                ref={index === data.length - 20 ? lastItemRef : null}
                            >
                                <div className={styles.header}>
                                    <div className={styles.summaryHeading}>
                                        <h4 className={styles.date}>{timePipe(item.date, "DD MMM, YYYY")}</h4>
                                        <h4 className={styles.cropTitle} >
                                            {item?.farm_id?.title
                                                ? item?.farm_id?.title?.length > 10
                                                    ? item?.farm_id?.title?.slice(0, 1).toUpperCase() +
                                                    item?.farm_id?.title?.slice(1, 9) +
                                                    "..."
                                                    : item?.farm_id?.title[0].toUpperCase() +
                                                    item?.farm_id?.title?.slice(1)
                                                : "ty"} <span>( {item?.crop_id?.title
                                                    ? item?.crop_id?.title?.length > 17
                                                        ? item?.crop_id?.title?.slice(0, 1).toUpperCase() +
                                                        item?.crop_id?.title?.slice(1, 16) +
                                                        "..."
                                                        : item?.crop_id?.title[0].toUpperCase() +
                                                        item?.crop_id?.title?.slice(1)
                                                    : ""})</span></h4>
                                    </div>
                                    <div className={styles.vectorIcon} onClick={(e) => {
                                        handleMenu(e)
                                        setRowID(item._id)
                                    }}>
                                        <MoreVertIcon sx={{ fontSize: "1.5rem" }} />
                                    </div>
                                </div>
                                <p className={styles.chilliBeingA}>
                                    {item.content}
                                </p>

                            </div>
                        )
                    }
                }) : !loading ? (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", height: "calc(100vh - 180px)" }}>
                        <NoDataMobileComponent noData={!Boolean(data.length)} noDataImg={"/NoDataImages/No_summary.svg"} />
                        <p className="noSummaryText">No summary</p>
                    </div>
                ) : (
                    "")}
            </div>

            <Menu
                className={styles.menuListSummary}
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                sx={{
                    "& .MuiMenuItem-root": {
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        minHeight: "inherit",
                    },
                }}
            >
                <MenuItem
                    sx={{ paddingBlock: "5px", fontFamily: "'Inter', sans-serif", color: "#000", borderBottom: "1px solid #B4C1D6" }} onClick={() => {
                        router.push(
                            `/summary/${rowId}/edit`
                        );
                    }}>Update</MenuItem>
                <MenuItem onClick={() => {
                    setDialogOpen(true);
                    setAnchorEl(null);
                }} sx={{ paddingBlock: "5px", fontFamily: "'Inter', sans-serif", color: "#000" }}
                >Delete</MenuItem>
            </Menu>
            <div className="addFormPositionIcon">
                <IconButton
                    className={styles.AddSummarybtn}
                    aria-label="add to shopping cart"
                    onClick={() => {
                        router.push(
                            `/summary/add`
                        );
                    }}
                >
                    <img src="/mobileIcons/summary/add-summary-icon.svg" alt="" width={"24px"} />
                    <span>Add Summary</span>
                </IconButton>

            </div>
            <AlertDelete
                open={dialogOpen}
                deleteFarm={deleteSummary}
                setDialogOpen={setDialogOpen}
                loading={loading}
                deleteTitleProp={"Summary"}
            />
            <AlertComponent
                alertMessage={alertMessage}
                alertType={alertType}
                setAlertMessage={setAlertMessage}
                mobile={true}
            />
            <LoadingComponent loading={loading} />
        </div>
    )
}
export default AllSummaryComponents;
