import { useRef, useState, useCallback, useEffect } from "react";

import Places from "./components/Places.jsx";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import logoImg from "./assets/logo.png";
import AvailablePlaces from "./components/AvailablePlaces.jsx";
import { SaveUserPlaces, GetUserSlectedPlaces } from "./httphelper.js";
import ErrorPage from "./components/Error.jsx";

function App() {
  const selectedPlace = useRef();

  const [userPlaces, setUserPlaces] = useState([]);
  const [fetchSelectedError, setFetchSelectedError] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    async function FetchUserPlaces() {
      try {
        const userSelected = await GetUserSlectedPlaces();
        setUserPlaces(userSelected);
        setFetchSelectedError("");
      } catch (error) {
        console.log(error);
        setFetchSelectedError(error);
      }
    }

    FetchUserPlaces();
  }, []);
  var userSelectedPlaces = (
    <Places
      title="I'd like to visit ..."
      fallbackText="Select the places you would like to visit below."
      places={userPlaces}
      onSelectPlace={handleStartRemovePlace}
    />
  );
  if (fetchSelectedError) {
    userSelectedPlaces = (
      <ErrorPage
        title="Some error occurred fetching the data"
        message={
          fetchSelectedError.message || "Fetching selected places gave error"
        }
      />
    );
  }
  function handleStartRemovePlace(place) {
    setModalIsOpen(true);
    selectedPlace.current = place;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  async function handleSelectPlace(selectedPlace) {
    setFetchSelectedError("");
    setUserPlaces((prevPickedPlaces) => {
      if (!prevPickedPlaces) {
        prevPickedPlaces = [];
      }
      if (prevPickedPlaces.some((place) => place.id === selectedPlace.id)) {
        return prevPickedPlaces;
      }
      return [selectedPlace, ...prevPickedPlaces];
    });
    try {
      await SaveUserPlaces([...userPlaces, selectedPlace]);
    } catch (error) {
      // can add a handler as required
    }
  }

  const handleRemovePlace = useCallback(async function handleRemovePlace() {
    setUserPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current.id)
    );
    try {
      await SaveUserPlaces(
        userPlaces.filter((place) => place.id !== selectedPlace.current.id)
      );
    } catch (error) {
      // can add a handler as required
    }
    setModalIsOpen(false);
  }, []);

  return (
    <>
      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        {userSelectedPlaces}
        <AvailablePlaces onSelectPlace={handleSelectPlace} />
      </main>
    </>
  );
}

export default App;
