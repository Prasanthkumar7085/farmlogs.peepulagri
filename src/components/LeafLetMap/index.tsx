import L from "leaflet";
import { useEffect, useRef, useState } from "react";
// import ReactDOM from "react-dom";
import DrawTools from "./MapEditorSidebar/DrawTools";
// import { GlobalStateProvider, useGlobalState } from "./services/Store";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet/dist/leaflet.css";
import {
  LayersControl,
  // withLeaflet,
  MapContainer,
  Marker,
  Polygon,
  Popup,
  TileLayer,
} from "react-leaflet";

import { Autocomplete, TextField } from "@mui/material";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { Toaster, toast } from "sonner";
import { prepareURLEncodedParams } from "../../../lib/requestUtils/urlEncoder";
import getAllFarmsService from "../../../lib/services/FarmsService/getAllFarmsServiceMobile";
import getFarmByIdService from "../../../lib/services/FarmsService/getFarmByIdService";
import getAllLocationsService from "../../../lib/services/Locations/getAllLocationsService";
import LoadingComponent from "../Core/LoadingComponent";
import FarmsListBlock from "../Scouting/Forms/GoogleMapsMarkers/FarmsList/FarmsListBlock";

const MAP_PROVIDERS = {
  google: {
    satellite: "Google Satellite",
    roadmap: "Google Roadmap",
  },
  osm: "OpenStreetMap (Mapnik)",
  yandex: {
    satellite: "Yandex Satellite",
    roadmap: "Yandex Roadmap",
  },
  mapbox: "Mapbox",
};

const tiles = [
  {
    attribution: "&copy; Google",
    name: MAP_PROVIDERS.google.satellite,
    checked: true,
    url: "//mt.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
    crs: L.CRS.EPSG3857,
  },
  {
    attribution: "&copy; Google",
    name: MAP_PROVIDERS.google.roadmap,
    checked: false,
    url: "//mt.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
    crs: L.CRS.EPSG3857,
  },
  {
    attribution:
      '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    name: MAP_PROVIDERS.osm,
    checked: false,
    url: "//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    crs: L.CRS.EPSG3857,
  },
  {
    attribution: "&copy; Yandex",
    name: MAP_PROVIDERS.yandex.satellite,
    checked: false,
    url: "//sat04.maps.yandex.net/tiles?l=sat&v=3.456.0&x={x}&y={y}&z={z}",
    crs: L.CRS.EPSG3395,
  },
  {
    attribution: "&copy; Yandex",
    name: MAP_PROVIDERS.yandex.roadmap,
    checked: false,
    url: " https://core-renderer-tiles.maps.yandex.net/tiles?l=map&v=21.06.18-0-b210520094930&x={x}&y={y}&z={z}&scale=1&lang=ru-RU",
    subdomains: ["01", "02", "03", "04"],
    crs: L.CRS.EPSG3395,
  },
];

const HomePage = () => {
  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );
  const [selectedPolygon, setSelectedPolygon] = useState(null);
  const [editFarmDetails, setEditFarmsDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [farmOptions, setFarmOptions] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [renderField, setRenderField] = useState(false);
  const [viewPolygonsCoord, setViewPolygonsCoord] = useState<any>([]);
  const [FarmlocationDetails, setFarmLoactionDetails] = useState<any>();
  const [polygon, setPolygon] = useState<any>(null);
  const [locations, setLocations] = useState<any>([]);
  const [openFarmDetails, setOpenFarmDetails] = useState<boolean>(false);
  const [data, setData] = useState<any>();
  const [farmData, setFarmData] = useState<any>([]);
  const [paginationDetails, setPaginationDetails] = useState<any>();
  const [lat, setLat] = useState<any>(15.2161);
  const [lng, setLng] = useState<any>(79.9049);
  const [zoom, setZoom] = useState<any>(5);
  const [isrendered, setIsRendered] = useState(false);
  const [editPolyCoordinates, setEditPolyCoordinates] = useState<any>();
  const [polyCoordinates, setPolyCoordinates] = useState<any>([]);
  const [farmId, setFarmId] = useState<any>();
  const [location, setLocation] = useState<any>();
  const markersRef: any = useRef([]);

  const router = useRouter();
  typeof window !== "undefined";

  const getLocations = async (newLocationId = "") => {
    try {
      const response = await getAllLocationsService(accessToken);
      if (response?.success) {
        setLocations(response?.data);
        if (newLocationId || router.query.location_id) {
          const newLocationObject = response?.data?.find(
            (item: any) => item?._id == newLocationId
          );
          setLocation(newLocationObject);
          if (newLocationObject?.coordinates?.length > 0) {
            setLanAndLattoMap(
              newLocationObject?.coordinates[0],
              newLocationObject?.coordinates[1],
              18
            );
          }
        }
      }
      if (response?.data?.length) {
        setLocations([{ title: "All", _id: "1" }, ...response?.data]);
      } else {
        setLocations([{ title: "All", _id: "1" }]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getFarmOptions = async ({
    search_string = "",
    location,
    userId,
    page = 1,
    limit = 20,
    sortBy,
    sortType,
    locationName = "",
  }: any) => {
    setLoading(true);
    try {
      let queryParam: any = {};
      if (page) {
        queryParam["page"] = page;
      }
      if (limit) {
        queryParam["limit"] = limit;
      }
      if (sortBy) {
        queryParam["sort_by"] = sortBy;
      }
      if (sortType) {
        queryParam["sort_type"] = sortType;
      }
      if (search_string) {
        queryParam["search_string"] = search_string;
      }

      if (location != 1 && location) {
        queryParam["location_id"] = location;
      }
      if (locationName) {
        queryParam["location_name"] = locationName;
      }

      if (userId) {
        queryParam["user_id"] = userId;
      }

      const { page: pagenum, limit: limitnum, ...restParams } = queryParam;

      let url = `farms/${page}/${limit}`;
      router.push({ pathname: "/leaflet-map", query: queryParam });
      url = prepareURLEncodedParams(url, restParams);

      const response = await getAllFarmsService(url, accessToken);

      if (response?.success) {
        setFarmData(response?.data);
        const { data, ...rest } = response;
        setPaginationDetails(rest);
        const newData = response.data.map((item: any) => {
          const coordinates = item?.geometry?.coordinates;

          if (coordinates && coordinates.length) {
            const firstCoordinate = coordinates[0];
            const lastCoordinate = coordinates[coordinates.length - 1];
            if (
              firstCoordinate[0] !== lastCoordinate[0] ||
              firstCoordinate[1] !== lastCoordinate[1]
            ) {
              coordinates.push(firstCoordinate);
            }

            return {
              type: "Polygon",
              id: item._id,
              title: item.title,
              area: item.area,
              coordinates: [coordinates],
            };
          }

          return {
            type: "Polygon",
            coordinates: [],
            id: item._id,
            title: item.title,
          };
        });
        setFarmOptions(newData);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const capturePageNum = (value: string | number) => {
    getFarmOptions({
      search_string: router.query.search_string as string,
      location: router.query.location_id as string,
      userId: router.query.user_id as string,
      page: value,
      limit: 20,
      sortBy: router.query.sort_by as string,
      sortType: router.query.sort_type as string,
      locationName: router.query.location_name,
    });
  };

  const customMarkerIcon = L.icon({
    iconUrl: "./marker-icon-2x.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  // get the farm details
  const getFarmDataById = async (id: any) => {
    try {
      const response: any = await getFarmByIdService(
        id as string,
        accessToken as string
      );

      if (response?.success) {
        setData(response?.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  let mapConfig: any = {
    lat: lat,
    lng: lng,
    zoom: zoom,
  };
  const getFarmLocation = (value: any, id: any) => {
    const centroid = calculateCentroid(value);
    setLanAndLattoMap(centroid[0], centroid[1], 18);
  };

  const calculateCentroid = (coords: any) => {
    let totalLat = 0;
    let totalLng = 0;

    coords.forEach((coord: any) => {
      totalLat += coord[0];
      totalLng += coord[1];
    });

    const centroidLat = totalLat / coords.length;
    const centroidLng = totalLng / coords.length;

    return [centroidLat, centroidLng];
  };

  const setLanAndLattoMap = (lat: any, lan: any, zoom: any) => {
    if (lat) {
      setLat(lat);
      setLng(lan);
      setZoom(zoom);
      setIsRendered(true);
      setTimeout(() => {
        setIsRendered(false);
      }, 1);
    } else {
      toast.error("Location coordinates not found");
    }
  };

  const onChangeLocation = (e: any, value: any, reason: any) => {
    if (reason == "clear") {
      setSelectedPolygon(null);
      setLocation({ title: "All", _id: "1" });
      setLanAndLattoMap(16.0725381, 80.3219856, 10);
      getFarmOptions({
        search_string: router.query.search_string as string,
        location: "" as string,
        userId: router.query.user_id as string,
        page: 1,
        limit: 20,
        sortBy: router.query.sort_by as string,
        sortType: router.query.sort_type as string,
        locationName: router.query.location_name,
      });
      return;
    }
    if (value) {
      setSelectedPolygon(null);
      setLocation(value);
      setLanAndLattoMap(value.coordinates?.[0], value?.coordinates?.[1], 18);
      getFarmOptions({
        search_string: router.query.search_string as string,
        location: value?._id as string,
        userId: router.query.user_id as string,
        page: 1,
        limit: 20,
        sortBy: router.query.sort_by as string,
        sortType: router.query.sort_type as string,
        locationName: router.query.location_name,
      });
    }
  };

  //get the edit polygon details
  const editPolygonDetails = (value: any) => {
    setEditPolyCoordinates(value?.geometry?.coordinates);
    setFarmId(value?._id);
    const centroid = calculateCentroid(value?.geometry?.coordinates);
    setLanAndLattoMap(centroid[0], centroid[1], 18);
  };

  const calculateCentroidForMarker = (coordinates: any) => {
    let sumX = 0;
    let sumY = 0;
    const numPoints = coordinates.length;
    if (numPoints == 0) {
      return [];
    } else {
      coordinates.forEach((point: any) => {
        sumX += point[0];
        sumY += point[1];
      });

      const centroidX = sumX / numPoints;
      const centroidY = sumY / numPoints;
      return [centroidX || 0, centroidY || 0];
    }
  };
  const addPolyToExisting = (value: any) => {
    setFarmId(value?._id);
    getFarmOptions({
      search_string: router.query.search_string as string,
      location: value?.location_id?._id as string,
      userId: router.query.user_id as string,
      page: 1,
      limit: 20,
      sortBy: router.query.sort_by as string,
      sortType: router.query.sort_type as string,
      locationName: router.query.location_name,
    });
  };

  useEffect(() => {
    if (router.isReady && accessToken) {
      let delay = 500;
      let debounce = setTimeout(() => {
        getFarmOptions({
          search_string: searchString as string,
          location: router.query.location_id as string,
          userId: router.query.user_id as string,
          page: router.query.page,
          limit: 20,
          sortBy: router.query.sort_by as string,
          sortType: router.query.sort_type as string,
          locationName: router.query.location_name,
        });
      }, delay);
      return () => clearTimeout(debounce);
    }
  }, [searchString, router.isReady, accessToken]);

  useEffect(() => {
    setSearchString(router.query.search_string as string);
  }, [router.query.search_string]);

  useEffect(() => {
    if (router.isReady && accessToken) {
      if (router.query.location_id) {
        getLocations(router.query.location_id as string);
      } else {
        getLocations();
      }
    }
  }, [router.query, accessToken, router.query.location_id]);
  useEffect(() => {
    setSearchString(router.query.search_string as string);
  }, [router.query.search_string]);

  return (
    <div
      style={{ display: "grid", gridTemplateColumns: "3fr 1fr", width: "100%" }}
    >
      {!isrendered ? (
        <div id="map-wrapper" style={{ width: "100%" }}>
          <MapContainer
            center={[mapConfig?.lat, mapConfig?.lng]}
            zoom={mapConfig?.zoom}
          >
            <DrawTools
              getFarmOptions={getFarmOptions}
              setPolygon={setPolygon}
              setFarmLoactionDetails={setFarmLoactionDetails}
              FarmlocationDetails={FarmlocationDetails}
              setEditFarmsDetails={setEditFarmsDetails}
              editPolyCoordinates={editPolyCoordinates}
              setPolyCoordinates={setPolyCoordinates}
              polyCoordinates={polyCoordinates}
              farmId={farmId}
            />
            <div
              style={{
                position: "absolute",
                top: "0",
                left: "5%",
                zIndex: 1000,
              }}
            >
              <Autocomplete
                disabled={
                  editFarmDetails?._id || router.query.location_name
                    ? true
                    : false
                }
                sx={{
                  width: "250px",
                  maxWidth: "400px",
                  // marginRight: "90px",
                  "& .MuiInputBase-root": {
                    // paddingBlock: "7px !important",
                  },
                  "& .MuiAutocomplete-endAdornment ": {
                    top: "0",
                  },
                }}
                size="small"
                fullWidth
                noOptionsText="No such location"
                value={location}
                disableCloseOnSelect={false}
                isOptionEqualToValue={(option: any, value: any) =>
                  option.title === value.title
                }
                getOptionLabel={(option: any) => option.title}
                options={locations?.length ? locations : []}
                onChange={onChangeLocation}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Search by Farm locations"
                    variant="outlined"
                    size="small"
                    sx={{
                      marginTop: "1rem",
                      "& .MuiInputBase-root": {
                        fontSize: "clamp(.75rem, 0.83vw, 18px)",
                        backgroundColor: "#fff",
                        border: "none",
                        borderRadius: "6px !important",
                        // padding: "10px",
                        marginBottom: "10px",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#fff !important",
                        borderRadius: "6px !important",
                      },
                    }}
                  />
                )}
              />
            </div>

            <LayersControl position="topleft">
              {tiles.map(({ attribution, checked, name, subdomains, url }) => {
                const tileLayerProps = {
                  attribution,
                  url,
                  name,
                };
                return (
                  <LayersControl.BaseLayer
                    checked={!!checked}
                    key={name}
                    name={name}
                  >
                    <TileLayer maxNativeZoom={21} {...tileLayerProps} />
                  </LayersControl.BaseLayer>
                );
              })}
            </LayersControl>
            {farmOptions?.map((polygon: any, index: any) => {
              const center: any = calculateCentroidForMarker(
                polygon.coordinates.flat()
              );
              return (
                <div key={index}>
                  <Polygon
                    positions={polygon.coordinates}
                    pathOptions={{
                      color: "red",
                      fillColor: "red",
                      fillOpacity: 0.5,
                    }}
                  >
                    {center?.length > 0 ? (
                      <Marker position={center} icon={customMarkerIcon}>
                        <Popup>
                          <div>
                            {polygon.title} - {polygon?.area}ar
                          </div>
                        </Popup>
                      </Marker>
                    ) : (
                      ""
                    )}
                  </Polygon>
                </div>
              );
            })}
          </MapContainer>
        </div>
      ) : (
        ""
      )}
      <div style={{ width: "100%" }}>
        <FarmsListBlock
          getFarmLocation={getFarmLocation}
          searchString={searchString}
          setSearchString={setSearchString}
          setEditFarmsDetails={setEditFarmsDetails}
          editFarmDetails={editFarmDetails}
          getFarmOptions={getFarmOptions}
          setSelectedPolygon={setSelectedPolygon}
          setOpenFarmDetails={setOpenFarmDetails}
          getFarmDataById={getFarmDataById}
          farmOptions={farmData}
          paginationDetails={paginationDetails}
          capturePageNum={capturePageNum}
          editPolygonDetails={editPolygonDetails}
          addPolyToExisting={addPolyToExisting}
        />
      </div>
      <Toaster richColors position="top-right" closeButton />
      <LoadingComponent loading={loading} />
    </div>
  );
};

export default HomePage;
