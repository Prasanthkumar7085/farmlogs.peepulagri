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


const Header = ({ setFormDetails, singleLogDetails }: any) => {


  const [categoryOptions, setCategoryOptions] = useState<Array<CategoriesType>>([]);

  useEffect(() => {
    getAllCategories();
  }, [])

  const getAllCategories = async () => {
    const response = await getAllCategoriesService();
    console.log(response);
    if (response.success) {
      setCategoryOptions(response?.data);
    } else {
      setCategoryOptions([]);
    }

  }

  const [title, setTitle] = useState<string>(singleLogDetails?.title ? singleLogDetails?.title : "");
  const [description, setDescription] = useState<string>(singleLogDetails?.description);
  const [category, setCategory] = useState<Array<string>>(singleLogDetails?.categories ? singleLogDetails?.categories : []);
  const [defaultValue, setDefaultValue] = useState<any>([]);
  const [show, setShow] = useState(true);


  useEffect(() => {

    let categories = category.length && category.map((item: any) => item.slug)
    setFormDetails({
      title: title,
      description: description,
      categories: categories
    });
  }, [title, description, category]);


  useEffect(() => {
    if (singleLogDetails?.categories.length && categoryOptions.length) {
      let array = [...singleLogDetails?.categories];

      let filterArray = categoryOptions.filter((item: CategoriesType) => array.includes(item.slug));
      console.log(filterArray);
      setShow(false);
      setTimeout(() => {
        setShow(true);
      }, 1)

      setDefaultValue(filterArray);

    }
  }, [categoryOptions, singleLogDetails])

  return (
    <div className={styles.primaryFormField}>
      <AddLogHeader />
      <div className={styles.container}>
        <div className={styles.rowParent}>
          <div className={styles.row}>
            <TextField
              className={styles.inputTitle}
              color="primary"
              variant="standard"
              type="text"
              name="log-title"
              placeholder="Enter log title"
              fullWidth
              margin="none"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <FormControl sx={{ width: 200 }} variant="outlined">
            <Box>
              {show ? <Autocomplete
                defaultValue={defaultValue.length ? defaultValue : []}
              multiple
                disablePortal
                id="combo-box-demo"
                options={categoryOptions?.length ? categoryOptions : []}
                sx={{ width: 300 }}
                // renderInput={(params) => <TextField {...params} label="category" />}
                getOptionLabel={(e) => e.category}
                limitTags={1}
                renderInput={(params: any) => (
                  <TextField
                    {...params}
                    placeholder={'Select Categories'}
                    variant="outlined"
                    autoComplete='off'
                    size="small"
                    inputProps={{
                      ...params.inputProps
                    }}
                    fullWidth
                    sx={{ maxWidth: "200px" }}
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

                  if (reason == 'clear') {
                    setCategory([]);
                  }
                  if (value) {
                    setCategory(value);
                  }


                }}
              /> : ""}
            </Box>
            <FormHelperText />
          </FormControl>
        </div>
        <TextField
          multiline
          className={styles.description}
          name="description"
          placeholder="Enter description here"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          minRows={3}
          maxRows={7}
        />
        <div className={styles.threeDots}>
          <div className={styles.threeDotsChild} />
          <div className={styles.threeDotsChild} />
          <div className={styles.threeDotsChild} />
        </div>
      </div>
    </div>
  );
};

export default Header;
