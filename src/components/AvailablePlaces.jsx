import { useState, useEffect } from "react";
import Places from "./Places.jsx";

export default function AvailablePlaces({ onSelectPlace }) {
  const [fetchingData, setFetchingData] = useState(false);

  const [availablePlaces, setAvailablePlaces] = useState([]);

  useEffect(() => {
    async function fetChPlaces() {
      setFetchingData(true);
      const response = await fetch("http://localhost:3000/places");
      const resData = await response.json();
      setAvailablePlaces(resData.places);
      setFetchingData(false);
    }
    fetChPlaces();
  }, []);
  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      fallbackText="No places available."
      isLoading={fetchingData}
      loadingText="Fetching the places data"
      onSelectPlace={onSelectPlace}
    />
  );
}
