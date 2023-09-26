import type { NextPage } from "next";
import { useState } from "react";
import { TextField, InputAdornment, Icon, IconButton, Typography } from "@mui/material";
import styles from "./dash-board-header.module.css";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import Image from "next/image";
const DashBoardHeader: NextPage = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const handleShowPasswordClick = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className={styles.dashboardheader} id="dashboard-header">
      <div className={styles.dashboardheading} id="dashboard-heading">
        <Typography className={styles.dashboard}>Dashboard</Typography>
        <div className={styles.selectlocation} id="select-location">
          <div className={styles.srisailam}>
            <Image alt="location" src="/location-icon.svg" width={15} height={15} />
            Srisailam
            <ExpandMoreIcon />
          </div>
        </div>
      </div>
      <div className={styles.searchbyfarmname} id="search-by-farm-name">
        <TextField
          className={styles.searchfarm}
          color="primary"
          name="search"
          id="search"
          size="small"
          placeholder="Search by Name"
          fullWidth={true}
          variant="outlined"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleShowPasswordClick}
                  aria-label="toggle password visibility"
                >
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </div>
    </div>
  );
};

export default DashBoardHeader;
