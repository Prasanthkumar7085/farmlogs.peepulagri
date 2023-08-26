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

const CardWorkType = ({ register, captureDates, setWorkType, singleLogDetails }: any) => {

  const [work, setWork] = useState<any>()

  const captureDateValue = (fromDate: string, toDate: string) => {
    captureDates(fromDate, toDate)

  }
  const handleChange = (e: any) => {
    setWork(e.target.value)
    setWorkType(e.target.value)
  }
  return (
    <div className={styles.cardworktype}>
      <div className={styles.conatiner}>
        <div className={styles.workType}>
          <p className={styles.label}>Work Type</p>
          <FormControl className={styles.dropdown} variant="outlined">
            <InputLabel color="primary" />
            <Select color="primary" size="small" onChange={handleChange} value={work} defaultValue={singleLogDetails?.work_type}>
              <MenuItem value="ALL">ALL</MenuItem>
              <MenuItem value="MACHINARY">MACHINARY</MenuItem>
              <MenuItem value="MANUAL">MANUAL</MenuItem>
            </Select>
            <FormHelperText />
          </FormControl>
        </div>
        <div className={styles.date}>
          <p className={styles.label}>Date</p>
          <div className={styles.dropdown}>
            <DateRangePickerComponent captureDateValue={captureDateValue} defaultValue={[singleLogDetails?.from_date_time, singleLogDetails?.to_date_time]} />
          </div>
        </div>
      </div>
    </div>

  );
};

export default CardWorkType;
