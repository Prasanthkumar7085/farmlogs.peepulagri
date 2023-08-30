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
const Header = ({ setFormDetails, singleLogDetails }: any) => {

  const categoryOptions = [
    { title: 'Soil Preparation', value: "soil_preparation" },
    { title: 'Planting', value: "plainting" },
    { title: 'Irrigation', value: "irrigation" },
    { title: 'Fertilization', value: "fertilization" },
    { title: 'Pest Management', value: "pest_management" },
    { title: 'Weeding', value: "weeding" },
    { title: 'Crop Rotation', value: "crop_rotation" },
    { title: 'Harvesting', value: "harvesting" },

    // { title: 'Equipment Management', value: "equipment_management" },
    // { title: 'Other', value: "other" },

    { title: 'Livestock Care', value: "livestock_care", color: "#FFD700" },
    { title: 'Breeding & Reproduction', value: "breeding_reproduction", color: "#FF80AB" },
    { title: 'Equipment Management', value: "equipment_management", color: "#78909C" },
    { title: 'Market & Scale Management', value: "market_scale_management", color: "#26A69A" },
    { title: 'Environmental Stewardship', value: "enviranmental_stewardship", color: "#4CAF50" },
    { title: 'Weather Monitoring', value: "weather_monitoring", color: "#42A5F5" },
    { title: 'Financial Management', value: "financial_management", color: "#FFB74D" },
    { title: 'Research and Learning', value: "research_and_learning", color: "#FF5722" },
  ];

  const [title, setTitle] = useState<string>(singleLogDetails?.title ? singleLogDetails?.title : "");
  const [description, setDescription] = useState<string>(singleLogDetails?.description);
  const [category, setCategory] = useState<string>(singleLogDetails?.categories ? singleLogDetails?.categories : []);

  useEffect(() => {
    setFormDetails({
      title: title,
      description: description,
      categories: category
    })
  }, [title, description, category])

  return (
    <div className={styles.primaryFormField}>
      <div className={styles.title}>
        <img className={styles.addAIcon} alt="Add Icon" src="/add-icon.svg" />
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
          name="description"
          placeholder="Enter description here"
          margin="normal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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
