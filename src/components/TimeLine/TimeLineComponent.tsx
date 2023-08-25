import { useEffect, useState } from "react"
import TimelineCard from "./left/timeline-card"
import TimelineCardRight from "./right/timeline-card-right"
import SelectComponenent from "../Core/SelectComponent"
import getAllFarms from "../../../lib/services/getAllFarmsService"
import InfiniteScroll from "react-infinite-scroll-component"

const TimeLineComponent = () => {

    const [data, setData] = useState<any>([])
    const [formOptions, setFormOptions] = useState<any>()
    const [items, setItems] = useState<any>([]);
    const [hasMore, setHasMore] = useState<any>(true);
    const [pageNumber, setPageNumber] = useState(1);
    const [logId, setLogId] = useState<any>()

    useEffect(() => {
        getLogsData(logId ? logId : "64e3255849ac66caca11a9c4", 1, 20)
        getFormDetails()
    }, [])

    const getFormDetails = async () => {
        let response = await getAllFarms()
        setFormOptions(response.data)
    }

    const captureFormName = (value: any) => {
        if (value) {
            let a: any = formOptions.find((item: any) => item.title == value)
            getLogsData(a?._id, 1, 20)
            setLogId(a?._id)
            setData([])

        }
    }



    const getLogsData = async (id: any, page: number, limit: number) => {
        try {
            const response: any = await fetch(`http://localhost:3000/v1.0/farm/${id ? id : "64e3255849ac66caca11a9c4"}/logs/${page}/${10}?order_by=${'from_date_time'}&order_type=asc`);
            const responseData: any = await response.json()
            console.log(responseData)

            //set align key to the objs
            let currentDate: any = null;
            let currentAlign = "left";
            const newArray = responseData.data.map((item: any) => {
                if (item.from_date_time !== currentDate) {
                    currentAlign = currentAlign === "right" ? "left" : "right";
                    currentDate = item.from_date_time;
                }

                return { ...item, align: currentAlign };
            });

            if (newArray?.length == 0) {
                setHasMore(false); // No more data available
            } else {
                setData([...data, ...newArray]);
                setPageNumber(pageNumber + 1);
            }

        }
        catch (err) {
            console.log(err)
        }

    }

    return (
        <div>
            <SelectComponenent options={formOptions} captureFormName={captureFormName} />

            <InfiniteScroll
                dataLength={data.length}
                next={() => getLogsData(logId ? logId : "64e3255849ac66caca11a9c4", pageNumber, 10)}
                hasMore={hasMore}
                loader={<h4>Loading...</h4>}
                endMessage={<p style={{ textAlign: 'center' }}>You've reached the end of the data!</p>}

            >
                {data && data.map((item: any, index: any) => {
                    if (item.align == "left") {
                        return (
                            <div style={{ marginTop: "30px" }}>
                                <TimelineCard key={index} data={item} />
                            </div>
                        )
                    }
                    else {
                        return (
                            <div style={{ marginTop: "30px" }}>
                                <TimelineCardRight key={index} data={item} />
                            </div>
                        )
                    }
                })}
            </InfiniteScroll>


        </div >
    )
}
export default TimeLineComponent