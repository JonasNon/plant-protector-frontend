import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as cookie from "cookie";
import PlantData from "../plant_data.json";
import plantBackground from "../images/plant-background.png";
import "./Home.css";

const Home = () => {
  const [ownedPlants, setOwnedPlants] = useState([]);
  const [matchedPlants, setMatchedPlants] = useState([]);
  const [feedbackMessage, setFeedbackMessage] = useState(''); // For feedback messages

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
      const response = await axios.get(`https://plant-protector-backend.vercel.app/api/users/${userId}/ownedPlants`);
      if (response.data && response.data.ownedPlants) {
        setOwnedPlants(response.data.ownedPlants);
      } else {
        setOwnedPlants([]);
      }
    } catch (error) {
      console.log("Error fetching owned plants:", error);
    }
  };

  // New deletePlant function to remove a plant entry from the user's account
  const deletePlant = async (plantName) => {
    try {
      const userId = cookie.parse(document.cookie).userId;

      // Send request to delete plant from user's collection
      await axios.put(`https://plant-protector-backend.vercel.app/api/users/${userId}/removePlant`, { plantName });
      // setFeedbackMessage('Plant removed!');

      // Update the ownedPlants state to reflect the deletion
      setOwnedPlants(prevPlants => prevPlants.filter(plant => plant.name !== plantName));

      // Update matchedPlants to remove the deleted plant from the UI
      setMatchedPlants(prevPlants => prevPlants.filter(plant => !plant.scientific_name.includes(plantName)));

      // Clear feedback message after 2 seconds
      setTimeout(() => setFeedbackMessage(''), 2000);
    } catch (error) {
      console.log("Error removing plant:", error);
      setFeedbackMessage("An error occurred. Please try again.");
    }
  };

  const waterPlant = async (index) => {
    try {
      const userId = cookie.parse(document.cookie).userId;
      const currentDate = new Date().toLocaleString();

      await axios.put(`https://plant-protector-backend.vercel.app/api/users/${userId}/updatePlant`, {
        plantName: ownedPlants[index].name,
        lastWatered: currentDate
      });

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
    const daysSinceLastWatered = (currentDate - lastWateredDate) / (1000 * 60 * 60 * 24);

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

  const calculateNextWateringDate = (lastWatered, waterFreq) => {
    const lastWateredDate = new Date(lastWatered);
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
        intervalDays = 7;
    }
  
    const nextWateringDate = new Date(lastWateredDate);
    nextWateringDate.setDate(lastWateredDate.getDate() + intervalDays);
    return nextWateringDate;
  };

  function capitalizeWords(str) {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

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
      backgroundImage: `url(${plantBackground})`,
      backgroundRepeat: "repeat-y",
      backgroundSize: "cover"
    }}>
      {feedbackMessage && <div className="feedback">{feedbackMessage}</div>}
      <ul style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: "2rem",
        listStyle: "none",
        padding: "3rem",
        margin: "0",
        backgroundImage: `url(${plantBackground})`,
        backgroundRepeat: "repeat-y",
        backgroundSize: "cover",
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
            height: "100%",
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
              <h3 style={{ margin: "0.25rem 0", fontSize: "1rem", color: "#52796F" }}>{capitalizeWords(plant.common_name)}</h3>
              <p style={{ fontSize: "0.8rem", color: "#5E8A71", marginBottom: "0.5rem" }}>
                Scientific name: {plant.scientific_name.join(", ")} <br />
                Watering: {plant.watering} <br />
                Sunlight: {plant.sunlight.join(", ")}
              </p>
              <div style={{
                marginTop: "0.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.25rem"
              }}>
                <p style={{ fontSize: "0.8rem", color: "#5E8A71", margin: 0 }}>
                  Last watered: {new Date(ownedPlants[index].lastWatered).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' })}
                </p>
                <p style={{ fontSize: "0.8rem", color: "#5E8A71", paddingBottom: "5px", margin: 0 }}>
                  Next watering: {calculateNextWateringDate(ownedPlants[index].lastWatered, plant.watering).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' })}
                </p>
              </div>
            </div>
            <div style={{ display: "flex", width: "100%", gap: "0.5rem" }}>
              <button
                onClick={() => waterPlant(index)}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#52796F",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                  width: "70%"
                }}
              >
                Water Me!
              </button>
              <button
                onClick={() => deletePlant(plant.scientific_name[0])} // Pass scientific name to delete
                style={{
                  padding: "0.5rem",
                  backgroundColor: "#C0392B",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                  width: "30%"
                }}
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
