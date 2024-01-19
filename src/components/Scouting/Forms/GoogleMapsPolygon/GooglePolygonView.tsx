import React, { useEffect, useRef, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import { Button, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import styles from "./google-map.module.css";
import getFarmByIdService from '../../../../../lib/services/FarmsService/getFarmByIdService';
import { useSelector } from 'react-redux';
import editFarmService from '../../../../../lib/services/FarmsService/editFarmService';
import { Toaster, toast } from 'sonner';
import LoadingComponent from '@/components/Core/LoadingComponent';
const GoogleMapViewComponent = () => {
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
    const [mapType, setMapType] = useState("hybrid"); // 'satellite' is the normal map view
    const mapRef: any = useRef(null);
    const infoWindowRef: any = useRef(null);
    const placesService: any = useRef(null);

    const [searchedPlaces, setSearchedPlaces] = useState<any>([]);

    const [latLong, setLatLong] = useState<{ lat: number; long: number }>();
    const [renderField, setRenderField] = useState(true);


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
        controlUI.style.width = "23px"
        controlUI.style.height = "23px"
        controlUI.style.marginBottom = "2rem"
        controlUI.style.marginLeft = "-70px"
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
        controlUI.style.display = "flex"
        controlUI.style.flexDirection = "row"
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

        const drawingManager = new maps.drawing.DrawingManager({
            drawingControl: false,
            drawingControlOptions: {
                position: maps.ControlPosition.TOP_RIGHT,
                drawingModes: [maps.drawing.OverlayType.POLYGON],
            },

        });

        drawingManager.setMap(map);
        drawingManagerRef.current = drawingManager;

        drawingManager.setMap(map);
        drawingManagerRef.current = drawingManager;

        maps.event.addListener(drawingManager, 'overlaycomplete', (event: any) => {
            if (event.type === 'polygon') {
                const paths = event.overlay.getPath().getArray();
                const updatedCoords = paths.map((coord: any) => ({ lat: coord.lat(), lng: coord.lng() }));
                setPolygon(event.overlay);
                setPolygonCoords(updatedCoords);
            }
        });


        // Create a new polygon
        const newPolygon = new maps.Polygon({
            paths: polygonCoords,
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            editable: false, // Set the polygon as editable
            draggable: false,
            map: map // Assuming 'map' is your Google Map instance

        });

        maps.event.addListener(newPolygon, 'mouseup', () => {
            const updatedCoords = newPolygon.getPath().getArray().map((coord: any) => ({ lat: coord.lat(), lng: coord.lng() }));
            setPolygonCoords(updatedCoords);
        });

        // Set the polygon on the map
        setRenderField(false);
        setTimeout(() => {
            setRenderField(true);
        }, 0.1);
        newPolygon.setMap(map);
        setPolygon(newPolygon);
    };

    //get the farm details
    const getFarmDataById = async () => {

        setLoading(true)
        try {
            const response: any = await getFarmByIdService(
                router.query.farm_id as string,
                accessToken as string
            );

            if (response?.success) {
                setData(response?.data);
                if (response?.data?.geometry?.coordinates?.length) {
                    let updatedArray = response?.data?.geometry?.coordinates.map((item: any) => {
                        return {
                            lat: item[0],
                            lng: item[1]
                        }
                    })
                    setRenderField(false);
                    setTimeout(() => {
                        setRenderField(true);
                    }, 0.1);
                    setPolygonCoords(updatedArray)

                }
                else {
                    setPolygonCoords([])
                }
            }
        }
        catch (err) {
            console.error(err)
        }
        finally {
            setLoading(false);
        }
    };

    //edit the farm details(with the cordinates)

    const getCoords = async () => {
        navigator.geolocation.getCurrentPosition(showPosition);
    };
    function showPosition(position: any) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setLatLong({ lat: latitude, long: longitude });
    }


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
        <div>

            {data?._id ?
                <div style={{ width: '100%', height: router.pathname == `/farms/[farm_id]` ? "30vh" : '65vh', marginTop: router.pathname == `/farm/[farm_id]/map/edit` ? "5px" : "" }}>
                    <GoogleMapReact
                        bootstrapURLKeys={{
                            key: process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string,
                            libraries: ['drawing', "places"],
                        }}
                        defaultCenter={{
                            "lat": polygonCoords[0]?.lat,
                            "lng": polygonCoords[0]?.lng
                        }}
                        options={{
                            mapTypeId: mapType,

                            rotateControl: true
                        }}
                        defaultZoom={17}
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

                </div> : ""}

            <LoadingComponent loading={loading} />
            <Toaster richColors position="top-right" closeButton />
        </div>
    );
};

export default GoogleMapViewComponent;
