import type { NextPage } from "next";
import {
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  FormHelperText,
  Select,
  Autocomplete,
  Box,
  Checkbox,
} from "@mui/material";
import styles from "./header.module.css";
import { ChangeEvent, useEffect, useState } from "react";
import AddLogHeader from "./AddLogHeader";
import { CategoriesType } from "@/types/categoryTypes";
import getAllCategoriesService from "../../../lib/services/Categories/getAllCategoriesService";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import ErrorMessagesComponent from "../Core/ErrorMessagesComponent";


const Header = ({ setFormDetails, singleLogDetails, errorMessages }: any) => {


  const [categoryOptions, setCategoryOptions] = useState<Array<CategoriesType>>([]);

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

  const [title, setTitle] = useState<string>(
    singleLogDetails?.title ? singleLogDetails?.title : ""
  );
  const [description, setDescription] = useState<string>(
    singleLogDetails?.description
  );
  const [category, setCategory] = useState<Array<string>>(
    singleLogDetails?.categories ? singleLogDetails?.categories : []
  );
  const [defaultValue, setDefaultValue] = useState<any>([]);

  useEffect(() => {
    let categories = category.length && category.map((item: any) => item.slug);
    setDefaultValue(category);
    setFormDetails({
      title: title,
      description: description,
      categories: categories,
    });
  }, [title, description, category]);

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



  }, [errorMessages]);


  return (
    <div className={styles.primaryFormField}>
      <div className={styles.categoriesBox}>
        {/* <FormControl variant="outlined">
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
                error = { Boolean(errorMessages?.categories)}
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
        </FormControl> */}
      </div>
      <AddLogHeader />
      <div className={styles.container}>
        <div className={styles.rowParent}>
          <TextField
            className={styles.inputTitle}
            color="primary"
            variant="standard"
            type="text"
            name="log-title"
            placeholder="Enter log title*"
            fullWidth
            margin="none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <ErrorMessagesComponent errorMessage={errorMessages?.title} />
        </div>
        <div className={styles.row}>
          <TextField
            multiline
            className={styles.description}
            name="description"
            placeholder="Enter description here"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            minRows={3}
            maxRows={7}
            fullWidth
          />
          <ErrorMessagesComponent errorMessage={errorMessages?.description} />
        </div>
        {/* <div className={styles.threeDots}>
          <div className={styles.threeDotsChild} />
          <div className={styles.threeDotsChild} />
          <div className={styles.threeDotsChild} />
        </div> */}
      </div>
    </div>
  );
};

export default Header;
