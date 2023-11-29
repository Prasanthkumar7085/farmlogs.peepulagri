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
import getAllFarmsService from "../../../../../lib/services/FarmsService/getAllFarmsServiceMobile";
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

    const summary = async () => {
        setLoading(true);
        try {
            let url = `crops/${crop_id}/day-summaries`;
            let queryParam: any = {};
            if (searchString && searchString.length === 2) {
                queryParam["from_date"] = searchString[0];
                queryParam["to_date"] = searchString[1];
            }
            url = prepareURLEncodedParams(url, queryParam);

            let responseData: any = await getAllFarmsService(url, accessToken);
            console.log(responseData);



            if (responseData.status == 200) {
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
        if (router.isReady) {
            summary()
        }
    }, [router.isReady, searchString]);

    const captureDateValue = (fromDate: string, toDate: string) => {
        setSearchString([fromDate, toDate])


    }


    return (
        <div>
            <DateRangePickerComponent captureDateValue={captureDateValue} />
            <TextField
                // className={styles.searchfarm}
                type='date'
                color="primary"
                name="search"
                id="search"
                size="small"
                placeholder="Search by Name"
                fullWidth={true}
                variant="outlined"
                value={searchString}
                onChange={(e) => setSearchString(e.target.value)}
                InputProps={{
                    // endAdornment: (
                    //   <InputAdornment position="end">
                    //     <IconButton
                    //       onClick={() => {
                    //         setSearch("");
                    //         captureSearchString("");
                    //       }}
                    //     >
                    //       {search ? <ClearOutlinedIcon /> : ""}
                    //     </IconButton>
                    //   </InputAdornment>
                    // ),
                    // startAdornment: (
                    //     <InputAdornment position="start">
                    //         <IconButton>
                    //             <SearchIcon />
                    //         </IconButton>
                    //     </InputAdornment>
                    // ),
                }}
            />
            <Card sx={{ display: 'flex' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flex: '1 0 auto' }}>
                        <Typography component="div" variant="subtitle1" color='blue'>
                            {timePipe(data?.date, "DD, MMM YYYY")}
                        </Typography>
                        <Typography variant="subtitle1" color='black' component="div">
                            {data?.content}
                        </Typography>
                    </CardContent>

                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        color="inherit"
                    >
                        <MoreVertIcon />
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem sx={{ color: 'green' }} onClick={() => router.push(`/farms/${router?.query.farm_id}/crops/${router.query.crop_id}/summary/update-summary`)}><EditIcon /></MenuItem>
                        <MenuItem sx={{ color: 'red' }} onClick={handleClose}><DeleteIcon /></MenuItem>
                    </Menu>
                </Box>

            </Card>
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