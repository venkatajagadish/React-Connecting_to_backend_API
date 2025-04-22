export async function GetAvailablePlaces(){
    const response = await fetch("http://localhost:3000/places");
    if (!response.ok) {
      throw new Error("Failed to fetch places");
    }
    const resData = await response.json();
    return resData.places;
}

export async function SaveUserPlaces(places){
    const response = await fetch("http://localhost:3000/user-places",{
        method:"PUT",
        body: JSON.stringify({places:places}),
        headers:{
            "Content-Type": "application/json"
        }
    });
    if (!response.ok) {
        throw new Error("Failed to fetch places");
      }
      const resData = await response.json();
      return resData.message;
}