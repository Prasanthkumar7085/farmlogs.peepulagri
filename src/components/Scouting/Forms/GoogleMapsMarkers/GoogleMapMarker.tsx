import React, { useEffect, useRef, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import { Button, ButtonBase, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import styles from "./google-map.module.css";
import getFarmByIdService from '../../../../../lib/services/FarmsService/getFarmByIdService';
import { useSelector } from 'react-redux';
import editFarmService from '../../../../../lib/services/FarmsService/editFarmService';
import { Toaster, toast } from 'sonner';
import LoadingComponent from '@/components/Core/LoadingComponent';
import FarmsListDrawer from "./FarmsList/FarmsListBlock";
import FarmsListBlock from "./FarmsList/FarmsListBlock";
import AddFarmDilog from "./FarmsList/AddFarmDiloag";
import ListAllFarmForDropDownService from "../../../../../lib/services/FarmsService/ListAllFarmForDropDownService";
import ViewFarmDetails from './ViewFarmDetails.tsx/ViewFarmDetails';
const GoogleMapMarkerComponent = () => {

  const router = useRouter();
  const [data, setData] = useState<any>();
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );
  const [userLocation, setUserLocation] = useState({ lat: 0, lng: 0 });
  const [map, setMap] = useState<any>(null);
  const [googleMaps, setGoogleMaps] = useState<any>(null);
  const [polygon, setPolygon] = useState<any>(null);
  const [polygonCoords, setPolygonCoords] = useState<any>([]);
  const drawingManagerRef = React.useRef(null);
  const pathRef = useRef([]);
  const [mapType, setMapType] = useState("hybrid"); // 'satellite' is the normal map view
  const [renderField, setRenderField] = useState(false);
  const mapRef: any = useRef(null);
  const infoWindowRef: any = useRef(null);
  const placesService: any = useRef(null);
  const [polygonMarker, setPlygonMarker] = useState<any>();
  const [farmOptions, setFarmOptions] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [searchedPlaces, setSearchedPlaces] = useState<any>([]);
  const autocompleteRef: any = useRef(null);
  const [selectedPolygon, setSelectedPolygon] = useState(null);
  const [latLong, setLatLong] = useState<{ lat: number; long: number }>();
  const [viewPolygonsCoord, setViewPolygonsCoord] = useState<any>([]);
  const [markerObjects, setMarkerObjects] = useState([]);
  const [openFarmDetails, setOpenFarmDetails] = useState<boolean>(false)
  const [FarmlocationDetails, setFarmLoactionDetails] = useState<any>()
  const [editFarmDetails, setEditFarmsDetails] = useState<any>()

  //add custom control for the live location button
  const addCustomControl = (map: any, maps: any) => {
    const controlDiv = document.createElement("div");
    const controlUI = document.createElement("img");

    controlUI.src = "/live-location.png";
    controlUI.style.backgroundColor = "#fff";
    controlUI.style.border = "1px solid #ccc";
    controlUI.style.padding = "5px";
    controlUI.style.cursor = "pointer";
    controlUI.style.textAlign = "center";
    controlUI.style.width = "23px";
    controlUI.style.height = "23px";
    controlUI.style.marginBottom = "2rem";
    controlUI.style.marginLeft = "-70px";
    controlUI.title = "Click to pan to current location";
    controlDiv.appendChild(controlUI);

    controlUI.addEventListener("click", () => {
      if (navigator.geolocation && mapRef.current) {
        const options = {
          enableHighAccuracy: true, // Request high accuracy if available
          timeout: 5000, // Set a timeout (milliseconds) for the request
          maximumAge: 0, // Force a fresh location request
        };

        navigator.geolocation.getCurrentPosition(
          (position) => {
            const currentPosition = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };

            mapRef.current.panTo(currentPosition);
            mapRef.current.setZoom(15); // Optionally set the zoom level as needed

            const infoWindow = infoWindowRef.current;
            infoWindow.setPosition(currentPosition);
            infoWindow.setContent("Location found.");
            infoWindow.open(mapRef.current);
          },
          (error) => {
            switch (error.code) {
              case error.PERMISSION_DENIED:
                console.error("User denied the request for Geolocation.");
                break;
              case error.POSITION_UNAVAILABLE:
                console.error("Location information is unavailable.");
                break;
              case error.TIMEOUT:
                console.error("The request to get user location timed out.");
                break;
              default:
                console.error("An unknown error occurred.");
                break;
            }
          },
          options // Pass the options to getCurrentPosition
        );
      } else {
        console.error("Geolocation is not supported");
      }
    });

    map.controls[maps.ControlPosition.BOTTOM_LEFT].push(controlDiv);
  };

  //create Info for the google map
  const createInfoWindow = (map: any) => {
    const infoWindow = new (window as any).google.maps.InfoWindow();
    infoWindowRef.current = infoWindow;
  };

  //custom map type event
  const MapTypeControl = () => {
    const controlDiv = document.createElement("div");

    const controlUI = document.createElement("div");
    controlUI.style.display = "flex";
    controlUI.style.flexDirection = "row";
    controlUI.style.backgroundColor = "#fff";
    controlUI.style.border = "2px solid #fff";
    controlUI.style.borderRadius = "3px";
    controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
    controlUI.style.cursor = "pointer";
    controlUI.style.marginBottom = "10px";
    controlUI.style.textAlign = "center";
    controlUI.title = "Click to toggle map type";
    controlDiv.appendChild(controlUI);

    // Create buttons for each map type
    const types = ["roadmap", "satellite", "hybrid"];
    types.forEach((type) => {
      const controlText = document.createElement("div");

      controlText.style.color = "rgb(25,25,25)";
      controlText.style.fontFamily = "Roboto,Arial,sans-serif";
      controlText.style.fontSize = "16px";
      controlText.style.lineHeight = "38px";
      controlText.style.padding = "0 5px";
      controlText.innerHTML = type.charAt(0).toUpperCase() + type.slice(1);
      controlUI.appendChild(controlText);

      controlText.addEventListener("click", () => {
        setMapType(type);
      });
    });

    return controlDiv;
  };

  //google api running event
  const handleApiLoaded = (map: any, maps: any) => {
    setMap(map);
    setGoogleMaps(maps);
    mapRef.current = map;

    addCustomControl(map, maps);
    createInfoWindow(map);
    placesService.current = new maps.places.PlacesService(map);

    const mapTypeControlDiv: any = document.createElement("div");
    const mapTypeControl = MapTypeControl();
    mapTypeControlDiv.index = 1;
    map.controls[maps.ControlPosition.BOTTOM_CENTER].push(mapTypeControlDiv);
    mapTypeControlDiv.appendChild(mapTypeControl);

    // Create a container for the custom autocomplete control
    const customAutocompleteDiv = document.createElement("div");
    const searchInput = document.createElement("input");
    searchInput.setAttribute("type", "search");
    searchInput.setAttribute("id", "searchInput");
    searchInput.setAttribute("placeholder", "Search for a place...");
    searchInput.style.marginBottom = "10px";
    searchInput.style.padding = "10px";
    searchInput.style.width = "200%";
    searchInput.style.margin = "auto";
    searchInput.style.borderRadius = "20px";

    customAutocompleteDiv.appendChild(searchInput);
    map.controls[maps.ControlPosition.TOP_LEFT].push(customAutocompleteDiv);
    // Create Autocomplete for input field
    const autocomplete = new maps.places.Autocomplete(searchInput);
    autocomplete.bindTo("bounds", map);

    const onPlaceChanged = () => {
      const place = autocomplete.getPlace();
      if (!place.geometry || !place.geometry.location) {
        console.error("No place data available");
        return;
      }

      setSearchedPlaces([place]);
      centerMapToPlace(place);
    };

    autocomplete.addListener("place_changed", onPlaceChanged);

    const drawingManager = new maps.drawing.DrawingManager({
      drawingControl: polygonCoords?.length ? false : true,
      drawingControlOptions: {
        position: maps.ControlPosition.TOP_RIGHT,
        drawingModes: [maps.drawing.OverlayType.POLYGON],
      },
      polygonOptions: {
        editable: true,
        draggable: false,
      },
    });

    drawingManager.setMap(map);
    drawingManagerRef.current = drawingManager;


    maps.event.addListener(drawingManager, "overlaycomplete", (event: any) => {
      if (event.type === "polygon") {
        const paths = event.overlay.getPath().getArray();
        const updatedCoords = paths.map((coord: any) => ({
          lat: coord.lat(),
          lng: coord.lng(),
        }));
        setPolygon(event.overlay);
        setPolygonCoords(updatedCoords);
      }
    });

    // Create a new polygon
    const newPolygon = new maps.Polygon({
      paths: polygonCoords,
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.35,
      editable: true, // Set the polygon as editable
      draggable: true,
      map: map, // Assuming 'map' is your Google Map instance
    });

    maps.event.addListener(newPolygon, "mouseup", () => {
      const updatedCoords = newPolygon
        .getPath()
        .getArray()
        .map((coord: any) => ({ lat: coord.lat(), lng: coord.lng() }));
      setPolygonCoords(updatedCoords);
    });

    // Set the polygon on the map
    // Set the polygon on the map

    newPolygon.setMap(map);
    setPolygon(newPolygon);
  };


  //get the farm details
  const getFarmDataById = async (id: any) => {
    const response: any = await getFarmByIdService(
      id as string,
      accessToken as string
    );

    if (response?.success) {
      setData(response?.data);

    }
    setLoading(false);
  };

  //go to the farm location when the farm was selected
  const getFarmLocation = (value: any, id: any) => {
    setSelectedPolygon(id);
  }

  //get the farm list 
  const getFarmOptions = async ({ searchString, location }: any) => {
    setLoading(true);
    let location_id = location ? location : "";
    try {

      let response = await ListAllFarmForDropDownService(
        searchString as string,
        accessToken,
        location_id
      );
      if (response.success) {
        setFarmOptions(response?.data);

        const newData = response.data.map((item: any) => ({
          _id: item._id,
          cor: item?.geometry?.coordinates?.length
            ? item?.geometry?.coordinates
            : [],
        }));

        setRenderField(true);
        setTimeout(() => {
          setRenderField(false);
        }, 0.1);

        setViewPolygonsCoord(newData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  const centerMapToPlace = (place: any) => {
    if (mapRef.current && place.geometry && place.geometry.location) {
      const location = place.geometry.location;
      const latLng = new google.maps.LatLng(location.lat(), location.lng());
      mapRef.current.setCenter(latLng);
      mapRef.current.setZoom(15);
    }
  };

  //drodown marker
  const Marker = ({ text }: any) => (
    <div
      style={{
        color: "white",
        background: "grey",
        padding: "5px 10px",
        display: "inline-flex",
        textAlign: "center",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      {text}
    </div>
  );

  //calculate the centroid of the polygon
  const calculatePolygonCentroid = (coordinates: any) => {
    let x = 0,
      y = 0;
    for (let i = 0; i < coordinates?.length; i++) {
      x += coordinates[i][0];
      y += coordinates[i][1];
    }
    return { lat: x / coordinates?.length, lng: y / coordinates?.length };
  };
  //undo last point
  const undoLastPoint = () => {
    if (googleMaps && polygon) {
      const updatedCoords = [...polygonCoords];
      updatedCoords.pop(); // Remove the last point from the copied coordinates
      setPolygonCoords(updatedCoords);

      const path = updatedCoords.map(
        (coord: any) => new (googleMaps as any).LatLng(coord.lat, coord.lng)
      );
      polygon.setPath(path);

    }
  };

  //clear all points when the polygon is draw
  const clearAllPoints = () => {
    if (googleMaps && polygon) {
      setPolygonCoords([]);
      polygon.setPath([]);
    }
  };

  //get the edit polygon details
  const editPolygonDetails = (value: any) => {
    setRenderField(true);
    setTimeout(() => {
      setRenderField(false);
    }, 0.1);
    setViewPolygonsCoord([]);

    setEditFarmsDetails(value)
    let updatedArray = value?.geometry?.coordinates?.map((item: any) => {
      return {
        lat: item[0],
        lng: item[1]
      }
    })
    setPolygonCoords(updatedArray)
    const polygonCenter = { lat: value?.geometry?.coordinates[0][0], lng: value?.geometry?.coordinates[0][1] };
    map.setCenter(polygonCenter);
    map.setZoom(16);
  }

  //show the list all farms markers and polygons
  useEffect(() => {
    if (map && googleMaps && viewPolygonsCoord.length) {
      // Create markers and polygons for each item in the data array
      const newMarkers: any = [];
      const newPolygons = viewPolygonsCoord
        .map((item: any) => {
          if (item?.cor?.length === 0) return null; // Skip if there are no coordinates

          // // Create polygon for the coordinates
          const polygon = new googleMaps.Polygon({
            paths: item?.cor?.map((cor: any) => ({ lat: cor[0], lng: cor[1] })),
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#FF0000",
            fillOpacity: 0.35,
            map: map,
          });

          // Calculate centroid of the polygon
          const centroid = calculatePolygonCentroid(item.cor);

          // Create marker at the centroid
          const marker = new googleMaps.Marker({
            position: { lat: centroid.lat, lng: centroid.lng },
            map: map,
          });

          const markerInfo = {
            id: item._id,
            name: item.title,
            acres: item.area,
            description: "This is a marker",
          };
          marker.markerInfo = markerInfo;

          newMarkers.push(marker);
          //       googleMaps.event.addListener(marker, 'mouseover', function () {
          //         // Create a new InfoWindow
          //         const infoWindow = new googleMaps.InfoWindow({
          //           content: `
          //   <div>
          //     <h4>${marker.markerInfo?._id}</h4>
          //     <p>${marker.markerInfo?.acres}</p>
          //   </div>
          // `
          //         });

          //         // Open the InfoWindow above the marker
          //         infoWindow.open(map, marker);
          //       });
          marker.addListener("click", () => {
            setSelectedPolygon(markerInfo.id)
            const markerPosition = marker.getPosition();
            const markerInformation = marker.markerInfo;

            const latitude = markerPosition.lat(); // Get the latitude
            const longitude = markerPosition.lng();

            const geocoder = new google.maps.Geocoder();
            const latlng = { lat: latitude, lng: longitude };

            geocoder.geocode({ location: latlng }, (results: any, status) => {
              if (status === google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                  const locationName = results[0].formatted_address; // Get the formatted address
                  setFarmLoactionDetails({ "locationName": locationName, latlng: latlng })
                } else {
                  console.log("No results found");
                }
              } else {
                console.log("Geocoder failed due to: " + status);
              }
            });

            setOpenFarmDetails(true)
            getFarmDataById(markerInformation.id);


          });

          return polygon;
        })
        .filter(Boolean); // Filter out null polygons

      // Set the markers and polygons
      setMarkerObjects(newMarkers);
    }
  }, [map, googleMaps, viewPolygonsCoord]);

  //redirect to the polygon
  useEffect(() => {
    if (map && googleMaps) {
      if (selectedPolygon !== null) {
        // // Display the selected polygon on the map and zoom to fit it
        const selectedPoly = viewPolygonsCoord.find(
          (item: any) => item._id == selectedPolygon
        );
        const bounds = new googleMaps.LatLngBounds();
        selectedPoly?.cor?.forEach((coord: any) => {
          const latLng = new googleMaps.LatLng(coord[0], coord[1]);
          bounds.extend(latLng);
        });
        map.fitBounds(bounds);
      }
      else {
        if (editFarmDetails?._id) {
          // Set default map view to India
          const indiaCenter = { lat: editFarmDetails?.geometry?.coordinates[0][0], lng: editFarmDetails?.geometry?.coordinates[0][1] };
          map.setCenter(indiaCenter);
          map.setZoom(17);
        }
        else {
          // Set default map view to India
          const indiaCenter = { lat: 20.5937, lng: 78.9629 };
          map.setCenter(indiaCenter);
          map.setZoom(5); // Adjust the zoom level as needed
        }
      }
    }
  }, [map, googleMaps, selectedPolygon]);

  useEffect(() => {
    if (router.isReady && accessToken) {
      let delay = 500;
      let debounce = setTimeout(() => {
        getFarmOptions({ searchString: searchString });
      }, delay);
      return () => clearTimeout(debounce);
    }
  }, [router.isReady, accessToken, searchString]);


  //call the places api
  useEffect(() => {
    if (mapRef.current) {
      const { maps } = window.google;

      // Initialize the PlacesService
      placesService.current = new maps.places.PlacesService(
        mapRef.current.map_
      );
    }
  }, []);

  function setPolygonDrawingMode() {
    const drawingManager: any = drawingManagerRef.current;
    if (drawingManager) {
      drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
    }
  }

  function handleAddPolygonButtonClick() {
    setPolygonDrawingMode();
  }

  return (
    <div
      style={{ display: "flex", flexDirection: "row", alignItems: "center", }}
    >
      {renderField == false ?
        <div style={{ width: "75%", height: "100vh", marginTop: "5px" }}>

          <GoogleMapReact
            bootstrapURLKeys={{
              key: process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string,
              libraries: ["drawing", "places"],
            }}
            defaultCenter={{
              lat: latLong?.lat ? latLong?.lat : 15.2224299,
              lng: latLong?.long ? latLong?.long : 79.8784533,
            }}
            options={{
              mapTypeId: mapType,

              streetViewControl: true,
              rotateControl: true,
            }}
            defaultZoom={8}
            yesIWantToUseGoogleMapApiInternals
            onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
          >
            {searchedPlaces.map((place: any) => (
              <Marker
                key={place.id}
                lat={place.geometry.location.lat()}
                lng={place.geometry.location.lng()}
                text={place.name}
              />
            ))}
          </GoogleMapReact>

          {polygonCoords.length === 0 ? (
            ""
          ) : (
            <div
              style={{
                position: "absolute",
                top: "22%",
                right: "25%",
              }}
            >
              <Button
                onClick={clearAllPoints}
                variant="outlined"
                sx={{ backgroundColor: "orange" }}
                disabled={polygonCoords.length === 0}
              >
                <img src={"/blue-delete.png"} width={25} height={25} /> Clear
              </Button>
              <Button
                onClick={() => {
                  setDrawerOpen(true);
                }}
                variant="outlined"
                sx={{ backgroundColor: "orange" }}
                disabled={polygonCoords.length === 0}
              >
                {editFarmDetails?._id ? "Update" : "Save"}
              </Button>

              <Button
                onClick={undoLastPoint}
                variant="outlined"
                sx={{ backgroundColor: "orange" }}
                disabled={polygonCoords.length === 0}
              >
                <img src={"/undo-icon.png"} width={25} height={25} /> Undo
              </Button>
            </div>
          )}
        </div> : ""}

      <div style={{ width: "25%", height: "100vh", marginTop: "5px" }}>
        {openFarmDetails ?
          <ViewFarmDetails
            setOpenFarmDetails={setOpenFarmDetails}
            farmDetails={data}
            FarmlocationDetails={FarmlocationDetails}
          /> :
          <FarmsListBlock
            getFarmLocation={getFarmLocation}
            farmOptions={farmOptions}
            searchString={searchString}
            setSearchString={setSearchString}
            editPolygonDetails={editPolygonDetails}
            setEditFarmsDetails={setEditFarmsDetails}
            editFarmDetails={editFarmDetails}
            setPolygonCoords={setPolygonCoords}
            getFarmOptions={getFarmOptions}
            handleAddPolygonButtonClick={handleAddPolygonButtonClick}
          />}

      </div>
      <LoadingComponent loading={loading} />
      <Toaster richColors position="top-right" closeButton />
      <AddFarmDilog
        setDrawerOpen={setDrawerOpen}
        drawerOpen={drawerOpen}
        polygonCoords={polygonCoords}
        setPolygonCoords={setPolygonCoords}
        getFarmOptions={getFarmOptions}
        setPolygon={setPolygon}
        farm_id={editFarmDetails?._id}
        setEditFarmsDetails={setEditFarmsDetails}

      />
    </div>
  );
};

export default GoogleMapMarkerComponent;
