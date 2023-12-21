import type { NextPage } from "next";
import { useState } from "react";
import { TextField, Icon } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import styles from "./list-header.module.css";
import moment from "moment";
import { DateRangePicker } from 'rsuite';
import "rsuite/dist/rsuite.css";

const ListHeader = ({ onDateChange }: any) => {
  const [frameDateTimePickerValue, setFrameDateTimePickerValue] = useState<[Date, Date] | null>(null);
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className={styles.listheader}>
        {/* <div className={styles.heading}>Today’s Tasks</div>
        <div>
          <DateRangePicker
            onChange={(value: [Date, Date] | null) => {
              setFrameDateTimePickerValue(value);
              onDateChange(value);
            }}
            value={frameDateTimePickerValue}
            placement="auto"
            style={{ width: '100%' }}
          />
        </div> */}
      </div>
    </LocalizationProvider>
  );
};

export default ListHeader;
