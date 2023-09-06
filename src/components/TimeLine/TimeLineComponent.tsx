import { useEffect, useState } from "react"
import TimelineCard from "./left/timeline-card"
import TimelineCardRight from "./right/timeline-card-right"
import SelectComponenent from "../Core/SelectComponent"
import getAllFarmsService from "../../../lib/services/FarmsService/getAllFarmsService"
import InfiniteScroll from "react-infinite-scroll-component"
import SelectComponenentForLogs from "../Core/SelectComponrntForLogs"
import { useSelector } from "react-redux";
import { useRouter } from "next/router"
import { CircularProgress } from "@mui/material"


const TimeLineComponent = () => {

    const router = useRouter();

    const accessToken = useSelector((state: any) => state.auth.userDetails?.access_token);

    const [data, setData] = useState<any>([]);
    const [farmOptions, setFarmOptions] = useState<any>()
    const [items, setItems] = useState<any>([]);
    const [hasMore, setHasMore] = useState<any>(true);
    const [pageNumber, setPageNumber] = useState(1);
    console.log(pageNumber)
    const [logId, setLogId] = useState<any>();
    const [defaultValue, setDefaultValue] = useState<any>();

    useEffect(() => {
        // getLogsData("", 1, 20)
        if (router.isReady && accessToken) {
            getFormDetails(router.query?.farm_id as string);
        }
    }, [router.isReady, accessToken])


    const getFormDetails = async (id: string) => {
        let response = await getAllFarmsService(accessToken)
        if (response?.success) {
            setFarmOptions(response?.data);
            if (id) {
                let selectedObject = response?.data?.length && response?.data.find((item: any) => item._id == id);
                captureFarmName(selectedObject);
                setDefaultValue(selectedObject)
            } else {
                captureFarmName(response?.data[0]);
                setDefaultValue(response?.data[0])
            }
        }
    }

    const captureFarmName = (selectedObject: any) => {
        console.log(selectedObject);
        setData([])


        if (selectedObject && Object.keys(selectedObject).length) {
            setLogId(selectedObject?._id);
            setPageNumber(1)

        }
    }
    useEffect(() => {
        if (logId && !data.length) {
            getLogsData(logId, 1, 20);
        }
    }, [logId, data])


    const getLogsData = async (id: any, page: number, limit: number) => {
        router.push({ pathname: "/timeline", query: { farm_id: id } })

        try {
            const response: any = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/farm/${id}/logs/${page}/${5}?order_by=${'from_date_time'}&order_type=desc`);
            const responseData: any = await response.json();

            if (responseData?.data?.length == 0) {
                setHasMore(false); // No more data available
            }
            else {
                let currentDate: any = null;
                let currentAlign = "left";
                let temp = [...data, ...responseData?.data]

                const newArray = temp.map((item: any) => {
                    if (item.from_date_time !== currentDate) {
                        currentAlign = currentAlign === "right" ? "left" : "right";
                        currentDate = item.from_date_time;
                    }

                    return { ...item, align: currentAlign };
                });
                setData(newArray);
                setPageNumber(pageNumber + 1);



            }

        }
        catch (err) {
            console.error(err)
        }

    }

    return (
        <div>
            <SelectComponenentForLogs defaultValue={defaultValue} options={farmOptions} captureFarmName={captureFarmName} />

            <InfiniteScroll
                dataLength={data.length}
                next={() => getLogsData(logId ? logId : (farmOptions.length ? farmOptions[0]?._id : ""), pageNumber, 10)}
                hasMore={hasMore}
                loader={<CircularProgress />}
                endMessage={<p style={{ textAlign: 'center' }}>{"You've reached the end of the data!"}</p>}
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