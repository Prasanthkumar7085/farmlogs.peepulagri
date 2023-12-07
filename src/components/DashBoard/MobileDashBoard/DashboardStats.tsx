import type { NextPage } from "next";
import styles from "./dashboard-stats.module.css";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import formatMoney from "@/pipes/formatMoney";
import { Typography } from "@mui/material";
import LatestImagesComponent from "./LatestImages";

const DashboardStats = () => {
    const router = useRouter()
    const [loading, setLoading] = useState<any>()
    const [data, setData] = useState<any>()
    const accessToken = useSelector(
        (state: any) => state.auth.userDetails?.access_token
    );

    //stats apis call 
    const getAllStatsDetails = async () => {
        setLoading(true)
        let urls = [
            `${process.env.NEXT_PUBLIC_API_URL}/farms/count`,
            `${process.env.NEXT_PUBLIC_API_URL}/crops/count`,
            `${process.env.NEXT_PUBLIC_API_URL}/farm-images/count`,
            `${process.env.NEXT_PUBLIC_API_URL}/farm-images/comments/count`,
            `${process.env.NEXT_PUBLIC_API_URL}/farm-images/count/20`,
        ];
        try {
            let tempResult: any = [];

            const responses = await Promise.allSettled(
                urls.map(async (url) => {
                    const response = await fetch(url, {
                        method: "GET",
                        headers: new Headers({
                            authorization: accessToken,
                        }),
                    });
                    return response.json();
                })
            );

            responses.forEach((result, num) => {
                if (result.status === "fulfilled") {
                    tempResult.push(result.value);
                }
                if (result.status === "rejected") {
                }
            });

            setData(tempResult)
        } catch (error) {
            console.error("Error fetching data:", error);
        }
        finally {
            setLoading(false)

        }
    }

    useEffect(() => {
        if (router.isReady && accessToken) {
            getAllStatsDetails()
        }
    }, [router.isReady, accessToken])

    return (

        <div className={styles.dashboardstats}>
            <div className={styles.pageHeader}  >
                <div style={{ padding: "0.5rem" }}>
                    <img src="/mobileIcons/logo-mobile-white.svg" alt="" width={"50px"} />
                </div>
            </div>
            <div style={{ background: "#fff", width: "100%", borderRadius: " 30px 30px 0px 0px" }}>
                <div style={{ padding: "1rem" }}>
                    <div className={styles.row}>
                        <div className={styles.farmscard} style={{ background: " #DDD4F2" }}>
                            <div className={styles.header}>
                                <div className={styles.container}>
                                    <img className={styles.farmicon} alt="" src="/mobileIcons/dashboard/farms-card-icon.svg" />
                                </div>
                                <label className={styles.lable}>Farms</label>
                            </div>
                            <p className={styles.total123}>
                                {data?.length ? data[0]?.data.toLocaleString() : ""}
                            </p>
                        </div>
                        <div className={styles.farmscard} style={{ background: "#D6E7FF" }}>
                            <div className={styles.header}>
                                <div className={styles.container}>
                                    <img className={styles.farmicon} alt="" src="/mobileIcons/dashboard/crops-card-icon.svg" />
                                </div>
                                <label className={styles.lable}>Crops</label>
                            </div>
                            <p className={styles.total123}>
                                {data?.length ? data[1]?.data.toLocaleString() : ""}
                            </p>
                        </div>
                        <div className={styles.farmscard} style={{ background: "#F0D4D4" }}>
                            <div className={styles.header}>
                                <div className={styles.container}>
                                    <img className={styles.farmicon} alt="" src="/mobileIcons/dashboard/images-card-icon.svg" />
                                </div>
                                <label className={styles.lable}>Images</label>
                            </div>
                            <p className={styles.total123}>
                                {data?.length ? data[2]?.data.toLocaleString() : ""}
                            </p>
                        </div>
                        <div className={styles.farmscard} style={{ background: "#D1F5E5" }}>
                            <div className={styles.header}>
                                <div className={styles.container}>
                                    <img className={styles.farmicon} alt="" src="/mobileIcons/dashboard/comments-card-icon.svg" />
                                </div>
                                <label className={styles.lable}>Comments</label>
                            </div>
                            <p className={styles.total123}>
                                {data?.length ? data[3]?.data.toLocaleString() : ""}
                            </p>

                        </div>
                    </div>

                    <div className={styles.gallaryBlock}>
                        <Typography variant="h4" color="red">Recent Uploads</Typography>
                        <div style={{ height: "36vh", overflowY: "auto" }}>

                            <LatestImagesComponent data={data?.length ? data[4]?.data : ""} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardStats;
