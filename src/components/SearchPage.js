import React, { useState, useEffect } from 'react';
import PlantData from "../plant_data.json";
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import * as cookie from "cookie";
import axios from 'axios';
import { Box, Button } from '@mui/material';

const SearchPage = (props) => {
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [ownedPlants, setOwnedPlants] = useState([]); // State to track owned plants
  const [feedbackMessage, setFeedbackMessage] = useState('');

  // Fetch user's owned plants on component mount
  useEffect(() => {
    const fetchOwnedPlants = async () => {
      const userId = cookie.parse(document.cookie).userId;
      const response = await axios.get(`https://plant-protector-backend.vercel.app/api/users/${userId}/ownedPlants`);
      setOwnedPlants(response.data.ownedPlants || []);
    };

    fetchOwnedPlants();
  }, []);

  // Check if the plant is owned by the user
  const isPlantOwned = (plantName) => {
    console.log(ownedPlants.some(plant => plant.name === plantName[0]), " and ", plantName)
    return ownedPlants.some(plant => plant.name === plantName[0]);
  };

  const handleTogglePlant = async (plantName) => {
    const userId = cookie.parse(document.cookie).userId;
    
    try {
      if (isPlantOwned(plantName)) {
        // Remove plant from user's collection
        await axios.put(`https://plant-protector-backend.vercel.app/api/users/${userId}/removePlant`, { plantName });
        setFeedbackMessage('Plant removed!');
      } else {
        // Add plant to user's collection
        await axios.put(`https://plant-protector-backend.vercel.app/api/users/${userId}/addPlant`, { plantName });
        setFeedbackMessage('Plant added!');
      }
  
      // Refetch owned plants to ensure the UI reflects the updated state
      const response = await axios.get(`https://plant-protector-backend.vercel.app/api/users/${userId}/ownedPlants`);
      setOwnedPlants(response.data.ownedPlants || []);
    } catch (error) {
      console.error("Error updating plant list:", error);
      setFeedbackMessage("An error occurred. Please try again.");
    }
  
    // Clear feedback message after 2 seconds
    setTimeout(() => setFeedbackMessage(''), 2000);
  };
  

  const handleOpenModal = (plant) => {
    setSelectedPlant(plant);
  };

  const handleCloseModal = () => {
    setSelectedPlant(null);
    setFeedbackMessage(''); // Clear feedback message on close
  };

  function capitalizeWords(str) {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  return (
    <div style={{ 
      backgroundColor: "#D9EBD3", 
      minHeight: "100vh", 
      display: "flex", 
      justifyContent: "center", 
      padding: "20px" 
    }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", // Uses auto-fill to make columns wrap more tightly
        gridTemplateRows: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: "20px",
        width: "100%", 
      }}>
        {PlantData.filter((plant) => (
          (plant.common_name && plant.common_name.toLowerCase().includes(props.search)) ||
          (plant.scientific_name && plant.scientific_name.some((name) => name.toLowerCase().includes(props.search))) ||
          (plant.other_name && plant.other_name.some((name) => name.toLowerCase().includes(props.search)))
        )).map((plant, index) => (
          <div 
            key={index} 
            onClick={() => handleOpenModal(plant)} 
            style={{
              backgroundColor: "#F0F7EE",
              padding: "15px",
              borderRadius: "8px",
              cursor: "pointer",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              maxHeight: "30vh"
            }}
          >
            {plant.default_image?.medium_url ? (
              <img 
                src={plant.default_image.medium_url} 
                alt={plant.common_name} 
                style={{ width: "100%", height: "120px", objectFit: "cover", borderRadius: "8px", marginBottom: "8px" }}
              />
            ) : (
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg" 
                alt="No image available" 
                style={{ width: "100%", height: "120px", objectFit: "cover", borderRadius: "8px", marginBottom: "8px" }}
              />
            )}
            <Typography variant="h6" style={{ fontWeight: 'bold', fontSize: "1rem" }}>
              {capitalizeWords(plant.common_name) || capitalizeWords(plant.scientific_name[0])}
            </Typography>
          </div>
        ))}
      </div>
  
      {/* Modal for displaying full plant information */}
      <Modal
        open={!!selectedPlant}
        onClose={handleCloseModal}
        aria-labelledby="plant-modal-title"
        aria-describedby="plant-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80vw',
          maxWidth: '600px',
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
          borderRadius: "8px",
          textAlign: "center"
        }}>
          {selectedPlant && (
            <>
              {selectedPlant.default_image?.medium_url ? (
                <img 
                  src={selectedPlant.default_image.medium_url} 
                  alt={selectedPlant.common_name} 
                  style={{ width: "100%", height: "250px", objectFit: "cover", borderRadius: "8px", marginBottom: "20px" }}
                />
              ) : (
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg" 
                  alt="No image available" 
                  style={{ width: "100%", height: "250px", objectFit: "cover", borderRadius: "8px", marginBottom: "20px" }}
                />
              )}
  
              <Typography id="plant-modal-title" variant="h6" component="h2" style={{ marginBottom: "20px" }}>
                {capitalizeWords(selectedPlant.common_name) || capitalizeWords(selectedPlant.scientific_name)}
              </Typography>
  
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '5px 0' }}>
                  <Box sx={{ width: '40%', textAlign: 'left', fontWeight: 'bold' }}>Scientific Name:</Box>
                  <Box sx={{ width: '60%', textAlign: 'left' }}>{selectedPlant.scientific_name.join(', ')}</Box>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '5px 0' }}>
                  <Box sx={{ width: '40%', textAlign: 'left', fontWeight: 'bold' }}>Other Names:</Box>
                  <Box sx={{ width: '60%', textAlign: 'left' }}>{selectedPlant.other_name.join(', ')}</Box>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '5px 0' }}>
                  <Box sx={{ width: '40%', textAlign: 'left', fontWeight: 'bold' }}>Life Cycle:</Box>
                  <Box sx={{ width: '60%', textAlign: 'left' }}>{selectedPlant.cycle}</Box>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '5px 0' }}>
                  <Box sx={{ width: '40%', textAlign: 'left', fontWeight: 'bold' }}>Watering Frequency:</Box>
                  <Box sx={{ width: '60%', textAlign: 'left' }}>{selectedPlant.watering}</Box>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '5px 0' }}>
                  <Box sx={{ width: '40%', textAlign: 'left', fontWeight: 'bold' }}>Sunlight Preference:</Box>
                  <Box sx={{ width: '60%', textAlign: 'left' }}>{selectedPlant.sunlight.join(', ')}</Box>
                </div>
              </div>
  
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                {feedbackMessage ? (
                  <Typography variant="body2" color={isPlantOwned(selectedPlant.scientific_name) ? "green" : "red"}>
                    {feedbackMessage}
                  </Typography>
                ) : (
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => handleTogglePlant(selectedPlant.scientific_name)} 
                  >
                    {isPlantOwned(selectedPlant.scientific_name) ? "Remove Plant" : "Add Plant"}
                  </Button>
                )}
              </div>
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
  
  
  
};

export default SearchPage;
