import { useEffect, useState } from "react"
import TimelineCard from "./left/timeline-card"
import TimelineCardRight from "./right/timeline-card-right"
import SelectComponenent from "../Core/SelectComponent"
import getAllFarms from "../../../lib/services/getAllFarmsService"

const TimeLineComponent = () => {

    const [data, setData] = useState<any>()
    const [formOptions, setFormOptions] = useState<any>()

    useEffect(() => {
        getLogsData("64e3255849ac66caca11a9c4")
        getFormDetails()
    }, [])

    const getFormDetails = async () => {
        let response = await getAllFarms()
        setFormOptions(response.data)
    }

    const captureFormName = (value: any) => {
        if (value) {
            let a: any = formOptions.find((item: any) => item.title == value)
            getLogsData(a?._id)

        }
    }

    const getLogsData = async (id: any) => {
        try {
            const response: any = await fetch(`http://localhost:3000/v1.0/farm/${id}/logs/${1}/${20}?order_by=${'from_date_time'}&order_type=asc`);
            const responseData: any = await response.json()

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

            setData(newArray)
        }
        catch (err) {
            console.log(err)
        }

    }

    return (
        <div>
            <SelectComponenent options={formOptions} captureFormName={captureFormName} />

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