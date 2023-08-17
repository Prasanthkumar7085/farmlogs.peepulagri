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
const Header: NextPage = () => {
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
            />
          </div>
          <FormControl sx={{ width: 200 }} variant="outlined">
            <InputLabel color="primary">Select Category</InputLabel>
            <Select
              color="primary"
              name="category"
              size="small"
              label="Select Category"
            >
              <MenuItem value="Soil Preparation">Soil Preparation</MenuItem>
              <MenuItem value="Planting">Planting</MenuItem>
              <MenuItem value="Irrigation">Irrigation</MenuItem>
              <MenuItem value="Fertilization">Fertilization</MenuItem>
              <MenuItem value="Pest Management">Pest Management</MenuItem>
              <MenuItem value="Weeding">Weeding</MenuItem>
              <MenuItem value="Crop Rotation">Crop Rotation</MenuItem>
              <MenuItem value="Harvesting">Harvesting</MenuItem>
              <MenuItem value="Equipment Management">
                Equipment Management
              </MenuItem>
              <MenuItem value="Other">Other</MenuItem>
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
