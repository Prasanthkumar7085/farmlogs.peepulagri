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

const CardWorkType = ({ register, captureDates }: any) => {


  const captureDateValue = (fromDate: string, toDate: string) => {
    console.log(fromDate, toDate);
    captureDates(fromDate, toDate)

  }
  return (
      <div className={styles.cardworktype}>
        <div className={styles.conatiner}>
          <div className={styles.workType}>
            <p className={styles.label}>Work Type</p>
            <FormControl className={styles.dropdown} variant="outlined">
              <InputLabel color="primary" />
              <Select color="primary" defaultValue="Choose Type" size="small" {...register('work_type', {
                onChange: (e: any) => console.log(e)
              })} >
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
              <DateRangePickerComponent captureDateValue={captureDateValue} register={register} />
            </div>
          </div>
        </div>
      </div>

  );
};

export default CardWorkType;
