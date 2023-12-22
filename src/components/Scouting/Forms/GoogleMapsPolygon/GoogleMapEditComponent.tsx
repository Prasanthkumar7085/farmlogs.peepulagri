import React, { useEffect, useRef, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import { Button, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import styles from "./google-map.module.css";
import getFarmByIdService from '../../../../../lib/services/FarmsService/getFarmByIdService';
import { useSelector } from 'react-redux';
import editFarmService from '../../../../../lib/services/FarmsService/editFarmService';
import { toast } from 'sonner';
import LoadingComponent from '@/components/Core/LoadingComponent';
const GoogleMapEditComponent = () => {

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



    const handleApiLoaded = (map: any, maps: any) => {
        setMap(map);
        setGoogleMaps(maps);
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
            editable: true, // Set the polygon as editable
            draggable: true,
            map: map // Assuming 'map' is your Google Map instance

        });

        google.maps.event.addListener(newPolygon, 'mouseup', () => {
            const updatedCoords = newPolygon.getPath().getArray().map((coord: any) => ({ lat: coord.lat(), lng: coord.lng() }));
            console.log(updatedCoords, "piu");
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
        setLoading(true)
        const response: any = await getFarmByIdService(
            router.query.farm_id as string,
            accessToken as string
        );

        if (response?.success) {
            console.log(response, "iuytr")
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
            toast.success("Farm cordinates added successfully")
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
                    Edit Map
                </Typography>
                <div className={styles.headericon} id="header-icon"></div>
            </div>
            <div style={{ display: "flex", justifyContent: "end", marginBottom: "20px" }}>



            </div>
            {data?._id ?
                <div style={{ width: '100%', height: '65vh' }}>
                    <GoogleMapReact
                        bootstrapURLKeys={{
                            key: process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string,
                            libraries: ['drawing'],
                        }}
                        defaultCenter={{
                            "lat": polygonCoords[0]?.lat,
                            "lng": polygonCoords[0]?.lng
                        }}
                        options={{
                            mapTypeId: mapType,
                            mapTypeControlOptions: true,
                            mapTypeControl: true,
                            streetViewControl: true,
                            rotateControl: true
                        }}
                        defaultZoom={19}
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
                </div> : ""}
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
                    Update
                </Button>
            </div>
            <LoadingComponent loading={loading} />
        </div>
    )
};

export default GoogleMapEditComponent;
