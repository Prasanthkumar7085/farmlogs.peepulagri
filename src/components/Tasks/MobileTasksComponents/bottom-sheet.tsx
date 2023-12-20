import type { NextPage } from "next";
import {
  TextField,
  InputAdornment,
  Icon,
  IconButton,
  Checkbox,
  FormControlLabel,
  Button,
} from "@mui/material";
import styles from "./bottom-sheet.module.css";

const BottomSheet: NextPage = () => {
  return (
    <div className={styles.bottomsheet}>
      <div className={styles.filteroptions}>
        <div className={styles.tabs}>
          <p className={styles.filterBy}>Filter By :</p>
          <div className={styles.group}>
            <div className={styles.farm}>
              <p className={styles.farms}>Farms</p>
            </div>
            <div className={styles.farm1}>
              <p className={styles.farms}>Crops</p>
            </div>
            <div className={styles.farm1}>
              <p className={styles.farms}>Assignee</p>
            </div>
          </div>
        </div>
        <TextField
          className={styles.search}
          color="primary"
          defaultValue="Search..."
          helperText="zoom_in_sharp"
          variant="outlined"
        />
      </div>
      <div className={styles.container}>
        <ul className={styles.optionslist}>
          <div className={styles.option}>
            <FormControlLabel
              className={styles.checkbox}
              label=""
              control={<Checkbox color="primary" defaultChecked />}
            />
            <label className={styles.spicevineGardens}>SpiceVine Gardens</label>
          </div>
          <div className={styles.option}>
            <FormControlLabel
              className={styles.checkbox}
              label=""
              control={<Checkbox color="primary" defaultChecked />}
            />
            <label className={styles.spicevineGardens}>HeatHarvest Farms</label>
          </div>
          <div className={styles.option}>
            <FormControlLabel
              className={styles.checkbox}
              label=""
              control={<Checkbox color="primary" defaultChecked />}
            />
            <label className={styles.spicevineGardens}>Red Blaze Acres</label>
          </div>
          <div className={styles.option}>
            <FormControlLabel
              className={styles.checkbox}
              label=""
              control={<Checkbox color="primary" defaultChecked />}
            />
            <label className={styles.spicevineGardens}>
              PepperPeak Plantation
            </label>
          </div>
          <div className={styles.option}>
            <FormControlLabel
              className={styles.checkbox}
              label=""
              control={<Checkbox color="primary" defaultChecked />}
            />
            <label className={styles.spicevineGardens}>
              Fiery Fields Farmstead
            </label>
          </div>
          <div className={styles.option}>
            <FormControlLabel
              className={styles.checkbox}
              label=""
              control={<Checkbox color="primary" defaultChecked />}
            />
            <label className={styles.spicevineGardens}>SpiceVine Gardens</label>
          </div>
          <div className={styles.option}>
            <FormControlLabel
              className={styles.checkbox}
              label=""
              control={<Checkbox color="primary" defaultChecked />}
            />
            <label className={styles.spicevineGardens}>
              Scoville Grove Gardens
            </label>
          </div>
        </ul>
      </div>
      <div className={styles.buttonsgroup}>
        <Button className={styles.resetall} color="success" variant="outlined">
          Reset All
        </Button>
        <Button className={styles.resetall} color="error" variant="contained">
          Apply
        </Button>
      </div>
    </div>
  );
};

export default BottomSheet;
