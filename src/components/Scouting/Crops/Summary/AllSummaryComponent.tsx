import { removeUserDetails } from "@/Redux/Modules/Auth";
import { deleteAllMessages } from "@/Redux/Modules/Conversations";
import timePipe from "@/pipes/timePipe";
import AddIcon from "@mui/icons-material/Add";
import { Backdrop, CircularProgress, IconButton, Menu, MenuItem } from "@mui/material";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { prepareURLEncodedParams } from "../../../../../lib/requestUtils/urlEncoder";
import DateRangePickerComponent from "./DateRangePicker";
import styles from "./summary.module.css";

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

    const getSummary = async (page: any) => {
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
                `${process.env.NEXT_PUBLIC_API_URL}/crops/day-summaries/${page}/20`,
                queryParams
            );

            let response = await fetch(url, options);
            let responseData: any = await response.json();
            if (responseData.success) {
                setHasMore(responseData?.has_more);
                setData([...data, ...responseData.data]);

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
            getSummary(pageNumber);
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
            if (entries[0].isIntersecting && hasMore) {
                setPageNumber(prevPageNumber => prevPageNumber + 1)
                getSummary(pageNumber + 1)
                scrollToLastItem() // Restore scroll position after new data is loaded
            }
        })
        if (node) observer.current.observe(node)
    }, [loading, hasMore])




    return (
        <div>
            <DateRangePickerComponent captureDateValue={captureDateValue} />


            {data?.length ? data.map((item: any, index: any) => {
                if (data.length === index + 1) {
                    return (

                        <div className={styles.summarycard}
                            key={index}
                            ref={lastBookElementRef}
                        >
                            <div className={styles.header}>
                                <h4 className={styles.date}>{timePipe(item.date, "ddd DD-MMM-YYYY")}</h4>
                                <div className={styles.optopns}>
                                    <img className={styles.vectorIcon} alt="" src="/vector.svg" onClick={(e) => handleMenu(e)} />
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
                                <h4 className={styles.date}>{timePipe(item.date, "ddd DD-MMM-YYYY")}</h4>
                                <div className={styles.optopns}>
                                    <img className={styles.vectorIcon} alt="" src="/vector.svg" onClick={(e) => handleMenu(e)} />
                                </div>
                            </div>
                            <p className={styles.chilliBeingA}>
                                {item.content}
                            </p>
                        </div>
                    )
                }
            }) : ""}

            <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <MenuItem onClick={handleClose}>Edit</MenuItem>
                <MenuItem onClick={handleClose}>Delete</MenuItem>
            </Menu>



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
