import moment from "moment";
import { useState } from "react";
import { DateRangePicker, Stack } from "rsuite";
import TextField from '@mui/material/TextField';
import "rsuite/dist/rsuite.css";
import { styled } from "@mui/material";
import styles from "./DateRangePicker.module.css"

const DateRangePickerComponent = ({ captureDateValue, ...props }: any) => {


    const toDate = props?.defaultValue[1]?.slice(0, 10);

    const [fromDate, setFromDate] = useState<any>(props?.defaultValue[0] ? [new Date(props?.defaultValue[0]), new Date(toDate)] : []);

    const [date, setDate] = useState([moment(new Date()).format("YYYY-MM-DD"), moment(new Date()).format("YYYY-MM-DD")])

    const { ...rest } = props;
    return (
        <Stack >
            <DateRangePicker
                disabledDate={(date: any) => {
                    return date.getTime() > new Date().getTime();
                }}
                {...rest}
                showOneCalendar
                format="dd-MM-yyyy"
                placeholder={'dd-mm-yyyy ~ dd-mm-yyyy'}
                size="lg"
                className={styles.dateRangePickerField}
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
        </Stack>
    )
}
export default DateRangePickerComponent
