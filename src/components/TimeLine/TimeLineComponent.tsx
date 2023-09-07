import { useCallback, useEffect, useRef, useState } from "react"
import TimelineCard from "./left/timeline-card"
import TimelineCardRight from "./right/timeline-card-right"
import SelectComponenent from "../Core/SelectComponent"
import getAllFarmsService from "../../../lib/services/FarmsService/getAllFarmsService"
import InfiniteScroll from "react-infinite-scroll-component"
import SelectComponenentForLogs from "../Core/SelectComponrntForLogs"
import { useSelector } from "react-redux";
import { useRouter } from "next/router"
import { CircularProgress } from "@mui/material"
import { setAllFarms } from "@/Redux/Modules/Farms";
import { useDispatch } from "react-redux";


const TimeLineComponent = () => {

    const router = useRouter();
    const dispatch = useDispatch();

    const accessToken = useSelector((state: any) => state.auth.userDetails?.access_token);

    const [data, setData] = useState<any>([]);
    const [farmOptions, setFarmOptions] = useState<any>();
    const [hasMore, setHasMore] = useState<any>(true);
    const [pageNumber, setPageNumber] = useState(1);
    const [logId, setLogId] = useState<any>();
    const [defaultValue, setDefaultValue] = useState<any>();
    const [loading, setLoading] = useState(false);


    useEffect(() => {

        if (router.isReady && accessToken) {
            getFormDetails(router.query?.farm_id as string);
        }
    }, [router.isReady, accessToken]);


    const getFormDetails = async (id: string) => {
        let response = await getAllFarmsService(accessToken);

        try {
            if (response?.success) {
                setFarmOptions(response?.data);
                dispatch(setAllFarms(response?.data))
                if (id) {
                    let selectedObject = response?.data?.length && response?.data.find((item: any) => item._id == id);
                    captureFarmName(selectedObject);
                    setDefaultValue(selectedObject)
                } else {

                    captureFarmName(response?.data[0]);
                    setDefaultValue(response?.data[0]);
                }
            }
        } catch (err) {
            console.error(err);

        }
    }

    const captureFarmName = (selectedObject: any) => {
        setData([]);

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
        setLoading(true);
        try {
            const response: any = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/farm/${id}/logs/${page}/${5}?order_by=${'from_date_time'}&order_type=desc`);
            const responseData: any = await response.json();

            setHasMore(responseData.has_more); // No more data available
            let currentDate: any = null;
            let currentAlign = "left";

            let temp: any;
            if (changeFarm) {
                temp = [...responseData?.data];
            } else {
                temp = [...data, ...responseData?.data];
            }

            const newArray = temp.map((item: any) => {
                    if (item.from_date_time !== currentDate) {
                        currentAlign = currentAlign === "right" ? "left" : "right";
                        currentDate = item.from_date_time;
                    }

                    return { ...item, align: currentAlign };
                });
            setData(newArray);


        }
        catch (err) {
            console.error(err)
        } finally {
            setLoading(false);
        }

    }

    return (
        <div>
            {!loading ? <SelectComponenentForLogs setDefaultValue={setDefaultValue} defaultValue={defaultValue} options={farmOptions} captureFarmName={captureFarmName} /> : ""}

            <InfiniteScroll
                dataLength={data.length}
                next={() => setPageNumber(prev => prev + 1)}
                hasMore={hasMore}
                loader={<CircularProgress />}
                endMessage={<p style={{ textAlign: 'center' }}>No More Logs!</p>}
            >
                {data && data.map((item: any, index: any) => {
                    if (item.align == "left") {
                        return (
                            <div style={{ marginTop: "30px" }} key={index}>
                                <TimelineCard data1={item} />
                            </div>
                        )
                    }
                    else {
                        return (
                            <div style={{ marginTop: "30px" }} key={index}>
                                <TimelineCardRight data1={item} />
                            </div>
                        )
                    }
                })}
            </InfiniteScroll> 


        </div >
    )
}
export default TimeLineComponent