import React, { useState } from 'react';
import PlantData from "../plant_data.json";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import * as cookie from "cookie";
import axios from 'axios';




const SearchPage = (props) => {
  const [username, setUsername] = useState('');
  console.log("searchPage, search: ", props.search);

  // Filter plants based on search term
  const filteredPlants = PlantData.filter((plant) => {
    return (
      (plant.common_name && plant.common_name.toLowerCase().includes(props.search)) ||
      (plant.scientific_name && plant.scientific_name.some((name) => name.toLowerCase().includes(props.search))) ||
      (plant.other_name && plant.other_name.some((name) => name.toLowerCase().includes(props.search)))
    );
  });

  const [expanded, setExpanded] = useState('panel1');

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };


  const addPlant = async (e, plantName) => {
    try {
      const userId = cookie.parse(document.cookie).userId
      console.log("User ID from cookie:", userId);
      // Make a PUT request to add the plant to the user's `owned_plants` list
      console.log(`Request URL: http://localhost:3036/users/${userId}/addPlant`)
      const response = await axios.put(`http://localhost:3036/users/${userId}/addPlant`, { plantName });
      console.log(response)

    } catch (error) {
      console.log(error)
    }
  };

  

  return (
    <div style={{ backgroundColor: "#D9EBD3", height: "100vh", width: "100vw" }}>
      <div>
        {filteredPlants.map((plant, index) => (
          <Accordion
            style={{ backgroundColor: "#D9EBD3" }}
            key={index}
            expanded={expanded === `panel${index}`}
            onChange={handleChange(`panel${index}`)}
          >
            <AccordionSummary
              expandIcon={<ArrowDownwardIcon />}
              aria-controls={`panel${index}-content`}
              id={`panel${index}-header`}
            >
              <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                {/* Display Image */}
                {plant.default_image?.medium_url ? (
                  <img
                    src={plant.default_image.medium_url}
                    alt={plant.common_name}
                    style={{ width: '150px', height: '150px', borderRadius: '8px', marginRight: '15px' }}
                  />
                ) : (
                  // <Typography>No image available</Typography>
                  <img
                    src={"https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"}
                    alt={plant.common_name}
                    style={{ width: '150px', height: '150px', borderRadius: '8px', marginRight: '15px' }}
                  />
                  // https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg
                )}
                
                {/* Plant Name */}
                <Typography style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                  {plant.scientific_name.join(', ')}
                </Typography>
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <p>Common Name: {plant.common_name}</p>
              <p>Scientific Name: {plant.scientific_name.join(', ')}</p>
              <p>Other Names: {plant.other_name.join(', ')}</p>
              <p>Life Cycle: {plant.cycle}</p>
              <p>Watering Frequency: {plant.watering}</p>
              <p>Sunlight Preference: {plant.sunlight.join(', ')}</p>
              
              {/* Log Data Button */}
              <button onClick={() => addPlant(null, plant.scientific_name)}>Add Plant</button>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </div>
  );
}

export default SearchPage;