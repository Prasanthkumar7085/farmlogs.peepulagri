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
import FarmsListDrawer from "./FarmsList/FarmsListDrawer";
import FarmsListBlock from "./FarmsList/FarmsListDrawer";
const GoogleMapMarkerComponent = () => {
  const router = useRouter();
  const [data, setData] = useState<any>();
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );
  const [userLocation, setUserLocation] = useState({ lat: 0, lng: 0 });
  const [map, setMap] = useState(null);
  const [googleMaps, setGoogleMaps] = useState(null);
  const [polygon, setPolygon] = useState<any>(null);
  const [polygonCoords, setPolygonCoords] = useState<any>([]);
  const drawingManagerRef = React.useRef(null);
  const pathRef = useRef([]);
  const [mapType, setMapType] = useState("hybrid"); // 'satellite' is the normal map view
  const [renderField, setRenderField] = useState(true);
  const mapRef: any = useRef(null);
  const infoWindowRef: any = useRef(null);
  const placesService: any = useRef(null);

  const [searchedPlaces, setSearchedPlaces] = useState<any>([]);
  const autocompleteRef: any = useRef(null);

  const [latLong, setLatLong] = useState<{ lat: number; long: number }>();

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
      drawingControl: true,
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
    });

    // Set the polygon on the map
    newPolygon.setMap(map);
    setPolygon(newPolygon);

    const markerPosition = {
      lat: polygonCoords[0]?.lat,
      lng: polygonCoords[0]?.lng,
    }; // Replace with your desired coordinates
    const markerTitle = "Hello World!";
    const marker = createMarker(map, maps, markerPosition, markerTitle);
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

  //get the farm details
  const getFarmDataById = async () => {
    const response: any = await getFarmByIdService(
      router.query.farm_id as string,
      accessToken as string
    );

    if (response?.success) {
      setData(response?.data);
    }
    setLoading(false);
  };

  //edit the farm details(with the cordinates)
  const edtiFarm = async () => {
    setLoading(true);
    let editedData: any = {
      title: data?.title,
      area: data?.area,
      location_id: data?.location_id?._id,
      geometry: {
        type: "Polygon",
        coordinates: polygonCoords.map((obj: any) => Object.values(obj)),
      },
    };

    const response = await editFarmService(
      editedData,
      accessToken,
      router.query.farm_id as string
    );
    if (response?.success) {
      router.back();
      toast.success("Farm coordinates added successfully");
    }
    setLoading(false);
  };

  const getCoords = async () => {
    navigator.geolocation.getCurrentPosition(showPosition);
  };
  function showPosition(position: any) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    setLatLong({ lat: latitude, long: longitude });
  }

  //create marker
  const createMarker = (
    map: any,
    maps: any,
    position: { lat: number; lng: number },
    title: string
  ) => {
    const marker = new maps.Marker({
      position: position,
      map: map,
      title: title,
    });

    marker.addListener("click", () => {
      console.log("Marker clicked!");
    });

    return marker;
  };

  //call the single farms details
  useEffect(() => {
    if (router.isReady && accessToken) {
      getCoords();
      getFarmDataById();
    }
  }, [router.isReady, accessToken]);

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

  const centerMapToPlace = (place: any) => {
    if (mapRef.current && place && place.geometry && place.geometry.location) {
      mapRef.current.panTo(place.geometry.location);
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

  return (
    <div
      style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
    >
      <div style={{ width: "75%", height: "100vh", marginTop: "5px" }}>
        <GoogleMapReact
          bootstrapURLKeys={{
            key: process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string,
            libraries: ["drawing", "places"],
          }}
          defaultCenter={{
            lat: latLong?.lat ? latLong?.lat : 15.1534671,
            lng: latLong?.long ? latLong?.long : 79.8478049,
          }}
          options={{
            mapTypeId: mapType,

            streetViewControl: true,
            rotateControl: true,
          }}
          defaultZoom={12}
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
              onClick={undoLastPoint}
              variant="outlined"
              sx={{ backgroundColor: "orange" }}
              disabled={polygonCoords.length === 0}
            >
              <img src={"/undo-icon.png"} width={25} height={25} /> Undo
            </Button>
          </div>
        )}
      </div>
      <div style={{ width: "25%", height: "100vh", marginTop: "5px" }}>
        <FarmsListBlock />
      </div>
      <LoadingComponent loading={loading} />
      <Toaster richColors position="top-right" closeButton />
    </div>
  );
};

export default GoogleMapMarkerComponent;
