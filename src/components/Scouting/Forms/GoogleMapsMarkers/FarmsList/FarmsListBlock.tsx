import {
  Autocomplete,
  Button,
  Drawer,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import styles from "./farmsBlock.module.css";
import { Clear } from "@mui/icons-material";
import FarmListCard from "./FarmListCard";
import { useEffect, useState } from "react";
import ListAllFarmForDropDownService from "../../../../../../lib/services/FarmsService/ListAllFarmForDropDownService";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import LoadingComponent from "@/components/Core/LoadingComponent";
import getAllLocationsService from "../../../../../../lib/services/Locations/getAllLocationsService";

interface ApiProps {
  page: number;
  searchString: string;
}

const FarmsListBlock = ({
  getFarmLocation,
  farmOptions,
  searchString,
  setSearchString,
  editPolygonDetails,
  setEditFarmsDetails,
  editFarmDetails,
  setPolygonCoords,
  getFarmOptions,
  handleAddPolygonButtonClick
}: any) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [settingLocationLoading, setSettingLocationLoading] = useState(false);
  const [optionsLoading, setOptionsLoading] = useState(false);

  const [location, setLocation] = useState<{
    title: string;
    _id: string;
  } | null>();
  const [locations, setLocations] = useState<
    Array<{ title: string; _id: string }>
  >([]);
  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );

  const getLocations = async (newLocation = "") => {
    try {
      const response = await getAllLocationsService(accessToken);
      if (response?.success) {
        setLocations(response?.data);
        if (newLocation) {
          setSettingLocationLoading(true);
          const newLocationObject = response?.data?.find(
            (item: any) => item?.title == newLocation
          );

          setLocation(newLocationObject);
          setTimeout(() => {
            setSettingLocationLoading(false);
          }, 1);
        } else {
          setSettingLocationLoading(true);

          setTimeout(() => {
            setSettingLocationLoading(false);
          }, 1);
        }
      }
      if (response?.data?.length) {
        setLocations([{ title: "All", _id: "1" }, ...response?.data]);
      } else {
        setLocations([{ title: "All", _id: "1" }]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setOptionsLoading(false);
    }
  };



  const onChangeLocation = (e: any, value: any, reason: any) => {
    if (reason == "clear") {
      setLocation({ title: "All", _id: "1" });
      getFarmOptions({ search_string: searchString })
      return;
    }
    if (value) {
      setLocation(value);
      getFarmOptions({
        search_string: searchString,
        location: value?._id as string,
      });
    }
    e
  };

  useEffect(() => {
    if (accessToken) {
      getLocations()
    }
  }, [accessToken])

  return (
    <div className={styles.detailsslidebarfarmslist}>
      <header className={styles.header}>
        <div className={styles.headingcontainer}>
          <h2 className={styles.heading}>Farms</h2>
          <p className={styles.totalacres}>24.94 ha</p>
        </div>
        <div className={styles.actionsbar}>
          <TextField
            className={styles.searchbar}
            color="primary"
            size="medium"
            placeholder="Search farm"
            type="search"
            variant="outlined"
            value={searchString}
            onChange={(e) => {
              setSearchString(e.target.value);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start"></InputAdornment>
              ),
            }}
            sx={{ "& .MuiInputBase-root": { height: "32px" } }}
          />


          <Button
            disableElevation={true}
            color="primary"
            variant="contained"
            sx={{ borderRadius: "0px 0px 0px 0px" }}
          >
            Filter
          </Button>
        </div>
        {!settingLocationLoading ? (
          <Autocomplete
            sx={{
              width: "250px",
              maxWidth: "250px",
              borderRadius: "4px",
            }}
            id="size-small-outlined-multi"
            size="small"
            fullWidth
            noOptionsText={"No such location"}
            value={location}
            isOptionEqualToValue={(option, value) =>
              option.title === value.title
            }
            getOptionLabel={(option: { title: string; _id: string }) =>
              option.title
            }
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
                  "& .MuiInputBase-root": {
                    fontSize: "clamp(.875rem, 1vw, 1.125rem)",
                    backgroundColor: "#fff",
                    border: "none",
                  },
                }}
              />
            )}
          />
        ) : (
          ""
        )}
      </header>
      <div className={styles.listview}>
        <FarmListCard data={farmOptions}
          getFarmLocation={getFarmLocation}
          editPolygonDetails={editPolygonDetails}
          setEditFarmsDetails={setEditFarmsDetails}
          editFarmDetails={editFarmDetails}
          setPolygonCoords={setPolygonCoords}
          getFarmOptions={getFarmOptions} />
      </div>
      <div className={styles.buttoncontainer}>
        <Button
          className={styles.addfarmbutton}
          disableElevation={true}
          color="success"
          variant="contained"
          sx={{ borderRadius: "0px 0px 0px 0px" }}
          onClick={handleAddPolygonButtonClick}
        >
          Add Farm
        </Button>
      </div>
      <LoadingComponent loading={loading} />
    </div>
  );
};
export default FarmsListBlock;
