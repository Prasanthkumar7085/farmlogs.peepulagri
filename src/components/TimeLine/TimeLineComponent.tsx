import { useCallback, useEffect, useRef, useState } from "react"
import TimelineCard from "./left/timeline-card"
import TimelineCardRight from "./right/timeline-card-right"
import SelectComponenent from "../Core/SelectComponent"
import getAllFarmsService from "../../../lib/services/FarmsService/getAllFarmsService"
import InfiniteScroll from "react-infinite-scroll-component"
import SelectComponenentForLogs from "../Core/SelectComponrntForLogs"
import { useSelector } from "react-redux";
import { useRouter } from "next/router"
import { CircularProgress, Typography } from "@mui/material"
import { setAllFarms } from "@/Redux/Modules/Farms";
import { useDispatch } from "react-redux";
import styles from "./TimeLineComponent.module.css"
import { relative } from "path"
import ImageComponent from "../Core/ImageComponent"
import styles1 from "./../../../pages/farm/index.module.css";
import getAllCategoriesService from "../../../lib/services/Categories/getAllCategoriesService"
import { CategoriesType } from "@/types/categoryTypes"
import NorthIcon from '@mui/icons-material/North';
import FarmDetailsCard from "./FarmDetailsCard"
import LoadingComponent from "../Core/LoadingComponent"


const TimeLineComponent = () => {

    const router = useRouter();
    const dispatch = useDispatch();

    const accessToken = useSelector((state: any) => state.auth.userDetails?.access_token);

    const [data, setData] = useState<any>([]);
    const [farmOptions, setFarmOptions] = useState<any>([]);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [pageNumber, setPageNumber] = useState(1);
    const [logId, setLogId] = useState<any>();
    const [defaultValue, setDefaultValue] = useState<any>('');
    const [loading, setLoading] = useState(true);
    const [categoriesList, setCategoriesList] = useState<Array<CategoriesType>>([]);
    const [pageLoading, setPageLoading] = useState(false);


    useEffect(() => {

        if (router.isReady && accessToken) {
            getCategories();
            getFormDetails(router.query?.farm_id as string);
        }
    }, [router.isReady, accessToken]);

    const getCategories = async () => {
        const response = await getAllCategoriesService();

        if (response && response?.success) {
            setCategoriesList(response?.data);
        }
    }

    const getFormDetails = async (id: string) => {
        setLoading(true);
        setPageLoading(true);
        let response = await getAllFarmsService(accessToken);

        try {
            if (response?.success && response.data.length) {
                setFarmOptions(response?.data);
                if (id) {
                    let selectedObject = response?.data?.length && response?.data.find((item: any) => item._id == id);

                    setDefaultValue(selectedObject.title)
                    captureFarmName(selectedObject);
                } else {
                    router.push({ pathname: "/timeline", query: { farm_id: response?.data[0]._id } })
                    setDefaultValue(response?.data[0].title);
                    captureFarmName(response?.data[0]);
                }
            } else {
                setFarmOptions([]);
                setPageLoading(false);
            }
        } catch (err) {
            console.error(err);
            setLoading(false);
            setPageLoading(false);
        }
    }

    const captureFarmName = (selectedObject: any) => {
        setData([]);
        setHasMore(true)

        if (selectedObject && Object.keys(selectedObject).length) {
            setPageNumber(1);
            setLogId(selectedObject?._id);
            getLogsData(selectedObject?._id, 1, true)
        }
    }

    useEffect(() => {
        getLogsData(logId ? logId : (farmOptions?.length ? farmOptions[0]?._id : ""), pageNumber, false)
    }, [pageNumber]);


    const getLogsData = async (id: any, page: number, changeFarm: boolean) => {
        if (changeFarm) {
            setPageLoading(true);
        }
        if (id) {
            setLoading(true);
            try {
                const response: any = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/farm/${id}/logs/${page}/${10}?order_by=${'to_date_time'}&order_type=asc`);
                const responseData: any = await response.json();

                if (responseData?.has_more || responseData?.has_more == false) {
                    setHasMore(responseData?.has_more);
                }
                let currentDate: any = null;
                let currentAlign = "left";

                let temp: any;
                if (changeFarm) {
                    temp = [...responseData?.data];
                } else {
                    temp = [...data, ...responseData?.data];
                }

                const newArray = temp.map((item: any) => {
                    if (item.to_date_time?.slice(0, 10) !== currentDate?.slice(0, 10)) {
                        currentAlign = currentAlign === "right" ? "left" : "right";
                        currentDate = item.to_date_time;
                    }

                    return { ...item, align: currentAlign };
                });
                setData(newArray);
            }
            catch (err) {
                console.error(err)
            } finally {
                setLoading(false);
                setPageLoading(false);
            }
        }

    }

    return (
        <div className={styles.TimelineCards}>
            {farmOptions && farmOptions.length ?
                <div className={styles.containerLg} style={{ position: "relative", zIndex: 110 }}>
                    <SelectComponenentForLogs setDefaultValue={setDefaultValue} defaultValue={defaultValue} options={farmOptions} captureFarmName={captureFarmName} loading={loading} />
                    {data.length ? <InfiniteScroll
                        className={styles.infiniteScrollComponent}
                        dataLength={data.length}
                        next={() => setPageNumber(prev => prev + 1)}
                        hasMore={hasMore}
                        loader={<div className={styles.pageLoader}><CircularProgress /></div>}
                        endMessage={<a href="#" className={styles.endOfLogs}>{hasMore ? "" : 'Scroll to Top'}</a>}
                    >
                        {data && data.map((item: any, index: any) => {
                            if (item.align == "left") {
                                return (
                                    <div className={styles.TimelineCardBranch} key={index}>
                                        <TimelineCard categoriesList={categoriesList} data={item} />
                                    </div>
                                )
                            }
                            else {
                                return (
                                    <div className={styles.TimelineCardBranch} key={index}>
                                        <TimelineCardRight categoriesList={categoriesList} data={item} />
                                    </div>
                                )
                            }
                        })}
                    </InfiniteScroll> :
                        (!loading ? <div>
                            <div className={styles1.noDataScreen}>
                                <ImageComponent
                                    src={'/no-timeline-data.png'}
                                    height={500}
                                    width={700}
                                />
                                {/* <div className={styles1.content}>
                                    <Typography className={styles1.subTitle} variant="h4">
                                        No Logs Found!
                                    </Typography>
                                    <Typography className={styles1.description}>
                                        {"Looks like you havn't added any Logs to this farm yet."} <br />
                                        {"Add Logs to Get Started"}
                                    </Typography>
                                </div> */}
                            </div>
                        </div> : "")
                    }
                </div> :
                (!pageLoading ?
                    <div>
                    <div className={styles1.noDataScreen}>
                        <ImageComponent
                            src={'../no-logs.svg'}
                            height={300}
                            width={300}
                        />
                        <div className={styles1.content}>
                            <Typography className={styles1.subTitle} variant="h4">
                                No Farms Found!
                            </Typography>
                            <Typography className={styles1.description}>
                                {"Looks like you havn't added any Farm yet."} <br />
                                {"Add Farms to Get Started"}
                            </Typography>
                        </div>
                    </div>
                </div> : "")}
            <LoadingComponent loading={pageLoading} />
        </div>
    )
}
export default TimeLineComponent