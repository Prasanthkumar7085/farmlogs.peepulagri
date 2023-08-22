import moment from "moment";
import { useState } from "react";
import { DateRangePicker, Stack } from "rsuite";
import TextField from '@mui/material/TextField';
import "rsuite/dist/rsuite.css";


const DateRangePickerComponent = ({ captureDateValue, ...props }: any) => {

    const [fromDate, setFromDate] = useState<any>([new Date(), new Date()]);

    const [date, setDate] = useState([moment(new Date()).format("YYYY-MM-DD"), moment(new Date()).format("YYYY-MM-DD")])

    const { register, ...rest } = props;
    return (
        <Stack >
            <DateRangePicker
                {...rest}
                showOneCalendar
                format="dd-MM-yyyy"
                size="lg"
                value={fromDate}
                onChange={(newDate: any) => {
                    setFromDate(newDate)
                    if (newDate) {
                        let date1 = new Date(moment(new Date(newDate[0])).format("YYYY-MM-DD")).toISOString().substring(0, 10);
                        let date2 = new Date(moment(new Date(newDate[1])).format("YYYY-MM-DD")).toISOString().substring(0, 10);
                        captureDateValue(date1, date2);
                        setDate([date1, date2])
                    }
                    else {
                        captureDateValue("", "")
                    }
                }}
            />

            <TextField
                sx={{ display: "none" }}
                value={date}
                {...register('date', {

                })}
            />
        </Stack>
    )
}
export default DateRangePickerComponent
