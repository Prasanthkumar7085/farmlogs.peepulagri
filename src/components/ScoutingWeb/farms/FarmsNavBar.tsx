import React, { ChangeEvent, Dispatch, FunctionComponent, SetStateAction, useCallback, useEffect, useState } from "react";
import {
  TextField,
  Button,
  IconButton,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import styles from "./FarmsNavBar.module.css";
import { useRouter } from "next/router";
import getAllLocationsService from "../../../../lib/services/Locations/getAllLocationsService";
import { useSelector } from "react-redux";
import { log } from "console";

export interface pageProps {
  getFarmsData: ({ search_string, location }: { search_string: string, location: string }) => void;
}
const FarmsNavBarWeb = ({ getFarmsData }: pageProps) => {

  const router = useRouter();

  const [search, setSearch] = useState('');
  const [changed, setChanged] = useState(false);
  const [hiddenLoading, setHiddenLoading] = useState(false);
  const [settingLocationLoading, setSettingLocationLoading] = useState(false);
  const [location, setLocation] = useState<{ name: string, _id: string } | null>();
  const [locations, setLocations] = useState<Array<{ name: string, _id: string }>>([]);
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [addLocationOpen, setAddLocationOpen] = useState(false);

  const accessToken = useSelector((state: any) => state.auth.userDetails?.access_token);


  const onChangeSearchString = (e: ChangeEvent<HTMLInputElement>) => {
    setChanged(true);
    setSearch(e.target.value);
  }

  const onChangeLocation = (e: any, value: any, reason: any) => {
    if (reason == "clear") {
      setLocation(null);
    }
    if (value) {
      console.log(value);
      setChanged(true);
      setLocation(value);
      getFarmsData({ search_string: search, location: location?.name as string })

    }
  }



  useEffect(() => {
    setSearch(router.query?.search_string as string);
  }, [router.query?.search_string]);

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
        }
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
          defaultValue="Sear"
          placeholder="Search by farm name"
          fullWidth
          variant="outlined"
          type="search"
          size="small"
          value={search}
          onChange={onChangeSearchString}
          // InputProps={{
          //   endAdornment: (
          //     <IconButton onClick={() => { }} size="small">
          //       <ClearIcon />
          //     </IconButton>
          //   ),
          // }}
          sx={{
            width: "350px",
            maxWidth: "350px",
            borderRadius: "4px",
            '& .MuiInputBase-root': {
              fontSize: "clamp(.875rem, 1vw, 1.125rem)",
              backgroundColor: "#fff",
              border: "none",

            },
          }}
        />
        {!hiddenLoading && !settingLocationLoading ? <Autocomplete
          id="asynchronous-demo"
          open={open}
          fullWidth
          onOpen={() => {
            getLocations();
            setOpen(true);
          }}
          onClose={() => {
            setOpen(false);
          }}
          noOptionsText={'No such location!'}
          value={location}
          isOptionEqualToValue={(option, value) => option.name === value.name}
          getOptionLabel={(option: { name: string, _id: string }) => option.name}
          options={locations}
          loading={optionsLoading}
          // onInputChange={addInputValue}
          onChange={onChangeLocation}
          renderInput={(params) => (
            <TextField
              {...params}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {optionsLoading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
              name="location"
              size="small"
              placeholder="Enter location here"
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiInputBase-root': {
                  background: "#fff"
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
