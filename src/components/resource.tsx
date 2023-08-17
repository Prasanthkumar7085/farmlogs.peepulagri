import type { NextPage } from "next";
import {
  Button,
  Icon,
  FormControl,
  InputLabel,
  MenuItem,
  FormHelperText,
  Select,
  TextField,
} from "@mui/material";
import styles from "./resource.module.css";
const Resource: NextPage = () => {
  return (
    <div className={styles.resource}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.textwrapper}>
            <h4 className={styles.title}>Resources</h4>
            <p className={styles.description}>You can add multiple resources</p>
          </div>
          <Button
            variant="contained"
            color="success"
            startIcon={<Icon>arrow_forward_sharp</Icon>}
          >
            Add
          </Button>
        </div>
        <div className={styles.resourcetypeParent}>
          <div className={styles.resourcetype}>
            <p className={styles.label}>Resources Type</p>
            <FormControl className={styles.dropdown} variant="outlined">
              <InputLabel color="primary" />
              <Select color="primary" defaultValue="Choose Type" size="small">
                <MenuItem value="01">01</MenuItem>
                <MenuItem value="02">02</MenuItem>
                <MenuItem value="03">03</MenuItem>
                <MenuItem value="04">04</MenuItem>
                <MenuItem value="05">05</MenuItem>
              </Select>
              <FormHelperText />
            </FormControl>
          </div>
          <div className={styles.quantity}>
            <p className={styles.label}>Quantity</p>
            <FormControl className={styles.dropdown} variant="outlined">
              <InputLabel color="primary" />
              <Select color="primary" defaultValue="Choose Type" size="small">
                <MenuItem value="01">01</MenuItem>
                <MenuItem value="02">02</MenuItem>
                <MenuItem value="03">03</MenuItem>
                <MenuItem value="04">04</MenuItem>
                <MenuItem value="05">05</MenuItem>
              </Select>
              <FormHelperText />
            </FormControl>
          </div>
          <div className={styles.inputField}>
            <p className={styles.label}>Total Hours</p>
            <TextField
              className={styles.textInput}
              sx={{ width: 222 }}
              color="primary"
              variant="outlined"
              defaultValue="0"
              type="number"
              placeholder="Enter hrs"
              size="small"
              margin="none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resource;
