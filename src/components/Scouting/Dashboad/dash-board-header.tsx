import { ChangeEvent, useEffect, useState } from "react";
import { TextField, InputAdornment, Icon, IconButton, Typography } from "@mui/material";
import styles from "./dash-board-header.module.css";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import Image from "next/image";

type captureSearchStringType = (search: string) => void

interface pageProps{
  captureSearchString: captureSearchStringType,
  searchString: string;
}

const DashBoardHeader = ({ captureSearchString, searchString }: pageProps) => {
  
  const [search, setSearch] = useState('');

  const onChangeSearchString = (event:ChangeEvent<HTMLInputElement>) => {
    captureSearchString(event.target.value);
  }

  useEffect(() => {
    setSearch(searchString);
  }, [searchString]);

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
          value={search}
          onChange={onChangeSearchString}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton>
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
