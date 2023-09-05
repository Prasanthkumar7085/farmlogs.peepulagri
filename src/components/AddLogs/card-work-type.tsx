import type { NextPage } from "next";
import {
  FormControl,
  InputLabel,
  MenuItem,
  FormHelperText,
  Select,
  TextField,
  Icon,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import styles from "./card-work-type.module.css";
import DateRangePickerComponent from "../Core/DateRangePicker";
import { useState } from "react";
import ErrorMessagesComponent from "../Core/ErrorMessagesComponent";

const CardWorkType = ({ errorMessages, captureDates, setWorkType, singleLogDetails, setActiveStepBasedOnData }: any) => {

  const [work, setWork] = useState<any>()

  const captureDateValue = (fromDate: string, toDate: string) => {
    captureDates(fromDate, toDate)
    if (fromDate && toDate && work) {
      setActiveStepBasedOnData(1);
    }
  }
  const handleChange = (e: any) => {
    setWork(e.target.value)
    setWorkType(e.target.value)
  }
  return (
    <div className={styles.cardworktype}>
      <div className={styles.conatiner}>
        <div className={styles.workType}>
          <p className={styles.label}>Work Type<span style={{ color: "red" }}>*</span></p>
          <FormControl className={styles.dropdown} variant="outlined">
            <InputLabel color="primary" />
            <Select color="primary" size="small" onChange={handleChange} value={work} defaultValue={singleLogDetails?.work_type}>
              <MenuItem value="ALL">ALL</MenuItem>
              <MenuItem value="MACHINERY">MACHINERY</MenuItem>
              <MenuItem value="MANUAL">MANUAL</MenuItem>
            </Select>
            <ErrorMessagesComponent errorMessage={errorMessages?.work_type} />
            <FormHelperText />
          </FormControl>
        </div>
        <div className={styles.date}>
          <p className={styles.label}>Date<span style={{ color: "red" }}>*</span></p>
          <div className={styles.dropdown}>
            <DateRangePickerComponent captureDateValue={captureDateValue} defaultValue={[singleLogDetails?.from_date_time, singleLogDetails?.to_date_time]} />
            <ErrorMessagesComponent errorMessage={errorMessages?.from_date_time} />
          </div>
        </div>
      </div>
    </div>

  );
};

export default CardWorkType;
