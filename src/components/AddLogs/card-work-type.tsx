import type { NextPage } from "next";
import {
  FormControl,
  InputLabel,
  MenuItem,
  FormHelperText,
  Select,
  TextField,
  Icon,
  Checkbox,
  Autocomplete,
  Box,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import styles from "./card-work-type.module.css";
import DateRangePickerComponent from "../Core/DateRangePicker";
import { useEffect, useState } from "react";
import ErrorMessagesComponent from "../Core/ErrorMessagesComponent";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import getAllCategoriesService from "../../../lib/services/Categories/getAllCategoriesService";
import { CategoriesType } from "@/types/categoryTypes";
const CardWorkType = ({ errorMessages, captureDates, setWorkType, singleLogDetails, setActiveStepBasedOnData, setCategoryList }: any) => {

  const [work, setWork] = useState<any>()
  const [categoryOptions, setCategoryOptions] = useState<Array<CategoriesType>>([]);
  const [list, setList] = useState<any>()

  const [defaultValue, setDefaultValue] = useState<any>([]);

  const [category, setCategory] = useState<Array<string>>(
    singleLogDetails?.categories ? singleLogDetails?.categories : []
  );

  const captureDateValue = (fromDate: string, toDate: string) => {
    let categories = category.length && category.map((item: any) => item.slug);
    setList(categories)
    captureDates(fromDate, toDate, categories)
    if (fromDate && toDate && work) {
      setActiveStepBasedOnData(1);
    } else {
      setActiveStepBasedOnData(1, false);
    }
  }


  const handleChange = (e: any) => {
    setWork(e.target.value)
    setWorkType(e.target.value)
  }


  //get all Categories 
  useEffect(() => {
    getAllCategories();
  }, []);

  const getAllCategories = async () => {
    const response = await getAllCategoriesService();
    if (response?.success) {
      setCategoryOptions(response?.data);
    } else {
      setCategoryOptions([]);
    }
  };

  useEffect(() => {
    if (singleLogDetails?.categories.length && categoryOptions.length) {
      let array = [...singleLogDetails?.categories];

      let filterArray = categoryOptions.filter((item: CategoriesType) =>
        array.includes(item.slug)
      );

      setDefaultValue(filterArray);
    }
  }, [categoryOptions, singleLogDetails]);

  useEffect(() => {
    let categories = category.length && category.map((item: any) => item.slug);
    setList(categories)
    setDefaultValue(category);
  }, [category]);

  return (
    <div className={styles.cardworktype}>
      <div className={styles.conatiner}>
        <div className={styles.categoriesRow}>
          
          <p className={styles.label}>Select Category<span style={{ color: "red" }}>*</span></p>
          <FormControl variant="outlined" fullWidth>
            <Box>
              <Autocomplete
                value={defaultValue.length ? defaultValue : []}
                multiple
                disablePortal
                id="combo-box-demo"
                style={{ height: "55px", zIndex: "1000" }}
                options={categoryOptions?.length ? categoryOptions : []}
                // renderInput={(params) => <TextField {...params} label="category" />}
                getOptionLabel={(e) => e.category}
                limitTags={3}
                renderInput={(params: any) => (
                  <TextField
                    {...params}
                    placeholder={"Select Categories*"}
                    variant="outlined"
                    autoComplete="off"
                    error={Boolean(errorMessages?.categories)}
                    helperText={errorMessages?.categories}
                    size="small"
                    inputProps={{
                      ...params.inputProps,
                    }}
                    fullWidth
                    className={styles.selectField}
                  />
                )}
                renderOption={(props, option, { selected }) => (
                  <li {...props} className={styles.optionsList}>
                    <Checkbox
                      icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                      checkedIcon={<CheckBoxIcon fontSize="small" />}
                      checked={selected}
                    />
                    {option.category}
                  </li>
                )}
                onChange={(e: any, value: any, reason: any) => {
                  if (reason == "clear") {
                    setCategory([]);
                  }
                  if (value) {
                    setCategory(value);
                  }
                }}
              />
            </Box>
            <FormHelperText />
          </FormControl>
        </div>
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
            <ErrorMessagesComponent errorMessage={errorMessages?.to_date_time} />
          </div>
        </div>
      </div>
    </div>

  );
};

export default CardWorkType;
