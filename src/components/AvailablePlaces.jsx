import { useState, useEffect } from "react";
import Places from "./Places.jsx";
import ErrorPage from "./Error.jsx";
import { GetAvailablePlaces } from "../httphelper.js";

export default function AvailablePlaces({ onSelectPlace }) {
  const [fetchingData, setFetchingData] = useState(false);
  const [errorMessage, setError] = useState("");
  const [availablePlaces, setAvailablePlaces] = useState([]);

  useEffect(() => {
    async function fetChPlaces() {
      setFetchingData(true);
      try {
        var response = await GetAvailablePlaces();
        setAvailablePlaces(response);
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
