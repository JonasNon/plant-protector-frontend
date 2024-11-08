import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';

const SearchBar = (props) => {
  const navigate = useNavigate();
  const [searchLocal, setSearchLocal] = useState('');

  // Helper function to detect if it's a mobile device
  const isMobile = () => /Mobi|Android/i.test(navigator.userAgent);

  // Search handler function
  const handleSearch = () => {
    if (searchLocal.trim() !== '') {
      props.saveSearch(searchLocal);
      navigate('/search');
    }
  };

  // Event handler for input changes
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchLocal(value);

    // Automatically search on every keystroke for mobile
    if (isMobile() && value.trim() !== '') {
      props.saveSearch(value);
    }
  };

  // Event handler for Enter key on desktop
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="card-container">
      <TextField
        id="outlined-basic"
        label="Search"
        variant="outlined"
        style={{ width: "80vw" }}
        value={searchLocal}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default SearchBar;
