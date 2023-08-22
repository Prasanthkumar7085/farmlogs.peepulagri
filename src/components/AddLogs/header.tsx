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
import { ChangeEvent, useState } from "react";
const Header = ({ register }: any) => {

  const [category, setCategory] = useState<string>('');

  const categoryOptions = [
    { title: 'Soil Preparation', value: "soil_preparation" },
    { title: 'Planting', value: "plainting" },
    { title: 'Irrigation', value: "irrigation" },
    { title: 'Fertilization', value: "fertilization" },
    { title: 'Pest Management', value: "pest_management" },
    { title: 'Weeding', value: "weeding" },
    { title: 'Crop Rotation', value: "crop_rotation" },
    { title: 'Harvesting', value: "harvesting" },
    { title: 'Equipment Management', value: "equipment_management" },
    { title: 'Other', value: "other" },
  ]
  return (
    <div className={styles.primaryFormField}>
      <div className={styles.title}>
        <img className={styles.add1Icon} alt="" src="/add-1.svg" />
        <h2 className={styles.addALog}>Add A Log</h2>
      </div>
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
              size="medium"
              margin="none"
              {...register('title')}
            />
          </div>
          <FormControl sx={{ width: 200 }} variant="outlined">
            <InputLabel color="primary">Select Category</InputLabel>
            <Select
              color="primary"
              name="category"
              size="small"
              label="Select Category"
              value={category}
              {...register('category')}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setCategory(e.target.value)
              }}
            >
              {categoryOptions.map((item: any, index: number) => {
                return (
                  <MenuItem value={item.value} key={index}>{item.title}</MenuItem>
                )
              })}
            </Select>
            <FormHelperText />
          </FormControl>
        </div>
        <TextField
          className={styles.description}
          color="primary"
          variant="standard"
          multiline
          rows={3}
          name="description"
          placeholder="Enter description here"
          margin="normal"
          {...register('description')}
          fullWidth

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
