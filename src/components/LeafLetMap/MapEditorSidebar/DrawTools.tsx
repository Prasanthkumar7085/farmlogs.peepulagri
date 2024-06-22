import AddFarmDilog from "@/components/Scouting/Forms/GoogleMapsMarkers/FarmsList/AddFarmDiloag";
import * as turf from "@turf/turf";
import axios from "axios";
import L from "leaflet";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet/dist/leaflet.css";
import { useState } from "react";
import { FeatureGroup, Polygon } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import { useSelector } from "react-redux";

const DrawTools = ({
  getFarmOptions,
  setPolygon,
  setFarmLoactionDetails,
  FarmlocationDetails,
  setEditFarmsDetails,
  editPolyCoordinates,
  setPolyCoordinates,
  polyCoordinates,
  farmId,
}: any) => {
  const polygonCoords = useSelector((state: any) => state.farms.polygonCoords);

  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  // const [polyCoordinates, setPolyCoordinates] = useState<any>([]);

  const reverseGeocode = async (lat: any, lng: any) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      );
      return response.data.display_name;
    } catch (error) {
      console.error("Error during reverse geocoding:", error);
      return null;
    }
  };
  const _onEdited = async (e: any) => {
    const { layers } = e;
    layers.eachLayer((layer: any) => {
      if (layer instanceof L.Polygon) {
        const newCoordinates: any = layer.getLatLngs()[0];
        const updateLatlngs = newCoordinates
          .flat()
          .map((latlng: any) => [latlng.lat, latlng.lng]);
        setPolyCoordinates(updateLatlngs);
        let coordinates = [...updateLatlngs];
        if (
          coordinates.length > 0 &&
          (coordinates[0][0] !== coordinates[coordinates.length - 1][0] ||
            coordinates[0][1] !== coordinates[coordinates.length - 1][1])
        ) {
          coordinates.push(coordinates[0]);
        }
        // Calculate area in acres
        const polygon = turf.polygon([coordinates]);
        const areaSqMeters = turf.area(polygon);
        const areaAcres = areaSqMeters / 4046.86;
        const centroid = turf.centroid(polygon);
        const [lng, lat] = centroid.geometry.coordinates;
        getLocationFromCordinates(lng, lat, areaAcres, coordinates);
      }
    });
  };
  const getLocationFromCordinates = async (
    lng: any,
    lat: any,
    areaAcres: any,
    coordinates: any
  ) => {
    const placeName = await reverseGeocode(
      coordinates[0][0],
      coordinates[0][1]
    );
    let afterRemoveingSpaces = placeName
      .split(",")[1]
      ?.replace(/[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/? ]/g, "");
    setFarmLoactionDetails({
      locationName: afterRemoveingSpaces,
      latlng: [lng, lat],
      areaInAcres: +areaAcres.toFixed(2),
      farm_id: farmId,
    });
    setDrawerOpen(true);
  };

  const _onCreated = async (e: any) => {
    let type = e.layerType;
    let layer = e.layer;
    const layerGeoJson = layer.toGeoJSON();
    const latlngs = layer.getLatLngs();
    let updateLatlngs = latlngs.flat().map((item: any) => {
      return [item.lat, item.lng];
    });

    setPolyCoordinates(updateLatlngs);

    if (type === "polygon" || type === "rectangle") {
      let coordinates = latlngs[0].map((latlng: any) => [
        latlng.lng,
        latlng.lat,
      ]);

      // Ensure the polygon is closed by checking if the first and last coordinates are the same
      if (
        coordinates.length > 0 &&
        (coordinates[0][0] !== coordinates[coordinates.length - 1][0] ||
          coordinates[0][1] !== coordinates[coordinates.length - 1][1])
      ) {
        coordinates.push(coordinates[0]);
      }

      const polygon = turf.polygon([coordinates]);
      const areaSqMeters = turf.area(polygon);
      const areaAcres = areaSqMeters / 4046.86;
      console.log(
        "Area of the polygon/rectangle:",
        areaAcres.toFixed(2),
        "acres"
      );

      // Calculate the centroid of the polygon
      const centroid = turf.centroid(polygon);
      const [lng, lat] = centroid.geometry.coordinates;
      console.log(centroid, "cent");

      // Get place name using reverse geocoding
      const placeName = await reverseGeocode(lat, lng);
      console.log("Place name of the polygon:", placeName);
      let afterRemoveingSpaces = placeName
        .split(",")[1]
        ?.replace(/[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/? ]/g, "");
      setFarmLoactionDetails({
        locationName: afterRemoveingSpaces,
        latlng: [lng, lat],
        areaInAcres: areaAcres.toFixed(2),
        farm_id: farmId,
      });
    }

    setDrawerOpen(true);

    console.log("Geojson", layerGeoJson);
    console.log("coords", latlngs);
  };

  const _onDeleted = (e: any) => {
    let numDeleted = 0;
    e.layers.eachLayer((layer: any) => {
      numDeleted += 1;
    });
    console.log(`onDeleted: removed ${numDeleted} layers`, e);
  };

  const _onMounted = (drawControl: any) => {
    console.log("_onMounted", drawControl);
  };

  const _onEditStart = (e: any) => {
    if (editPolyCoordinates != null) {
    }
  };

  const _onEditStop = (e: any) => {
    console.log("_onEditStop", e);
  };

  const _onDeleteStart = (e: any) => {
    console.log("_onDeleteStart", e);
  };

  const _onDeleteStop = (e: any) => {
    console.log("_onDeleteStop", e);
  };

  const _onDrawStart = (e: any) => {
    console.log("_onDrawStart", e);
  };

  return (
    <div>
      <FeatureGroup>
        <EditControl
          onDrawStart={_onDrawStart}
          position="topleft"
          onEdited={_onEdited}
          onCreated={_onCreated}
          onDeleted={_onDeleted}
          onEditStart={_onEditStart}
          draw={{
            polyline: {
              icon: new L.DivIcon({
                iconSize: new L.Point(8, 8),
                className: "leaflet-div-icon leaflet-editing-icon",
              }),
            },
            rectangle: true,
            circlemarker: false,
            circle: false,
            polygon: true,
          }}
        />
        {editPolyCoordinates?.length > 0 && (
          <Polygon positions={editPolyCoordinates} />
        )}
      </FeatureGroup>
      <div>
        <AddFarmDilog
          setDrawerOpen={setDrawerOpen}
          drawerOpen={drawerOpen}
          polygonCoords={polygonCoords}
          getFarmOptions={getFarmOptions}
          setPolygon={setPolygon}
          setFarmLoactionDetails={setFarmLoactionDetails}
          FarmlocationDetails={FarmlocationDetails}
          setEditFarmsDetails={setEditFarmsDetails}
          polyCoordinates={polyCoordinates}
        />
      </div>
    </div>
  );
};

export default DrawTools;
