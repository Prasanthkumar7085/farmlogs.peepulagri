import { useEffect, useState } from "react"
import TimelineCard from "./left/timeline-card"
import TimelineCardRight from "./right/timeline-card-right"

const TimeLineComponent = () => {

    const [data, setData] = useState<any>()

    useEffect(() => {
        getLogsData()
    }, [])

    const getLogsData = async () => {
        try {
            const response: any = await fetch(`http://localhost:3000/v1.0/farm/${'64e3255849ac66caca11a9c4'}/logs/${1}/${20}`);
            const responseData: any = await response.json()
            console.log(responseData)


            let currentDate: any = null;
            let currentAlign = "left";

            const newArray = responseData.data.map((item: any) => {
                if (item.from_date_time !== currentDate) {
                    currentAlign = currentAlign === "right" ? "left" : "right";
                    currentDate = item.from_date_time;
                }

                return { ...item, align: currentAlign };
            });

            setData(newArray)

        }
        catch (err) {
            console.log(err)
        }

    }


    let temp: any = []
    return (
        <div>

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

        </div >
    )
}
export default TimeLineComponent