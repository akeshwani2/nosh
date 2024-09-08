import React from 'react';
import { useMap } from 'react-leaflet';
import './Location.css';

function LocationButton({ onLocationFound }) {
  const map = useMap();

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          map.setView([latitude, longitude], 17);
          onLocationFound({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error fetching location: ", error);
          alert("Unable to fetch your location.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  return (
    <button className="location-button" onClick={handleLocationClick}>
      Use My Location
    </button>
  );
}

export default LocationButton;
