import {
  Autocomplete,
  Button,
  Drawer,
  IconButton,
  InputAdornment,
  Pagination,
  TextField,
} from "@mui/material";
import styles from "./farmsBlock.module.css";
import { Clear } from "@mui/icons-material";
import FarmListCard from "./FarmListCard";
import { useEffect, useState } from "react";
import ListAllFarmForDropDownService from "../../../../../../lib/services/FarmsService/ListAllFarmForDropDownService";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import LoadingComponent from "@/components/Core/LoadingComponent";
import getAllLocationsService from "../../../../../../lib/services/Locations/getAllLocationsService";
import ReactDOM from "react-dom";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import Image from "next/image";
import AddIcon from "@mui/icons-material/Add";
import { createRoot } from "react-dom/client";
import { storeEditPolygonCoords } from "@/Redux/Modules/Farms";

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
  getFarmOptions,
  setSelectedPolygon,
  map,
  googleMaps,
  setOpenFarmDetails,
  getFarmDataById,
  addPolyToExisting,
  farmOptionsLoading,
  paginationDetails,
  capturePageNum,
  setAddPolygonOpen,
  drawingOpen,
  setDrawingOpen,
  stopDrawingMode,
  closeDrawing,
  clearAllPoints,
}: any) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [settingLocationLoading, setSettingLocationLoading] = useState(false);
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [pageNum, setPageNum] = useState<number | string>();
  const [autocompleteCreated, setAutocompleteCreated] = useState(false);

  const polygonCoords = useSelector((state: any) => state.farms.polygonCoords);

  const [location, setLocation] = useState<any>();
  const [locations, setLocations] = useState<any>([]);
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
      setSelectedPolygon(null);
      setLocation({ title: "All", _id: "1" });
      getFarmOptions({
        search_string: router.query.search_string as string,
        location: "" as string,
        userId: router.query.user_id as string,
        page: 1,
        limit: 20,
        sortBy: router.query.sort_by as string,
        sortType: router.query.sort_type as string,
        locationName: router.query.location_name

      });
      return;
    }
    if (value) {
      setSelectedPolygon(null);
      setLocation(value);
      getFarmOptions({
        search_string: router.query.search_string as string,
        location: value?._id as string,
        userId: router.query.user_id as string,
        page: 1,
        limit: 20,
        sortBy: router.query.sort_by as string,
        sortType: router.query.sort_type as string,
        locationName: router.query.location_name

      });
    }
  };

  useEffect(() => {
    if (router.query.location_id && map && googleMaps && location?.coordinates?.length) {
      const indiaCenter = { lat: location?.coordinates?.[0], lng: location?.coordinates?.[1] };
      map.setCenter(indiaCenter);
      map.setZoom(17);
    }
  }, [map, googleMaps, router.query.location_id])

  useEffect(() => {
    if (router.isReady && accessToken) {
      if (router.query.location_id) {
        getLocations(router.query.location_id as string);
      } else {
        getLocations();
      }
    }
  }, [accessToken, router.isReady]);



  return (
    <div className={styles.detailsslidebarfarmslist}>
      <header className={styles.header}>
        <div className={styles.headingcontainer}>
          <h2 className={styles.heading}>Farms</h2>
          <h2 className={styles.acresCount}>
            Total Farms: {paginationDetails?.total}
          </h2>
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
              } else {

                setSearchString("");
                getFarmOptions({
                  search_string: "",
                  location: router.query.location_id as string,
                  userId: router.query.user_id as string,
                  page: router.query.page,
                  limit: 20,
                  sortBy: router.query.sort_by as string,
                  sortType: router.query.sort_type as string,
                  locationName: router.query.location_name

                });
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Image
                    src="/markers/farm-search.svg"
                    alt=""
                    height={15}
                    width={15}
                  />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiInputBase-root": {
                height: "32px",
                borderRadius: "2px",
                background: " #DADADA",
                color: "#000",
                fontSize: "12px",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                border: "0",
              },
            }}
          />
        </div>
      </header>
      <div id={styles.listview} className="scrollbar">
        <FarmListCard
          data={farmOptions}
          getFarmLocation={getFarmLocation}
          editPolygonDetails={editPolygonDetails}
          setEditFarmsDetails={setEditFarmsDetails}
          editFarmDetails={editFarmDetails}
          getFarmOptions={getFarmOptions}
          setSelectedPolygon={setSelectedPolygon}
          setOpenFarmDetails={setOpenFarmDetails}
          getFarmDataById={getFarmDataById}
          addPolyToExisting={addPolyToExisting}
          farmOptionsLoading={farmOptionsLoading}
        />
      </div>
      <div className={styles.buttoncontainer}>
        <Pagination
          shape="circular"
          disabled={editFarmDetails?._id ? true : false}
          sx={{
            display: paginationDetails?.total_pages ? "" : 'none',
            marginBottom: "0.5rem",
            width: "100%",
            "& .MuiPagination-ul": {
              width: "100%",
              justifyContent: "center",
            },
            "& .MuiButtonBase-root": {
              height: "25px !important",
              width: "25px !important",
              minWidth: "inherit",
            },
          }}
          page={+paginationDetails?.page}
          count={paginationDetails?.total_pages}
          onChange={(event: any, value: any) => {
            capturePageNum(value);
            setPageNum(+value);
          }}
        />
        {drawingOpen ? (
          <Button
            className={styles.closefarmbutton}
            variant="contained"
            onClick={() => {
              setDrawingOpen(false);
              clearAllPoints();
              closeDrawing();
              setEditFarmsDetails(null)
              getFarmOptions({
                search_string: router.query.search_string as string,
                location: router.query.location_id as string,
                userId: router.query.user_id as string,
                page: 1,
                limit: 20,
                sortBy: router.query.sort_by as string,
                sortType: router.query.sort_type as string,
                locationName: router.query.location_name

              });

            }}
            sx={{
              "& .MuiButton-startIcon": {
                marginRight: "4px !important",
              },
            }}
          >
            Stop Drawing
          </Button>
        ) : (
          <Button
            startIcon={<AddIcon />}
            className={
              editFarmDetails?._id
                ? styles.addfarmbutton_disable
                : styles.addfarmbutton
            }
            disableElevation={true}
            disabled={editFarmDetails?._id ? true : false}
            variant="contained"
            onClick={() => {
              setAddPolygonOpen(true);
            }}
            sx={{
              "& .MuiButton-startIcon": {
                marginRight: "4px !important",
              },
            }}
          >
            Add Farm
          </Button>
        )}
      </div>
      <LoadingComponent loading={loading} />
    </div>
  );
};
export default FarmsListBlock;
