import React, { useEffect, useRef, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import { Button, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import styles from "./google-map.module.css";
import getFarmByIdService from '../../../../../lib/services/FarmsService/getFarmByIdService';
import { useSelector } from 'react-redux';
import editFarmService from '../../../../../lib/services/FarmsService/editFarmService';
import { toast } from 'sonner';
const GoogleMapComponent = () => {

    const router = useRouter();
    const [data, setData] = useState<any>();
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
    const [mapType, setMapType] = useState('roadmap'); // 'roadmap' is the normal map view
    const [renderField, setRenderField] = useState(true);
    const mapRef: any = useRef(null);
    const infoWindowRef: any = useRef(null);



    const addCustomControl = (map: any, maps: any) => {
        const controlDiv = document.createElement('div');
        const controlUI = document.createElement('button');

        controlUI.textContent = 'Pan to Current Location';
        controlUI.style.backgroundColor = '#fff';
        controlUI.style.border = '1px solid #ccc';
        controlUI.style.padding = '5px';
        controlUI.style.cursor = 'pointer';
        controlUI.style.marginBottom = '10px';
        controlUI.style.textAlign = 'center';
        controlUI.title = 'Click to pan to current location';
        controlDiv.appendChild(controlUI);

        controlUI.addEventListener('click', () => {
            if (navigator.geolocation && mapRef.current) {
                const options = {
                    enableHighAccuracy: true, // Request high accuracy if available
                    timeout: 5000, // Set a timeout (milliseconds) for the request
                    maximumAge: 0 // Force a fresh location request
                };

                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const currentPosition = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };

                        mapRef.current.panTo(currentPosition);
                        mapRef.current.setZoom(15); // Optionally set the zoom level as needed

                        const infoWindow = infoWindowRef.current;
                        infoWindow.setPosition(currentPosition);
                        infoWindow.setContent('Location found.');
                        infoWindow.open(mapRef.current);
                    },
                    (error) => {
                        switch (error.code) {
                            case error.PERMISSION_DENIED:
                                console.error('User denied the request for Geolocation.');
                                break;
                            case error.POSITION_UNAVAILABLE:
                                console.error('Location information is unavailable.');
                                break;
                            case error.TIMEOUT:
                                console.error('The request to get user location timed out.');
                                break;
                            default:
                                console.error('An unknown error occurred.');
                                break;
                        }
                    },
                    options // Pass the options to getCurrentPosition
                );
            } else {
                console.error('Geolocation is not supported');
            }
        });

        map.controls[maps.ControlPosition.TOP_RIGHT].push(controlDiv);
    };

    const createInfoWindow = (map: any) => {
        const infoWindow = new window.google.maps.InfoWindow();
        infoWindowRef.current = infoWindow;
    };



    const handleApiLoaded = (map: any, maps: any) => {
        setMap(map);
        setGoogleMaps(maps);
        mapRef.current = map;
        addCustomControl(map, maps);
        createInfoWindow(map);

        const drawingManager = new maps.drawing.DrawingManager({
            drawingControl: true,
            drawingControlOptions: {
                position: maps.ControlPosition.TOP_LEFT,
                drawingModes: [maps.drawing.OverlayType.POLYGON],
            },
            polygonOptions: {
                editable: true,
                draggable: true,
            },
        });

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
        });

        // Set the polygon on the map
        newPolygon.setMap(map);
        setPolygon(newPolygon);
    };

    const undoLastPoint = () => {
        if (googleMaps && polygon) {
            const updatedCoords = [...polygonCoords];
            updatedCoords.pop(); // Remove the last point from the copied coordinates
            setPolygonCoords(updatedCoords);

            const path = updatedCoords.map((coord: any) => new (googleMaps as any).LatLng(coord.lat, coord.lng));
            polygon.setPath(path);
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
        let editedData: any = {
            title: data?.title,
            area: data?.area,
            location_id: data?.location_id?._id,
            "geometry": {
                "type": "Polygon",
                "coordinates": polygonCoords.map((obj: any) => Object.values(obj))
            }
        };


        const response = await editFarmService(
            editedData,
            accessToken,
            router.query.farm_id as string
        );
        if (response?.success) {
            toast.success("Farm coordinates added successfully")
            router.back()
        }
        setLoading(false);
    };

    useEffect(() => {
        if (router.isReady && accessToken) {
            getFarmDataById()
        }

    }, [router.isReady, accessToken])

    return (
        <div >
            <div className={styles.header} id="header">
                <img
                    className={styles.iconsiconArrowLeft}
                    alt=""
                    src="/iconsiconarrowleft.svg"
                    onClick={() => router.back()}
                />
                <Typography className={styles.viewFarm}>
                    Add Map
                </Typography>
                <div className={styles.headericon} id="header-icon"></div>
            </div>
            <div style={{ display: "flex", justifyContent: "end", marginBottom: "20px" }}>



            </div>
            <div style={{ width: '100%', height: '65vh' }}>
                <GoogleMapReact
                    bootstrapURLKeys={{
                        key: process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string,
                        libraries: ['drawing'],
                    }}
                    defaultCenter={{
                        "lat": 15.1534671,
                        "lng": 79.8478049
                    }}
                    options={{
                        mapTypeId: mapType,
                        mapTypeControlOptions: true,
                        mapTypeControl: true,
                        streetViewControl: true,
                        rotateControl: true
                    }}
                    defaultZoom={12}
                    yesIWantToUseGoogleMapApiInternals
                    onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
                />

                {polygonCoords.length === 0 ? "" :
                    <div style={{
                        position: "absolute",
                        top: "72%",
                        right: "20%",
                    }}>
                        <Button onClick={undoLastPoint} variant="outlined"
                            sx={{ backgroundColor: "orange" }}
                            disabled={polygonCoords.length === 0}>
                            <img src={"/undo-icon.png"} width={25} height={25} />  Undo Last Point
                        </Button>
                    </div>}
            </div>
            <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gridGap: "1.5rem",
                marginTop: "1.5rem"
            }}>
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
                    Submit
                </Button>
            </div>

        </div>
    )
};

export default GoogleMapComponent;
