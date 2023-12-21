import React, { useEffect, useRef, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import { Button, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import styles from "./google-map.module.css";
const GoogleMapComponent = () => {

    const router = useRouter()
    const [userLocation, setUserLocation] = useState({ lat: 0, lng: 0 });
    console.log(userLocation, "pp")
    const [map, setMap] = useState(null);
    const [googleMaps, setGoogleMaps] = useState(null);
    const [polygon, setPolygon] = useState<any>(null);
    const [polygonCoords, setPolygonCoords] = useState([]);
    console.log(polygonCoords, "mk")
    const drawingManagerRef = React.useRef(null);
    const pathRef = useRef([]);
    const [mapType, setMapType] = useState('roadmap'); // 'roadmap' is the normal map view


    useEffect(() => {
    }, [userLocation]);

    const getTheLocations = () => {
        // Prepare the data to be sent to Google Geolocation API
        const requestData = {
            considerIp: true,
            wifiAccessPoints: [], // You can add Wi-Fi access points if available
            cellTowers: [], // You can add cell tower information if available
            homeMobileCountryCode: 310, // Replace with the appropriate mobile country code
            homeMobileNetworkCode: 410, // Replace with the appropriate mobile network code
        };

        // Make a POST request to Google Geolocation API
        fetch('https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyAqlzQZ9Ytc07b63uin6ab85mCYuqtcTk8', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        })
            .then(response => response.json())
            .then(data => {
                // Handle the response from Google Geolocation API
                setUserLocation({
                    lat: data.location.lat,
                    lng: data.location.lng,
                });
            })
            .catch(error => {
                console.error('Error getting user location:', error);
            });

    }

    const handleApiLoaded = (map: any, maps: any) => {
        setMap(map);
        setGoogleMaps(maps);
        const drawingManager = new maps.drawing.DrawingManager({
            drawingControl: true,
            drawingControlOptions: {
                position: maps.ControlPosition.TOP_CENTER,
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
    };


    const toggleMapType = () => {
        setMapType(mapType === 'roadmap' ? 'satellite' : 'roadmap');
    };


    const handlePolygonComplete = (polygon: any) => {
        const paths = polygon.getPath();
        const updatedCoords = paths.getArray().map((coord: any) => ({ lat: coord.lat(), lng: coord.lng() }));
        setPolygon(polygon);
        setPolygonCoords(updatedCoords);
        pathRef.current = updatedCoords.slice();
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


                <div>
                    <Button onClick={toggleMapType} variant="contained">
                        {mapType === 'roadmap' ? 'Switch to Satellite' : 'Switch to Roadmap'}
                    </Button>
                </div>
            </div>
            <div style={{ width: '100%', height: '65vh' }}>
                <GoogleMapReact
                    bootstrapURLKeys={{
                        key: 'AIzaSyAqlzQZ9Ytc07b63uin6ab85mCYuqtcTk8',
                        libraries: ['drawing'],
                    }}
                    defaultCenter={{
                        "lat": 15.1534671,
                        "lng": 79.8478049
                    }}
                    options={{
                        mapTypeId: mapType, // Set the initial map type
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
                >
                    Submit
                </Button>
            </div>

        </div>
    )
};

export default GoogleMapComponent;
