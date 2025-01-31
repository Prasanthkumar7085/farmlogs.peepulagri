import React, { useEffect, useRef, useState } from "react";
import GoogleMapReact from "google-map-react";
import { Button, Typography } from "@mui/material";
import { useRouter } from "next/router";
import styles from "./google-map.module.css";
import getFarmByIdService from "../../../../../lib/services/FarmsService/getFarmByIdService";
import { useSelector } from "react-redux";
import editFarmService from "../../../../../lib/services/FarmsService/editFarmService";
import { Toaster, toast } from "sonner";
import LoadingComponent from "@/components/Core/LoadingComponent";
const GoogleMapEditComponent = () => {
  const router = useRouter();
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState(true);
  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );
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
  const [renderMap, setRenderMap] = useState<any>(false);
  const [latLong, setLatLong] = useState<{ lat: number; long: number }>();
  const [polygonMarker, setPlygonMarker] = useState<any>();

  //get the current location
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

  //create the window for the
  const createInfoWindow = (map: any) => {
    const infoWindow = new (window as any).google.maps.InfoWindow();
    infoWindowRef.current = infoWindow;
  };

  //maptype control event
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

    marker.addListener("click", () => {});

    return marker;
  };

  //google api event
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
    searchInput.style.width = "140%";
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
    setRenderField(false);
    setTimeout(() => {
      setRenderField(true);
    }, 0.1);
    newPolygon.setMap(map);
    setPolygon(newPolygon);

    const markerPosition = {
      lat: polygonCoords[0].lat,
      lng: polygonCoords[0].lng,
    }; // Replace with your desired coordinates
    const markerTitle = "Hello World!";
    const marker = createMarker(map, maps, markerPosition, markerTitle);
  };

  //undo the last point of the polygon
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

  //center the map when the place was selected
  const centerMapToPlace = (place: any) => {
    if (mapRef.current && place && place.geometry && place.geometry.location) {
      mapRef.current.panTo(place.geometry.location);
    }
  };

  const calculateCenterOfPolygon = (coordinates: any) => {
    if (coordinates.length === 0) {
      return null; // Handle empty array case
    }

    // Calculate average latitude and longitude
    const avgLat =
      coordinates.reduce((sum: any, coord: any) => sum + coord.lat, 0) /
      coordinates.length;
    const avgLng =
      coordinates.reduce((sum: any, coord: any) => sum + coord.lng, 0) /
      coordinates.length;

    return { lat: avgLat, lng: avgLng };
  };

  //get the farm details
  const getFarmDataById = async () => {
    setLoading(true);
    try {
      const response: any = await getFarmByIdService(
        router.query.farm_id as string,
        accessToken as string
      );

      if (response?.success) {
        setData(response?.data);
        if (response?.data?.geometry?.coordinates?.length) {
          let updatedArray = response?.data?.geometry?.coordinates.map(
            (item: any) => {
              return {
                lat: item[0],
                lng: item[1],
              };
            }
          );
          const centerPoint = calculateCenterOfPolygon(
            response?.data?.geometry?.coordinates
          );
          setPlygonMarker(centerPoint);
          setRenderField(false);
          setTimeout(() => {
            setRenderField(true);
          }, 0.1);
          setPolygonCoords(updatedArray);
        } else {
          setPolygonCoords([]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  //edit the farm details(with the cordinates)
  const edtiFarm = async () => {
    setLoading(true);

    try {
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
        toast.success("Farm cordinates added successfully");
        router.back();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  //cleat all the polygon points
  const clearAllPoints = () => {
    if (googleMaps && polygon) {
      setPolygonCoords([]);
      polygon.setPath([]);
    }
    setLoading(true);
    setRenderMap(true);
    setTimeout(() => {
      setRenderMap(false);
      setLoading(false);
    }, 2000);
  };

  //get the current location
  const getCoords = async () => {
    navigator.geolocation.getCurrentPosition(showPosition);
  };
  function showPosition(position: any) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    setLatLong({ lat: latitude, long: longitude });
  }
  useEffect(() => {
    if (router.isReady && accessToken) {
      getCoords();
      getFarmDataById();
    }
  }, [router.isReady, accessToken]);

  return (
    <div>
      {router.pathname == `/farm/[farm_id]/map/edit` ? (
        ""
      ) : (
        <div className={styles.header} id="header">
          <img
            className={styles.iconsiconArrowLeft}
            alt=""
            src="/iconsiconarrowleft.svg"
            onClick={() => router.back()}
          />
          <Typography className={styles.viewFarm}>Edit Map</Typography>
          <div className={styles.headericon} id="header-icon"></div>
        </div>
      )}

      {data?._id && renderMap == false ? (
        <div
          style={{
            width: "100%",
            height:
              router.pathname == `/farm/[farm_id]/map/edit` ? "90vh" : "65vh",
            marginTop:
              router.pathname == `/farm/[farm_id]/map/edit` ? "5px" : "",
          }}
        >
          <GoogleMapReact
            bootstrapURLKeys={{
              key: process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string,
              libraries: ["drawing", "places"],
            }}
            defaultCenter={{
              lat: polygonCoords[0]?.lat ? polygonCoords[0]?.lat : latLong?.lat,
              lng: polygonCoords[0]?.lng
                ? polygonCoords[0]?.lng
                : latLong?.long,
            }}
            options={{
              mapTypeId: mapType,

              streetViewControl: true,
              rotateControl: true,
            }}
            defaultZoom={
              router.pathname == `/farm/[farm_id]/map/edit` ? 20 : 16
            }
            yesIWantToUseGoogleMapApiInternals
            onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
          ></GoogleMapReact>

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
      ) : (
        ""
      )}

      {loading == false ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridGap: "1.5rem",
            marginTop: "1.5rem",
          }}
        >
          <Button
            className={styles.back}
            name="back"
            size="medium"
            variant="outlined"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            className={styles.submit}
            color="primary"
            name="submit"
            variant="contained"
            type="submit"
            disabled={polygonCoords?.length ? false : true}
            onClick={edtiFarm}
          >
            Update
          </Button>
        </div>
      ) : (
        ""
      )}
      <LoadingComponent loading={loading} />
      <Toaster richColors position="top-right" closeButton />
    </div>
  );
};

export default GoogleMapEditComponent;
