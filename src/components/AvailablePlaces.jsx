import { useState, useEffect } from "react";
import Places from "./Places.jsx";
import ErrorPage from "./Error.jsx";

export default function AvailablePlaces({ onSelectPlace }) {
  const [fetchingData, setFetchingData] = useState(false);
  const [errorMessage, setError] = useState("");
  const [availablePlaces, setAvailablePlaces] = useState([]);

  useEffect(() => {
    async function fetChPlaces() {
      setFetchingData(true);
      try {
        const response = await fetch("http://localhost:3000/places");
        if (!response.ok) {
          throw new Error("Failed to fetch places");
        }
        const resData = await response.json();
        setAvailablePlaces(resData.places);
      } catch (error) {
        setError(error);
      }
      setFetchingData(false);
    }
    fetChPlaces();
  }, []);
  if (errorMessage) {
    return (
      <ErrorPage
        title="Some error occurred"
        message={errorMessage.message || "Fetching places gave error"}
      />
    );
  }

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
