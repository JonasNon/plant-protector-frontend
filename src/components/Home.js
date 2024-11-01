import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as cookie from "cookie";
import PlantData from "../plant_data.json";
import vineBackground from "../images/vine-background.png";
import "./Home.css";

const Home = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [ownedPlants, setOwnedPlants] = useState([]);
  const [matchedPlants, setMatchedPlants] = useState([]);

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
      const response = await axios.get(`http://localhost:3036/users/${userId}/ownedPlants`);
      if (response.data && response.data.ownedPlants) {
        setOwnedPlants(response.data.ownedPlants);
      } else {
        setOwnedPlants([]);
      }
    } catch (error) {
      console.log("Error fetching owned plants:", error);
    }
  };

  const waterPlant = async (index) => {
    try {
      const userId = cookie.parse(document.cookie).userId;
      const currentDate = new Date().toLocaleString(); // Get the current date and time

      // Update the plant's lastWatered date in the database
      await axios.put(`http://localhost:3036/users/${userId}/updatePlant`, {
        plantName: ownedPlants[index].name,
        lastWatered: currentDate
      });

      // Update the local state to reflect the change without reloading
      setOwnedPlants(prevPlants => {
        const updatedPlants = [...prevPlants];
        updatedPlants[index] = { ...updatedPlants[index], lastWatered: currentDate };
        return updatedPlants;
      });
    } catch (error) {
      console.log("Error updating last watered date:", error);
    }
  };

  const checkWaterLevel = (lastWatered, waterFreq) => {
    const lastWateredDate = new Date(lastWatered);
    const currentDate = new Date();
    const timeDiff = currentDate - lastWateredDate;
    const daysSinceLastWatered = timeDiff / (1000 * 60 * 60 * 24);

    let intervalDays;
    switch (waterFreq) {
      case "Minimum":
        intervalDays = 14;
        break;
      case "Average":
        intervalDays = 7;
        break;
      case "Frequent":
        intervalDays = 3;
        break;
      default:
        return 0;
    }

    const waterLevel = 100 - ((daysSinceLastWatered / intervalDays) * 100);
    return Math.min(Math.max(Math.round(waterLevel), 0), 100);
  };

  const filterOwnedPlants = () => {
    const matched = PlantData.filter(plant => 
      ownedPlants.some(plantObj => plant.scientific_name.includes(plantObj.name))
    );
    setMatchedPlants(matched);
  };

  return (
    <div className="card-container" style={{
      height: "100vh",
      width: "100vw",
      backgroundImage: vineBackground,
      backgroundRepeat: "repeat-y",
      backgroundSize: "cover",
    }}>
      <ul style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: "2rem",
        listStyle: "none",
        padding: "3rem",
        margin: "0",
        backgroundColor: "#CDDEC7"
      }}>
        {matchedPlants.map((plant, index) => (
          <li key={index} className="plant-card water-level-fill" style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
            border: "1px solid #A3B9A2",
            padding: "0.5rem",
            textAlign: "center",
            height: "400px",
            '--split-percent': `${checkWaterLevel(ownedPlants[index].lastWatered, plant.watering)}%`
          }}>
            <img
              src={plant.default_image?.small_url}
              alt={plant.common_name}
              style={{ width: "100%", borderRadius: "8px 8px 0 0", objectFit: "cover", height: "160px" }}
            />
            <div style={{
              flex: "1",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              margin: "0.5rem",
              backgroundColor: "#F0F7EE",
              borderRadius: "8px",
              width: "100%",
            }}>
              <h3 style={{ margin: "0.25rem 0", fontSize: "1rem", color: "#52796F" }}>{plant.common_name}</h3>
              <p style={{ fontSize: "0.8rem", color: "#5E8A71", marginBottom: "0.5rem" }}>
                Scientific name: {plant.scientific_name.join(", ")} <br />
                Watering: {plant.watering} <br />
                Sunlight: {plant.sunlight.join(", ")}
              </p>
              <p style={{ fontSize: "0.8rem", color: "#5E8A71", marginBottom: "0.5rem" }}>
                Last watered: {
                  new Date(ownedPlants[index].lastWatered).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' })
                  + ' | ' +
                  new Date(ownedPlants[index].lastWatered).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).replace(' ', '')
                }
              </p>
            </div>
            <button
              onClick={() => waterPlant(index)}
              style={{
                marginTop: "0.5rem",
                padding: "0.5rem 1rem",
                backgroundColor: "#52796F",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "0.8rem",
                width: "100%",
              }}
            >
              Water Me!
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;