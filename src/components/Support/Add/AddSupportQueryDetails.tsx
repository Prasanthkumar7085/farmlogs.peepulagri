import {
  Autocomplete,
  Checkbox,
  MenuItem,
  Select,
  TextField,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import getAllCategoriesService from "../../../../lib/services/Categories/getAllCategoriesService";
import { CategoriesType } from "@/types/categoryTypes";
import styles from "./AddSupportQueryDetails.module.css";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { SupportQueryDataDDetailsType } from "@/types/supportTypes";
import ErrorMessagesComponent from "@/components/Core/ErrorMessagesComponent";

const AddSupportQueryDetails = ({
  errorMessages,
  query,
  categories,
  description,
  setQuery,
  setCategories,
  setDescription,
}: SupportQueryDataDDetailsType) => {
  const [categoryOptions, setCategoryOptions] = useState<Array<CategoriesType>>(
    []
  );
  const [category, setCategory] = useState<Array<string>>(
    categories ? categories : []
  );
  const [defaultValue, setDefaultValue] = useState([]);

  const getAllCategories = async () => {
    const response = await getAllCategoriesService();
    if (response?.success) {
      setCategoryOptions(response?.data);
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  useEffect(() => {
    let categoryArray: any = category.length
      ? category.map((item: any) => item?.slug)
      : [];
    setCategories(categoryArray);
  }, [category]);

  useEffect(() => {
    if (categories?.length && categoryOptions.length) {
      let array = [...categories];
      let filterArray: any = categoryOptions.filter((item: CategoriesType) =>
        array.includes(item.slug)
      );
      setDefaultValue(filterArray);
    } else {
      setDefaultValue([]);
    }
  }, [categoryOptions, categories]);

  return (
    <div className="form-fields">
      <Typography
        variant="subtitle2"
        className={styles.label}
      >
        Type Your Query<span style={{ color: "red" }}>*</span>
      </Typography>
      <TextField
        style={{
          width: "100%",
          marginBlockEnd: "0.5rem",
          backgroundColor: "#ffffff",
        }}
        size="small"
        placeholder="Enter your query"
        value={query}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setQuery(e.target.value);
        }}
      />
      <ErrorMessagesComponent errorMessage={errorMessages?.title} />

      <Typography
        variant="subtitle2"
        className={styles.label}
      >
        Category<span style={{ color: "red" }}>*</span>
      </Typography>
      <Autocomplete
        value={defaultValue.length ? defaultValue : []}
        multiple
        disablePortal
        fullWidth
        id="combo-box-demo"
        className={styles.selectField}
        options={categoryOptions?.length ? categoryOptions : []}
        // renderInput={(params) => <TextField {...params} label="category" />}
        getOptionLabel={(e) => e.category}
        limitTags={1}
        renderInput={(params: any) => (
          <TextField
            {...params}
            placeholder={"Select Categories"}
            variant="outlined"
            autoComplete="off"
            size="small"
            inputProps={{
              ...params.inputProps,
            }}
            fullWidth
          />
        )}
        renderOption={(props, option, { selected }) => (
          <li {...props}>
            <Checkbox
              icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
              checkedIcon={<CheckBoxIcon fontSize="small" />}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option.category}
          </li>
        )}
        onChange={(e: any, value: any, reason: any) => {
          if (reason == "clear") {
            setCategory([]);
          }
          if (value.length) {
            setCategory(value);
          } else {
            setCategory([]);
          }
        }}
        style={{
          marginBlockEnd: "0.5rem",
        }}
      />
      <ErrorMessagesComponent errorMessage={errorMessages?.categories} />
      <Typography
        variant="subtitle2"
        className={styles.label}
      >
        Description<span style={{ color: "red" }}>*</span>
      </Typography>
      <TextareaAutosize
        className={styles.textAreaLg}
        value={description}
        placeholder="Description"
        minRows={4}
        onChange={(e: any) => setDescription(e.target.value)}
        style={{
          marginBlockEnd: "0.5rem",
        }}
      ></TextareaAutosize>
      <ErrorMessagesComponent errorMessage={errorMessages?.description} />
    </div>
  );
};
export default AddSupportQueryDetails;
