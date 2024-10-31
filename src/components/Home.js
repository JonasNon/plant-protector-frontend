import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as cookie from "cookie"
import PlantData from "../plant_data.json"
console.log(PlantData)

console.log(cookie.parse(document.cookie));



const Home = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [usernames, setUsernames] = useState([]);
  const [ownedPlants, setOwnedPlants] = useState([]);
  const [matchedPlants, setMatchedPlants] = useState([]); // To store matched plant objects

  useEffect(() => {
    getOwnedPlants();
  }, []);

  useEffect(() => {
    if (ownedPlants.length > 0) {
      filterOwnedPlants();
    }
  }, [ownedPlants]);

  const getOwnedPlants = async () => {
    try {
      const userId = cookie.parse(document.cookie).userId;
      console.log("User ID from cookie:", userId);
  
      const response = await axios.get(`http://localhost:3036/users/${userId}/ownedPlants`);
      if (response.data && response.data.ownedPlants) {
        console.log("Owned plants:", response.data.ownedPlants);
        setOwnedPlants(response.data.ownedPlants);
      } else {
        setOwnedPlants([]);
      }
    } catch (error) {
      console.log("Error fetching owned plants:", error);
    }
  };

  // Function to filter PlantData based on ownedPlants scientific names
  const filterOwnedPlants = () => {
    const matched = PlantData.filter(plant => 
      ownedPlants.some(plantObj => plant.scientific_name.includes(plantObj.name))
    );
    setMatchedPlants(matched);
    console.log("Matched Plants:", matched);
  };

  return (
    <div className="card-container" style={{ height: "100vh", width: "100vw" }}>
      <h2>Owned Plants</h2>
      <ul>
        {matchedPlants.map((plant, index) => (
          <li key={index}>
            <h3>{plant.common_name}</h3>
            <p>Scientific Name: {plant.scientific_name.join(", ")}</p>
            <p>Watering: {plant.watering}</p>
            <p>Sunlight: {plant.sunlight.join(", ")}</p>
            <img src={plant.default_image?.small_url} alt={plant.common_name} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;