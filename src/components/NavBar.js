import React, { useState, useEffect } from 'react';
import * as cookie from "cookie"
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../containers/SearchBar';



console.log(cookie.parse(document.cookie));



const NavBar = (props) => {
  const [searchLocal, setSearchLocal] = useState('');
  const username = cookie.parse(document.cookie).username;
  const firstLetter = username ? username.charAt(0).toUpperCase() : "";
  
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMyAccount = () => {
    setAnchorEl(null);
    navigate("/"); // Redirects to the home page
  };

  const handleLogout = () => {
    setAnchorEl(null);
    document.cookie = cookie.serialize("loggedIn", null, { maxAge: 0 });
    document.cookie = cookie.serialize("username", null, { maxAge: 0 });
    document.cookie = cookie.serialize("userId", null, { maxAge: 0 });
    navigate("/login")
  }

  return (
    <div className="card-container" style={{ backgroundColor: "#C5DBC1", height: "10vh", width: "100vw", display: "flex", alignItems: "center", justifyContent: "center"}}>
      <SearchBar search={props.search} setSearch={props.setSearch}></SearchBar>
    
      <div style={{borderRadius: "50%", border: "3px solid black", height: "50px", width: "50px", margin: "1vh", backgroundColor: "#6D9860"}}
      onClick={() => {console.log("DROP")}}>
        <Button
          style={{position: "absolute", borderRadius: "50%", height: "50px", width: "50px", padding: "0", minWidth: "50px"}}
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          
        >
          <span style={{
            color: "white",
            fontSize: "1.2rem",
            fontWeight: "bold",
          }}>
            {firstLetter}
          </span>
        </Button>  
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        disableScrollLock={true}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem disabled>{username}</MenuItem>  
        <MenuItem onClick={handleMyAccount}>My account</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>

      </div>
      {/* <button onClick={() => { document.cookie = cookie.serialize("loggedIn", null, { maxAge: 0 }); }}>test</button> */}
    </div>
  );
}

export default NavBar;