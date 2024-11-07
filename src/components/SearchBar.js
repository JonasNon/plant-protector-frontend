import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as cookie from "cookie"
import TextField from '@mui/material/TextField';
import PlantData from "../plant_data.json"

// require('dotenv').config();
const apiKey = process.env.REACT_APP_API_KEY;



const SearchBar = (props) => {
  const navigate = useNavigate();

  const [searchLocal, setSearchLocal] = useState('');
  const [results, setResults] = useState('')


  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    } else{
      return
    }
  }


  const handleSearch = () => {
    console.log(searchLocal)
    // props.saveSearch(search)
    console.log(props)
    props.saveSearch(searchLocal)
    // props.setSearch(searchLocal)
    console.log(props.search)
    navigate('/search')
  }





  return (
    <div className="card-container">
      <TextField id="outlined-basic" label="Search" variant="outlined" 
        style={{width: "80vw"}}
          value={searchLocal}
          onChange={(e) => setSearchLocal(e.target.value)}
          onKeyDown={handleKeyDown}/>
    </div>
  );
}

export default SearchBar;