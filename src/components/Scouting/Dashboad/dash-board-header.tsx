import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";
import { TextField, InputAdornment, Icon, IconButton, Typography, Menu, MenuItem } from "@mui/material";
import styles from "./dash-board-header.module.css";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import Image from "next/image";

type captureSearchStringType = (search: string) => void

interface pageProps{
  captureSearchString: captureSearchStringType,
  searchString: string;
  locations: Array<string>;
  location: string;
  setLocation: Dispatch<SetStateAction<string>>;
  getDataOnLocationChange: (location:string) => void;
}

const DashBoardHeader = ({ captureSearchString, searchString,locations,location,setLocation,getDataOnLocationChange }: pageProps) => {
  
  const [search, setSearch] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const onChangeSearchString = (event:ChangeEvent<HTMLInputElement>) => {
    captureSearchString(event.target.value);
  }
      const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };

  useEffect(() => {
    setSearch(searchString);
  }, [searchString]);

  const selectCity = (item: string) => {
    setAnchorEl(null);
    setLocation(item);
    getDataOnLocationChange(item);
  };

  return (
    <div className={styles.dashboardheader} id="dashboard-header">
      <div className={styles.dashboardheading} id="dashboard-heading">
        <Typography className={styles.dashboard}>Dashboard</Typography>
        <div className={styles.selectlocation} id="select-location">
          <div className={styles.srisailam}>
            <Image alt="location" src="/location-icon.svg" width={15} height={15} />
            {location}
            <ExpandMoreIcon onClick={handleClick} />
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              sx={{maxHeight:'50vh'}}
            >
              {locations.map((item: string, index: number) => {
                return (
                  <MenuItem onClick={() => selectCity(item)} key={index}>{item}</MenuItem>
                )
              })}

            </Menu>
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
