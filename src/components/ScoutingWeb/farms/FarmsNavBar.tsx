import React, { ChangeEvent, useEffect, useState } from "react";
import {
  TextField,
  Autocomplete,
  InputAdornment,
} from "@mui/material";
import styles from "./FarmsNavBar.module.css";
import { useRouter } from "next/router";
import getAllLocationsService from "../../../../lib/services/Locations/getAllLocationsService";
import { useSelector } from "react-redux";
import SearchIcon from '@mui/icons-material/Search';

export interface pageProps {
  getFarmsData: ({ search_string, location }: { search_string: string, location: string }) => void;
}
const FarmsNavBarWeb = ({ getFarmsData }: pageProps) => {


  const router = useRouter();
  const [search, setSearch] = useState('');
  const [changed, setChanged] = useState(false);
  const [settingLocationLoading, setSettingLocationLoading] = useState(false);
  const [location, setLocation] = useState<{ name: string, _id: string } | null>();
  const [locations, setLocations] = useState<Array<{ name: string, _id: string }>>([]);
  const [optionsLoading, setOptionsLoading] = useState(false);

  const accessToken = useSelector((state: any) => state.auth.userDetails?.access_token);


  const onChangeSearchString = (e: ChangeEvent<HTMLInputElement>) => {
    setChanged(true);
    setSearch(e.target.value);
  }

  const onChangeLocation = (e: any, value: any, reason: any) => {
    if (reason == "clear") {
      setLocation({ name: 'All', _id: '1' });
    }
    if (value) {
      
      setChanged(true);
      setLocation(value);
      getFarmsData({ search_string: search, location: location?.name as string })

    }
  }

  useEffect(() => {
    setSearch(router.query?.search_string as string);
  }, [router.query?.search_string]);

  useEffect(() => {
    if (router.isReady&&accessToken) {
      if (router.query.location) {
        getLocations(router.query.location as string);
      } else {
        getLocations();
      }
      
    }
  }, [router.isReady,accessToken]);

  useEffect(() => {
    if (changed) {
      const delay = 500;
      const debounce = setTimeout(() => {
        getFarmsData({ search_string: search, location: location?.name as string });
      }, delay);
      return () => clearTimeout(debounce);
    }
  }, [search, location]);

  const getLocations = async (newLocation = '') => {
    setOptionsLoading(true);
    try {
      const response = await getAllLocationsService(accessToken);
      if (response?.success) {
        setLocations(response?.data);
        if (newLocation) {
          setSettingLocationLoading(true);
          const newLocationObject = response?.data?.find((item: any) => item?.name == newLocation);
          
          setLocation(newLocationObject);
          setTimeout(() => {
            setSettingLocationLoading(false);
          }, 1);
        } else {
          setSettingLocationLoading(true);

          // setLocation({ name: 'All', _id: '1' });
          setTimeout(() => {
            setSettingLocationLoading(false);
          }, 1);
          
        }
      }
      if (response?.data?.length) {
        setLocations([{ name: 'All', _id: '1' }, ...response?.data]);
      } else {
        setLocations([{ name: 'All', _id: '1' }]);
      }

    } catch (e) {
      console.error(e);
    } finally {
      setOptionsLoading(false);
    }
  }


  return (
    <div className={styles.farmsnavbar}>
      <div className={styles.title}>
        <img className={styles.farmIcon} alt="" src="/wer-farm-page-icon.svg" />
        <h1 className={styles.farms}>Farms</h1>
      </div>
      <div className={styles.actionsbar}>
        <TextField
           InputProps={{
           
            startAdornment: (
              <InputAdornment position="start">
                  <SearchIcon />
              </InputAdornment>
            ),
          }}
          placeholder="Search by farm name"
          fullWidth
          variant="outlined"
          type="search"
          size="small"
          value={search}
          onChange={onChangeSearchString}
          sx={{
            width: "250px",
            maxWidth: "250px",
            borderRadius: "4px",
            '& .MuiInputBase-root': {
              fontSize: "clamp(.875rem, 1vw, 1.125rem)",
              backgroundColor: "#fff",
              border: "none",

            },
          }}
        />
        {!settingLocationLoading ?
          <Autocomplete
            sx={{
              width: "250px",
              maxWidth: "250px",
              borderRadius: "4px",
            }}
            id="size-small-outlined-multi"
            size="small"
            fullWidth
            noOptionsText={'No such location'}
            value={location}
            isOptionEqualToValue={(option, value) => option.name === value.name}
            getOptionLabel={(option: { name: string, _id: string }) => option.name}
            options={locations}
            loading={optionsLoading}
            onChange={onChangeLocation}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Search by locations"
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiInputBase-root': {
                    fontSize: "clamp(.875rem, 1vw, 1.125rem)",
                    backgroundColor: "#fff",
                    border: "none",
                  }
                }}

              />
            )}
          /> : ""}
        {/* <Button
          className={styles.button}
          variant="contained"
          onClick={onButtonClick}
        >
          <AddIcon sx={{ fontSize: "1rem" }} />Add
        </Button> */}
      </div>
    </div>
  );
};

export default FarmsNavBarWeb;
