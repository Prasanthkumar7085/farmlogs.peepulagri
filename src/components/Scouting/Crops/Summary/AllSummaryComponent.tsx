import { useDispatch, useSelector } from "react-redux";
import { removeUserDetails } from "@/Redux/Modules/Auth";
import { deleteAllMessages } from "@/Redux/Modules/Conversations";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Backdrop, Box, Card, CardContent, CircularProgress, IconButton, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import styles from "./summary.module.css"


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
    console.log(data);


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
        let options = {
            method: "GET",

            headers: new Headers({
                "content-type": "application/json",
                authorization: accessToken,
            }),
        };
        try {
            let response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/crops/${crop_id}/day-summary/2023-11-21`,
                options
            );

            let responseData: any = await response.json();
            console.log("data", responseData);


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
    }, [router.isReady])

    return (
        <div>
            <Card sx={{ display: 'flex' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flex: '1 0 auto' }}>
                        <Typography component="div" variant="subtitle1" color='blue'>
                            {data?.date}
                        </Typography>
                        <Typography variant="subtitle1" color='black' component="div">
                            {data?.content}
                        </Typography>
                    </CardContent>
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