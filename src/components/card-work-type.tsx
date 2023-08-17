import type { NextPage } from "next";
import { useState } from "react";
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
const CardWorkType: NextPage = () => {
  const [inputDateTimePickerValue, setInputDateTimePickerValue] = useState<
    string | null
  >(null);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className={styles.cardworktype}>
        <div className={styles.conatiner}>
          <div className={styles.workType}>
            <p className={styles.label}>Work Type</p>
            <FormControl className={styles.dropdown} variant="outlined">
              <InputLabel color="primary" />
              <Select color="primary" defaultValue="Choose Type" size="small">
                <MenuItem value="Select All">Select All</MenuItem>
                <MenuItem value="Machinery">Machinery</MenuItem>
                <MenuItem value="Manual">Manual</MenuItem>
              </Select>
              <FormHelperText />
            </FormControl>
          </div>
          <div className={styles.date}>
            <p className={styles.label}>Date</p>
            <div className={styles.dropdown}>
              <DatePicker
                value={inputDateTimePickerValue}
                onChange={(newValue: any) => {
                  setInputDateTimePickerValue(newValue);
                }}
                slotProps={{
                  textField: {
                    variant: "standard",
                    size: "medium",
                    required: true,
                    color: "primary",
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default CardWorkType;
