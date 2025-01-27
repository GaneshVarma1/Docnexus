import React, { useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import type { Doctor } from "../data/mockData";
import "leaflet/dist/leaflet.css";
import L, { LatLngExpression } from "leaflet";

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface DoctorMapProps {
  doctors: Doctor[];
}

// State coordinates mapping
const stateCoordinates: Record<string, [number, number]> = {
  AL: [32.7794, -86.8287],
  AK: [64.0685, -152.2782],
  AZ: [34.2744, -111.6602],
  AR: [34.8938, -92.4426],
  CA: [36.7783, -119.4179],
  CO: [39.5501, -105.7821],
  CT: [41.6032, -73.0877],
  DE: [38.9896, -75.505],
  FL: [27.6648, -81.5158],
  GA: [32.1656, -82.9001],
  HI: [19.8968, -155.5828],
  ID: [44.0682, -114.742],
  IL: [40.0417, -89.1965],
  IN: [39.8647, -86.2604],
  IA: [42.0046, -93.214],
  KS: [38.5266, -96.7265],
  KY: [37.6681, -84.6701],
  LA: [31.1695, -91.8678],
  ME: [44.6074, -69.3977],
  MD: [39.0458, -76.6413],
  MA: [42.4072, -71.3824],
  MI: [44.3148, -85.6024],
  MN: [46.7296, -94.6859],
  MS: [32.3547, -89.3985],
  MO: [38.4561, -92.2884],
  MT: [46.9219, -110.4544],
  NE: [41.4925, -99.9018],
  NV: [38.8026, -116.4194],
  NH: [43.1939, -71.5724],
  NJ: [40.0583, -74.4057],
  NM: [34.5199, -105.8701],
  NY: [42.1657, -74.9481],
  NC: [35.7596, -79.0193],
  ND: [47.5515, -101.002],
  OH: [40.4173, -82.9071],
  OK: [35.5653, -96.9289],
  OR: [44.572, -122.0709],
  PA: [40.5908, -77.2098],
  RI: [41.6809, -71.5118],
  SC: [33.8569, -80.945],
  SD: [44.2998, -99.4388],
  TN: [35.7478, -86.6923],
  TX: [31.9686, -99.9018],
  UT: [39.321, -111.0937],
  VT: [44.5588, -72.5778],
  VA: [37.4316, -78.6569],
  WA: [47.7511, -120.7401],
  WV: [38.5976, -80.4549],
  WI: [44.2685, -89.6165],
  WY: [42.7559, -107.3024],
};

// Add some random offset to prevent markers from stacking exactly on top of each other
const getRandomOffset = () => {
  return (Math.random() - 0.5) * 2;
};

const mapContainerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "0.5rem",
};

const DoctorMap: React.FC<DoctorMapProps> = ({ doctors }) => {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  // Calculate the center based on visible doctors
  const { center, bounds, markers } = useMemo(() => {
    const visibleDoctors = doctors.filter((doc) => doc.city_state);
    const coordinates: [number, number][] = [];
    const markersData = [];

    for (const doctor of visibleDoctors) {
      const state = doctor.city_state.split(", ")[1];
      const baseCoords = stateCoordinates[state];

      if (baseCoords) {
        // Add small random offset to prevent exact overlapping
        const position: [number, number] = [
          baseCoords[0] + getRandomOffset(),
          baseCoords[1] + getRandomOffset(),
        ];
        coordinates.push(position);
        markersData.push({ doctor, position });
      }
    }

    // Calculate center and bounds
    const center =
      coordinates.length > 0
        ? ([
            coordinates.reduce((sum, coord) => sum + coord[0], 0) /
              coordinates.length,
            coordinates.reduce((sum, coord) => sum + coord[1], 0) /
              coordinates.length,
          ] as [number, number])
        : [39.8283, -98.5795]; // Center of USA

    const bounds =
      coordinates.length > 0
        ? L.latLngBounds(
            coordinates.map((coord) => L.latLng(coord[0], coord[1]))
          )
        : undefined;

    return { center, bounds, markers: markersData };
  }, [doctors]);
  return (
    <MapContainer
      center={center as LatLngExpression}
      zoom={4}
      style={mapContainerStyle}
      scrollWheelZoom={false}
      bounds={bounds}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map(({ doctor, position }) => (
        <Marker
          key={doctor.npi_number}
          position={position}
          eventHandlers={{
            click: () => setSelectedDoctor(doctor),
          }}
        >
          <Popup>
            <div className="min-w-[200px]">
              <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
              <p className="text-sm text-gray-600">{doctor.specialty}</p>
              <p className="text-sm text-gray-600">{doctor.hco}</p>
              <p className="text-sm text-gray-600">{doctor.city_state}</p>
              <div className="mt-2 text-sm text-gray-600">
                <p>Publications: {doctor.num_publications}</p>
                <p>Clinical Trials: {doctor.num_clinical_trials}</p>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default DoctorMap;
