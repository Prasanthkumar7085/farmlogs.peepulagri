import type { NextPage } from "next";
import { useState, useCallback } from "react";
import {
  Button,
  Icon,
  TextField,
  InputAdornment,
  IconButton,
  Select,
  InputLabel,
  MenuItem,
  FormHelperText,
  FormControl,
} from "@mui/material";
import UnitsDropdown from "./units-dropdown";
// import PortalPopup from "./portal-popup";
import Dropdown1 from "./dropdown1";
import styles from "./materials-required.module.css";

const MaterialsRequired: NextPage = () => {
  const [isUnitsDropdownOpen, setUnitsDropdownOpen] = useState(false);
  const [isUnitsDropdown1Open, setUnitsDropdown1Open] = useState(false);
  const [isDropdown5Open, setDropdown5Open] = useState(false);

  const openUnitsDropdown = useCallback(() => {
    setUnitsDropdownOpen(true);
  }, []);

  const closeUnitsDropdown = useCallback(() => {
    setUnitsDropdownOpen(false);
  }, []);

  const openUnitsDropdown1 = useCallback(() => {
    setUnitsDropdown1Open(true);
  }, []);

  const closeUnitsDropdown1 = useCallback(() => {
    setUnitsDropdown1Open(false);
  }, []);

  const openDropdown5 = useCallback(() => {
    setDropdown5Open(true);
  }, []);

  const closeDropdown5 = useCallback(() => {
    setDropdown5Open(false);
  }, []);

  return (
    <>
      <div className={styles.materialsrequired}>
        <div className={styles.group}>
          <div className={styles.heading}>
            <h2 className={styles.text}>Material Requirements</h2>
            <div className={styles.textAndSupportingText}>
              <p className={styles.supportingText}>
                You can add List of items here based on requirement
              </p>
              <Button color="primary" variant="contained">
                Add
              </Button>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.inputField}>
              <label className={styles.label}>Material Name</label>
              <TextField
                className={styles.input}
                color="primary"
                defaultValue="Name"
                variant="outlined"
              />
            </div>
            <div className={styles.personofcontact}>
              <label className={styles.label}>Material Available (Qty)</label>
              <div className={styles.input1}>
                <TextField
                  className={styles.inputbox}
                  color="primary"
                  defaultValue="01"
                  variant="outlined"
                />
                <FormControl
                  className={styles.dropdown}
                  variant="outlined"
                  onClick={openUnitsDropdown}
                >
                  <InputLabel color="primary" />
                  <Select color="primary" defaultValue="Litres">
                    <MenuItem value="Litres">Litres</MenuItem>
                    <MenuItem value="Kilograms">Kilograms</MenuItem>
                  </Select>
                  <FormHelperText />
                </FormControl>
              </div>
            </div>
            <div className={styles.personofcontact}>
              <label className={styles.label}>Material Procurement (Qty)</label>
              <div className={styles.input1}>
                <TextField
                  className={styles.inputbox}
                  color="primary"
                  defaultValue="01"
                  variant="outlined"
                />
                <FormControl
                  className={styles.dropdown}
                  variant="outlined"
                  onClick={openUnitsDropdown1}
                >
                  <InputLabel color="primary" />
                  <Select color="primary" defaultValue="Litres">
                    <MenuItem value="Litres">Litres</MenuItem>
                    <MenuItem value="Kilograms">Kilograms</MenuItem>
                  </Select>
                  <FormHelperText />
                </FormControl>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.priority}>
            <label className={styles.label}>Prioirty</label>
            <FormControl sx={{ width: 465 }} variant="outlined">
              <InputLabel color="primary" />
              <Select color="primary" defaultValue="Normal">
                <MenuItem value="Normal">Normal</MenuItem>
                <MenuItem value="" />
              </Select>
              <FormHelperText />
            </FormControl>
          </div>
          <div className={styles.personofcontact}>
            <label className={styles.label}>Person of Contact (POC)</label>
            <FormControl
              className={styles.selectbox}
              variant="outlined"
              onClick={openDropdown5}
            >
              <InputLabel color="primary" />
              <Select color="primary" defaultValue="Name">
                <MenuItem value="Gopi">Gopi</MenuItem>
                <MenuItem value="Latha">Latha</MenuItem>
                <MenuItem value="Madhuri">Madhuri</MenuItem>
                <MenuItem value="Sai">Sai</MenuItem>
              </Select>
              <FormHelperText />
            </FormControl>
          </div>
        </div>
      </div>
      {/* {isUnitsDropdownOpen && (
        <PortalPopup
          overlayColor="rgba(113, 113, 113, 0.3)"
          placement="Centered"
          onOutsideClick={closeUnitsDropdown}
        >
          <UnitsDropdown onClose={closeUnitsDropdown} />
        </PortalPopup>
      )}
      {isUnitsDropdown1Open && (
        <PortalPopup
          overlayColor="rgba(113, 113, 113, 0.3)"
          placement="Centered"
          onOutsideClick={closeUnitsDropdown1}
        >
          <UnitsDropdown onClose={closeUnitsDropdown1} />
        </PortalPopup>
      )}
      {isDropdown5Open && (
        <PortalPopup
          overlayColor="rgba(113, 113, 113, 0.3)"
          placement="Centered"
          onOutsideClick={closeDropdown5}
        >
          <Dropdown1 onClose={closeDropdown5} />
        </PortalPopup>
      )} */}
    </>
  );
};

export default MaterialsRequired;
