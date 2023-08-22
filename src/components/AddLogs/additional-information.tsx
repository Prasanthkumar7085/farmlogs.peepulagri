import type { NextPage } from "next";
import {
  Button,
  Icon,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  FormHelperText,
  Select,
} from "@mui/material";
import styles from "./additional-information.module.css";
const AdditionalInformation = ({ register }: any) => {
  return (
    <div className={styles.additionalInformation}>
      <div className={styles.header}>
        <div className={styles.textwrapper}>
          <h4 className={styles.title}>Additional Information</h4>
          <p
            className={styles.description}
          >{`You can add additional details based on the category and work type `}</p>
        </div>
        <Button
          variant="contained"
          color="success"
          startIcon={<Icon>arrow_forward_sharp</Icon>}
        >
          Add
        </Button>
      </div>
      <div className={styles.container}>
        <div className={styles.pesticide}>
          <div className={styles.label}>Pesticide</div>
          <TextField
            className={styles.textInput}
            fullWidth
            color="primary"
            variant="outlined"
            type="text"
            placeholder="Enter the name"
            size="small"
            margin="none"
          />
        </div>
        <div className={styles.quantity}>
          <div className={styles.inputWithLabel}>
            <p className={styles.label1}>Quantity</p>
          </div>
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
        <div className={styles.units}>
          <p className={styles.label1}>Units</p>
          <FormControl className={styles.dropdown} variant="outlined">
            <InputLabel color="primary" />
            <Select
              color="primary"
              name="Units"
              defaultValue="Choose Units"
              size="small"
            >
              <MenuItem value="kilogram">kilogram</MenuItem>
              <MenuItem value="gram">gram</MenuItem>
              <MenuItem value="milligram">milligram</MenuItem>
              <MenuItem value="Pound">Pound</MenuItem>
              <MenuItem value="Ton">Ton</MenuItem>
              <MenuItem value="Milliliter">Milliliter</MenuItem>
              <MenuItem value="Liter">Liter</MenuItem>
              <MenuItem value="Cup">Cup</MenuItem>
              <MenuItem value="Pint">Pint</MenuItem>
              <MenuItem value="Quart">Quart</MenuItem>
              <MenuItem value="Liquid Gallon">Liquid Gallon</MenuItem>
            </Select>
            <FormHelperText />
          </FormControl>
        </div>
      </div>
    </div>
  );
};

export default AdditionalInformation;
