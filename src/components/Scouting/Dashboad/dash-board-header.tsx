import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import SearchIcon from "@mui/icons-material/Search";
import {
  Autocomplete,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import styles from "./dash-board-header.module.css";
type captureSearchStringType = (search: string) => void;

interface pageProps {
  captureSearchString: captureSearchStringType;
  searchString: string;
  locations: Array<{ title: string; _id: string }>;
  location: string;
  setLocation: Dispatch<SetStateAction<string>>;
  getDataOnLocationChange: (location: string) => void;
}

const DashBoardHeader = ({
  captureSearchString,
  searchString,
  locations,
  location,
  setLocation,
  getDataOnLocationChange,
}: pageProps) => {
  const [search, setSearch] = useState("");

  const [locationValue, setLocationValue] = useState<{
    title: string;
    _id: string;
  } | null>();
  const [dataSetting, setDataSetting] = useState(false);

  useEffect(() => {
    if (locations?.length) {
      let obj: any = locations?.find(
        (item: { title: string; _id: string }) => item.title == location
      );

      if (obj) {
        setDataSetting(true);
        setLocationValue(obj);
        setTimeout(() => {
          setDataSetting(false);
        }, 1);
      } else {
        setLocation("");
      }
    }
  }, [locations, location]);

  const onChangeSearchString = (event: ChangeEvent<HTMLInputElement>) => {
    captureSearchString(event.target.value);
  };

  useEffect(() => {
    setSearch(searchString);
  }, [searchString]);

  const addInputValue = (event: any, value: any) => {
    if (value) {
      setLocation(value?.title);
      getDataOnLocationChange(value?._id);
    } else {
      setLocationValue(null);
      setLocation("");
      getDataOnLocationChange("");
    }
  };

  return (
    <div className={styles.dashboardheader} id="dashboard-header">
      <div className={styles.dashboardheading} id="dashboard-heading">
        <Typography className={styles.dashboard}>Dashboard</Typography>
        <div className={styles.selectlocation} id="select-location">
          <div className={styles.srisailam}>
            {!dataSetting ? (
              <Autocomplete
                id="asynchronous-demo"
                fullWidth
                noOptionsText={"No such location!"}
                value={locationValue}
                getOptionLabel={(option: { title: string; _id: string }) =>
                  option.title
                }
                isOptionEqualToValue={(option, value) =>
                  option.title === value.title
                }
                options={locations}
                onChange={addInputValue}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    className={styles.inputfarmname}
                    name="location"
                    size="small"
                    placeholder="Enter location here"
                    fullWidth
                    variant="outlined"
                    sx={{
                      "& .MuiInputBase-root": {
                        background: "#fff",
                      },
                    }}
                  />
                )}
              />
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
      <div className={styles.searchbyfarmname} id="search-by-farm-name">
        <TextField
          className={styles.searchfarm}
          type="search"
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
            // endAdornment: (
            //   <InputAdornment position="end">
            //     <IconButton
            //       onClick={() => {
            //         setSearch("");
            //         captureSearchString("");
            //       }}
            //     >
            //       {search ? <ClearOutlinedIcon /> : ""}
            //     </IconButton>
            //   </InputAdornment>
            // ),
            startAdornment: (
              <InputAdornment position="start">
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
