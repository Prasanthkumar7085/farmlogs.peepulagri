import type { NextPage } from "next";
import {
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  FormHelperText,
  Select,
} from "@mui/material";
import styles from "./header.module.css";
import { ChangeEvent, useEffect, useState } from "react";
import AddLogHeader from "./AddLogHeader";
import { CategoriesType } from "@/types/categoryTypes";
import getAllCategoriesService from "../../../lib/services/Categories/getAllCategoriesService";
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
  const [category, setCategory] = useState<string>(singleLogDetails?.categories ? singleLogDetails?.categories : []);

  useEffect(() => {
    setFormDetails({
      title: title,
      description: description,
      categories: category
    })
    console.log({
      title: title,
      description: description,
      categories: category
    });

  }, [title, description, category])

  return (
    <div className={styles.primaryFormField}>
      <AddLogHeader />
      {/* <div className={styles.title}>
        <img className={styles.addAIcon} alt="Add Icon" src="/add-icon.svg" />
        <h2 className={styles.addALog}>Add A Log</h2>
      </div> */}
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
            <InputLabel color="primary">Select Category</InputLabel>
            <Select
              color="primary"
              name="category"
              multiple
              size="small"
              label="Select Category"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value)
              }}
            >
              {categoryOptions.map((item: any, index: number) => {
                return (
                  <MenuItem value={item.slug} key={index}>{item.category}</MenuItem>
                )
              })}
            </Select>
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
