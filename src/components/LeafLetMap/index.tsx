import L from "leaflet";
import { Fragment, useEffect, useRef, useState } from "react";
// import ReactDOM from "react-dom";
import DrawTools from "./MapEditorSidebar/DrawTools";

// import { GlobalStateProvider, useGlobalState } from "./services/Store";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet/dist/leaflet.css";
import {
  LayersControl,
  // withLeaflet,
  MapContainer,
  Polygon,
  TileLayer,
  // useMap,
} from "react-leaflet";
import { useMap } from "react-leaflet";

import { storeEditPolygonCoords } from "@/Redux/Modules/Farms";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { prepareURLEncodedParams } from "../../../lib/requestUtils/urlEncoder";
import getAllFarmsService from "../../../lib/services/FarmsService/getAllFarmsServiceMobile";
import FarmsListBlock from "../Scouting/Forms/GoogleMapsMarkers/FarmsList/FarmsListBlock";
import getFarmByIdService from "../../../lib/services/FarmsService/getFarmByIdService";
import * as turf from "@turf/turf";
// import { EditControl } from "react-leaflet-draw";
// import "./styles.css";
// import "react-leaflet-fullscreen/dist/styles.css";
// import FullscreenControl from "react-leaflet-fullscreen";
// import PrintControlDefault from "react-leaflet-easyprint";

// const PrintControl = withLeaflet(PrintControlDefault);

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
    checked: false,
    url: "//mt.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
    crs: L.CRS.EPSG3857,
  },
  {
    attribution: "&copy; Google",
    name: MAP_PROVIDERS.google.roadmap,
    checked: true,
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
  const dispatch = useDispatch();
  const polygonCoords = useSelector((state: any) => state.farms.polygonCoords);
  const googleSearchLocation = useSelector(
    (state: any) => state.farms.searchLocation
  );
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
  const mapRef: any = useRef(null);
  const infoWindowRef: any = useRef(null);
  const placesService: any = useRef(null);
  const drawingManagerRef = useRef(null);

  const [map, setMap] = useState<any>(null);
  const [googleMaps, setGoogleMaps] = useState<any>(null);
  const [FarmlocationDetails, setFarmLoactionDetails] = useState<any>();
  const [polygon, setPolygon] = useState<any>(null);
  const [drawingOpen, setDrawingOpen] = useState<boolean>(false);
  const [addPolygonOpen, setAddPolygonOpen] = useState<boolean>(false);
  const [latLong, setLatLong] = useState<{ lat: number; long: number }>();
  const [openFarmDetails, setOpenFarmDetails] = useState<boolean>(false);
  const [data, setData] = useState<any>();
  const [farmData, setFarmData] = useState<any>([]);
  const [paginationDetails, setPaginationDetails] = useState<any>();
  const [lat, setLat] = useState<any>(15.2161);
  const [lng, setLng] = useState<any>(79.9049);
  const [zoom, setZoom] = useState<any>(3);
  const [isrendered, setIsRendered] = useState(false);
  const [editPolyCoordinates, setEditPolyCoordinates] = useState<any>();
  const [polyCoordinates, setPolyCoordinates] = useState<any>([]);

  const router = useRouter();
  typeof window !== "undefined";
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
      // router.push({ pathname: "/farm/markers", query: queryParam });
      url = prepareURLEncodedParams(url, restParams);

      const response = await getAllFarmsService(url, accessToken);

      if (response?.success) {
        setFarmData(response?.data);
        const { data, ...rest } = response;
        setPaginationDetails(rest);
        // Assuming response.data is an array of objects with 'geometry' property that contains 'coordinates'
        const newData = response.data.map((item: any) => {
          const coordinates = item?.geometry?.coordinates;

          // Ensure coordinates are in the correct nested array format
          if (coordinates && coordinates.length) {
            // Ensure the polygon coordinates form a closed ring
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
              coordinates: [coordinates], // Wrap in an additional array to nest it correctly
            };
          }

          return {
            type: "Polygon",
            coordinates: [],
          };
        });
        setFarmOptions(newData);

        // setRenderField(true);
        // setTimeout(() => {
        //   setRenderField(false);
        // }, 0.1);

        // setViewPolygonsCoord(newData);
      }
      // if (response?.status == 400) {
      //   setFarmOptions([]);
      //   setPaginationDetails(null);
      //   setRenderField(true);
      //   setTimeout(() => {
      //     // setRenderField(false);
      //   }, 0.1);
      //   // setViewPolygonsCoord([]);
      //   centerMapToPlace(googleSearchLocation);
      // }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  function setPolygonDrawingMode() {
    const drawingManager: any = drawingManagerRef.current;
    if (drawingManager) {
      drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
    }
    setDrawingOpen(true);
  }

  // const addPolyToExisting = (value: any) => {
  //   setPolygonDrawingMode();
  //   setEditFarmsDetails(value);
  //   if (value?.location_id?.coordinates?.length) {
  //     const indiaCenter = {
  //       lat: value?.location_id?.coordinates?.[0],
  //       lng: value?.location_id?.coordinates?.[1],
  //     };
  //     map.setCenter(indiaCenter);
  //     map.setZoom(17);
  //   }
  // };

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
    console.log(`Centroid coordinates: ${centroid[0]}, ${centroid[1]}`);
    setLat(centroid[0]);
    setLng(centroid[1]);
    setZoom(18);
    setIsRendered(true);
    setTimeout(() => {
      setIsRendered(false);
    }, 1);
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

  //get the edit polygon details
  const editPolygonDetails = (value: any) => {
    console.log("val", value.geometry.coordinates);
    let edit = value.geometry.coordinates;
    setEditPolyCoordinates(edit);

    setRenderField(true);
    setTimeout(() => {
      setRenderField(false);
    }, 100);

    setViewPolygonsCoord([]);
    setEditFarmsDetails(value);
    let updatedArray = value?.geometry?.coordinates?.map((item: any) => {
      return {
        lat: item[0],
        lng: item[1],
      };
    });
    setPolyCoordinates(updatedArray);
    // dispatch(storeEditPolygonCoords(updatedArray));
  };
  const markersRef: any = useRef([]);

  useEffect(() => {
    const markers: any = document.getElementsByClassName("leaflet-marker-icon");
    markersRef.current = markers;
    for (let i = 0; i < markers.length; i++) {
      markers[i].src = "./marker.png";
    }
  }, []);

  useEffect(() => {
    getFarmOptions({});
  }, []);
  useEffect(() => {
    setSearchString(router.query.search_string as string);
  }, [router.query.search_string]);

  return (
    <div style={{ display: "flex" }}>
      {!isrendered ? (
        <>
          <Fragment>
            {/* <GlobalStateProvider> */}
            <div id="map-wrapper" style={{ height: "700px", width: "150vh" }}>
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
                  editPolygonDetails={editPolygonDetails}
                  setEditPolyCoordinates={setEditPolyCoordinates}
                  setPolyCoordinates={setPolyCoordinates}
                  polyCoordinates={polyCoordinates}
                />
                {/* <Test /> */}
                <LayersControl position="topleft">
                  {tiles.map(
                    ({ attribution, checked, name, subdomains, url }) => {
                      const tileLayerProps = {
                        attribution,
                        url,
                        name,
                      };
                      // if (subdomains) {
                      //   tileLayerProps.subdomains = subdomains;
                      // }
                      return (
                        <LayersControl.BaseLayer
                          checked={!!checked}
                          key={name}
                          name={name}
                        >
                          <TileLayer maxNativeZoom={19} {...tileLayerProps} />
                        </LayersControl.BaseLayer>
                      );
                    }
                  )}
                </LayersControl>
                {farmOptions?.map((polygon: any, index: any) => (
                  <Polygon
                    key={index}
                    positions={polygon.coordinates}
                    pathOptions={{
                      color: "red",
                      fillColor: "red",
                      fillOpacity: 0.5,
                    }}
                  />
                ))}
              </MapContainer>
            </div>
            {/* </GlobalStateProvider> */}
          </Fragment>
        </>
      ) : (
        ""
      )}
      <div style={{ width: "50vh" }}>
        <FarmsListBlock
          getFarmLocation={getFarmLocation}
          // farmOptions={farmOptions}
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
        />
      </div>
    </div>
  );
};

export default HomePage;
