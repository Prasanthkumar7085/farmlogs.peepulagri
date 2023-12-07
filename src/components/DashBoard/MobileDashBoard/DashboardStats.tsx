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

            <div className={styles.row}>
                <div className={styles.farmscard}>
                    <div className={styles.header}>
                        <div className={styles.container}>
                            <img className={styles.farmicon} alt="" src="/farmicon.svg" />
                        </div>
                        <label className={styles.lable}>Farms</label>
                    </div>
                    <p className={styles.total123}>
                        <span>{`Total `}</span>
                        <span className={styles.span}>{data?.length ? data[0]?.data.toLocaleString() : ""}</span>
                    </p>
                </div>
                <div className={styles.farmscard}>
                    <div className={styles.header}>
                        <div className={styles.container}>
                            <img className={styles.farmicon} alt="" src="/farmicon.svg" />
                        </div>
                        <label className={styles.lable}>Crops</label>
                    </div>
                    <p className={styles.total123}>
                        <span>{`Total `}</span>
                        <span className={styles.span}>{data?.length ? data[1]?.data.toLocaleString() : ""}</span>
                    </p>
                </div>
            </div>
            <div className={styles.row}>
                <div className={styles.farmscard}>
                    <div className={styles.header}>
                        <div className={styles.container}>
                            <img className={styles.farmicon} alt="" src="/farmicon.svg" />
                        </div>
                        <label className={styles.lable}>Images</label>
                    </div>
                    <p className={styles.total123}>
                        <span>{`Total `}</span>
                        <span className={styles.span}>{data?.length ? data[2]?.data.toLocaleString() : ""}</span>
                    </p>
                </div>
                <div className={styles.farmscard}>
                    <div className={styles.header}>
                        <div className={styles.container}>
                            <img className={styles.farmicon} alt="" src="/farmicon.svg" />
                        </div>
                        <label className={styles.lable}>Comments</label>
                    </div>
                    <p className={styles.total123}>
                        <span>{`Total `}</span>
                        <span className={styles.span}>{data?.length ? data[3]?.data.toLocaleString() : ""}</span>
                    </p>
                </div>
            </div>

            <div style={{ width: "100%" }}>
                <Typography variant="body1" color="red">Recent Uploads</Typography>
                <LatestImagesComponent data={data?.length ? data[4]?.data : ""} />
            </div>
        </div>
    );
};

export default DashboardStats;
