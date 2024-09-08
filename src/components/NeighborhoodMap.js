import React, { useState, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import LocationButton from './LocationButton';
import './Location.css';
import BackButton from './BackButton';
import './BackButton.css';

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

function ClickHandler({ onClick }) {
  useMapEvents({
    click: (e) => onClick(e.latlng),
  });
  return null;
}

function NeighborhoodMap() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const location = useLocation();
  const { searchTerm, partySize } = location.state || {};

  useEffect(() => {
    console.log("NeighborhoodMap mounted", { searchTerm, partySize });
    // Load Google Maps API script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,geometry,distancematrix`;
    script.async = true;
    script.onload = () => console.log("Google Maps API loaded");
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [searchTerm, partySize]);

  const handleMapClick = useCallback((latlng) => {
    console.log("Map clicked at:", latlng);
    setSelectedLocation(latlng);
    fetchRestaurants(latlng);
  }, []);

  const handleUserLocation = useCallback((latlng) => {
    setUserLocation(latlng);
    fetchRestaurants(latlng);
  }, []);

  const fetchRestaurants = useCallback((latlng) => {
    if (!window.google) {
      console.log("Google Maps API not loaded yet");
      return;
    }
    console.log("fetchRestaurants called with:", latlng, searchTerm);
    
    const service = new window.google.maps.places.PlacesService(document.createElement('div'));
    const request = {
      location: new window.google.maps.LatLng(latlng.lat, latlng.lng),
      radius: '1000', // 1000 meters
      type: ['restaurant'],
      query: searchTerm,
    };

    service.textSearch(request, (results, status) => {
      console.log("Places API response:", status, results);
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        const mappedResults = results.map(place => ({
          id: place.place_id,
          name: place.name,
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          rating: place.rating,
          address: place.formatted_address,
          distance: window.google.maps.geometry.spherical.computeDistanceBetween(
            new window.google.maps.LatLng(latlng.lat, latlng.lng),
            place.geometry.location
          )
        }));

        // Sort results by distance
        mappedResults.sort((a, b) => a.distance - b.distance);

        console.log("Sorted and mapped restaurants:", mappedResults);
        
        // Fetch travel times
        const origins = [new window.google.maps.LatLng(latlng.lat, latlng.lng)];
        const destinations = mappedResults.map(restaurant => 
          new window.google.maps.LatLng(restaurant.lat, restaurant.lng)
        );

        const distanceMatrixService = new window.google.maps.DistanceMatrixService();
        distanceMatrixService.getDistanceMatrix(
          {
            origins: origins,
            destinations: destinations,
            travelMode: 'DRIVING',
          },
          (response, status) => {
            if (status === 'OK') {
              const restaurantsWithTravelTime = mappedResults.map((restaurant, index) => ({
                ...restaurant,
                travelTime: response.rows[0].elements[index].duration.text
              }));
              setRestaurants(restaurantsWithTravelTime);
            } else {
              console.error('Error fetching travel times:', status);
              setRestaurants(mappedResults);
            }
            setHasSearched(true);
          }
        );
      } else {
        console.error("Error fetching restaurants:", status);
        setRestaurants([]);
        setHasSearched(true);
      }
    });
  }, [searchTerm]);

  // Helper function to convert meters to miles
  const metersToMiles = (meters) => {
    return (meters * 0.000621371).toFixed(2);
  };

  const userIcon = L.icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    shadowSize: [41, 41]
  });

  const clickedIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    shadowSize: [41, 41]
  });

  return (
    <div>
      <h2 className='where-text'>Where?</h2>
      <BackButton className='back-button'/>
      <MapContainer 
        className='map' 
        center={[33.7490, -84.3880]} 
        zoom={13} 
        style={{ height: '500px', width: '500px' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationButton onLocationFound={handleUserLocation} />
        <ClickHandler onClick={handleMapClick} />
        {userLocation && (
          <Marker position={userLocation} icon={userIcon}>
            <Popup>Your Location</Popup>
          </Marker>
        )}
        {selectedLocation && (
          <Marker position={selectedLocation} icon={clickedIcon}>
            <Popup>Selected Location</Popup>
          </Marker>
        )}
        {restaurants.map((restaurant) => (
          <Marker 
            key={restaurant.id} 
            position={[restaurant.lat, restaurant.lng]}
          >
            <Popup>{restaurant.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
      {restaurants.length > 0 ? (
        <div className="restaurant-list">
          <h3>Nearby Restaurants</h3>
          <ul>
            {restaurants.map((restaurant) => (
              <li key={restaurant.id}>
                <strong>{restaurant.name}</strong>
                <br />
                Rating: {restaurant.rating ? `${restaurant.rating} / 5` : 'No rating'}
                <br />
                Address: {restaurant.address}
                <br />
                Distance: {metersToMiles(restaurant.distance)} miles
                <br />
                Travel Time: {restaurant.travelTime || 'Not available'}
              </li>
            ))}
          </ul>
        </div>
      ) : hasSearched && (
        <div>No restaurants found. Try a different search term or location.</div>
      )}
    </div>
  );
}

export default NeighborhoodMap;