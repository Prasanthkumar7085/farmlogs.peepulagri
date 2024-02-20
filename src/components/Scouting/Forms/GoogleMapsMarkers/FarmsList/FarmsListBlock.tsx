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
import ReactDOM from "react-dom";
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import Image from "next/image";
import AddIcon from '@mui/icons-material/Add';
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
  handleAddPolygonButtonClick,
  setSelectedPolygon,
  map,
  googleMaps,
  setOpenFarmDetails,
  getFarmDataById,
  addPolyToExisting,
  farmOptionsLoading
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

  const getLocations = async (newLocationId = "") => {
    try {
      const response = await getAllLocationsService(accessToken);
      if (response?.success) {
        setLocations(response?.data);
        if (newLocationId) {
          setSettingLocationLoading(true);
          const newLocationObject = response?.data?.find(
            (item: any) => item?._id == newLocationId
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
      console.log("p0p")
      setLocation({ title: "All", _id: "1" });
      getFarmOptions({
        search_string: router.query.search_string as string,
        location: "" as string,
        userId: router.query.user_id as string,
        page: 1,
        limit: 20,
        sortBy: router.query.sort_by as string,
        sortType: router.query.sort_type as string,
      });
      return;
    }
    if (value) {
      setLocation(value);
      getFarmOptions({
        search_string: router.query.search_string as string,
        location: value?._id as string,
        userId: router.query.user_id as string,
        page: 1,
        limit: 20,
        sortBy: router.query.sort_by as string,
        sortType: router.query.sort_type as string,
      });

    }
  };

  useEffect(() => {
    if (accessToken) {
      if (router.query.location_id) {
        getLocations(router.query.location_id as string)
      }
      else {
        getLocations()
      }
    }
  }, [accessToken, router.isReady])


  useEffect(() => {
    // Create a custom control element
    const controlDiv = document.createElement('div');

    // Add Autocomplete component to the control element
    const autocompleteComponent = (
      <Autocomplete
        sx={{
          width: '250px',
          maxWidth: '250px',
          borderRadius: '4px',
        }}
        size="small"
        fullWidth
        noOptionsText="No such location"
        value={location}
        isOptionEqualToValue={(option, value) => option.title === value.title}
        getOptionLabel={(option) => option.title}
        options={locations?.length ? locations : []} // Assuming `locations` is an array of location objects
        onChange={onChangeLocation}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Search by locations"
            variant="outlined"
            size="small"
            sx={{
              '& .MuiInputBase-root': {
                fontSize: 'clamp(.875rem, 1vw, 1.125rem)',
                backgroundColor: '#fff',
                border: 'none',
              },
            }}
          />
        )}
      />
    );
    ReactDOM.render(autocompleteComponent, controlDiv);
    // Append the custom control element to the map
    map.controls[googleMaps.ControlPosition.TOP_CENTER].push(controlDiv);
  }, [map, googleMaps]); // Re-render the control when location changes



  return (
    <div className={styles.detailsslidebarfarmslist}>
      <header className={styles.header}>
        <div className={styles.headingcontainer}>
          <h2 className={styles.heading}>Farms</h2>
        </div>
        <div className={styles.actionsbar}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search farm"
            type="search"
            name="search"
            variant="outlined"
            value={searchString}
            onChange={(e) => {
              if (e.target.value) {
                setSearchString(e.target.value);
              }
              else {
                setSearchString("");

              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Image src="/markers/farm-search.svg" alt="" height={15} width={15} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiInputBase-root": {
                height: "32px", borderRadius: '2px',
                background: ' #DADADA', color: "#000", fontSize: "12px"
              },
              '& .MuiOutlinedInput-notchedOutline': {
                border: "0"
              }
            }}
          />
        </div>

      </header>
      <div id={styles.listview} className="scrollbar">
        <FarmListCard data={farmOptions}
          getFarmLocation={getFarmLocation}
          editPolygonDetails={editPolygonDetails}
          setEditFarmsDetails={setEditFarmsDetails}
          editFarmDetails={editFarmDetails}
          setPolygonCoords={setPolygonCoords}
          getFarmOptions={getFarmOptions}
          setSelectedPolygon={setSelectedPolygon}
          setOpenFarmDetails={setOpenFarmDetails}
          getFarmDataById={getFarmDataById}
          addPolyToExisting={addPolyToExisting}
          farmOptionsLoading={farmOptionsLoading}
        />
      </div>
      <div className={styles.buttoncontainer}>
        <Button
          startIcon={<AddIcon />}
          className={styles.addfarmbutton}
          disableElevation={true}
          variant="contained"
          onClick={handleAddPolygonButtonClick}
          sx={{
            '& .MuiButton-startIcon': {
              marginRight: "4px !important"
            }
          }}
        >
          Add Farm
        </Button>
      </div>
      <LoadingComponent loading={loading} />
    </div>
  );
};
export default FarmsListBlock;
