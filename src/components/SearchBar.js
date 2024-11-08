import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import debounce from 'lodash.debounce';

const SearchBar = (props) => {
  const navigate = useNavigate();
  const [searchLocal, setSearchLocal] = useState('');

  // Helper function to detect if it's a mobile device
  const isMobile = () => /Mobi|Android/i.test(navigator.userAgent);

  // Debounced search function to limit frequency on mobile
  const debouncedSearch = debounce(() => {
    if (searchLocal.trim() !== '') {
      handleSearch();
    }
  }, 300);

  // Search handler function
  const handleSearch = () => {
    props.saveSearch(searchLocal);
    navigate('/search');
  };

  // Event handler for input changes (mainly for mobile)
  const handleInputChange = (e) => {
    setSearchLocal(e.target.value);
    if (isMobile()) {
      debouncedSearch();
    }
  };

  // Event handler for Enter key on desktop
  const handleKeyDown = (e) => {
    if (!isMobile() && e.key === 'Enter') {
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
