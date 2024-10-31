import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as cookie from "cookie"
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import backgroundImage from '../images/pastel-green-background.png';

console.log(cookie.parse(document.cookie));

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}



const Login = (props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [usernames, setUsernames] = useState([]); // State to store the fetched usernames
  const [value, setValue] = React.useState(0);

  const navigate = useNavigate();


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:3036/users', { username, password, tryRegister: true });
  
      if (response.data.success) {
        setMessage('User created successfully');
        fetchUsernames();  // Refresh the usernames list after registration
        console.log(username);
  
        // Set cookies for user session
        document.cookie = cookie.serialize("loggedIn", "true", { maxAge: 1000 * 60 });
        document.cookie = cookie.serialize("username", username, { maxAge: 1000 * 60 });
  
        // Set userId cookie if returned in the response
        if (response.data.userId) {
          document.cookie = cookie.serialize("userId", response.data.userId, { maxAge: 1000 * 60 });
        }
  
        navigate("/");
      }
    } catch (error) {
      if (error.response && error.response.data.error) {
        setMessage(error.response.data.error);
      } else {
        setMessage('An error occurred while creating the user');
      }
    }
  };
  
  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:3036/users', { username, password, tryRegister: false });
  
      if (response.data.success) {
        setMessage('User logged in');
        fetchUsernames();  // Refresh the usernames list if needed
        console.log(username);
  
        // Set cookies for user session
        document.cookie = cookie.serialize("loggedIn", "true", { maxAge: 1000 * 60 });
        document.cookie = cookie.serialize("username", username, { maxAge: 1000 * 60 });
  
        // Set userId cookie if returned in the response
        if (response.data.userId) {
          document.cookie = cookie.serialize("userId", response.data.userId, { maxAge: 1000 * 60 });
        }
  
        navigate("/");
      }
    } catch (error) {
      if (error.response && error.response.data.error) {
        setMessage(error.response.data.error);
        console.log(error);
      } else {
        setMessage('An error occurred while fetching the user');
      }
    }
  };

  // Function to fetch all usernames from the server
  const fetchUsernames = async () => {
    try {
      
      const response = await axios.get('http://localhost:3036/users');
      console.log(response.data)
      setUsernames(response.data); // Store usernames in the state
    } catch (error) {
      console.error('Error fetching usernames:', error);
    }
  };

  // Fetch usernames when the component mounts
  useEffect(() => {
    fetchUsernames();
  }, []);

  return (
    <div className="card-container" style={{ height: "100vh", width: "100vw", backgroundImage: "url('../images/pastel-green-background.png')", backgroundSize: "cover", backgroundPosition: "center", justifyContent: "center", alignItems: "center", display: "flex", flexDirection: "column" }}>
      <img src={backgroundImage} style={{position: 'absolute', width: "100vw", height: "100vh", zIndex: -10}}></img>
      {/* <button onClick={() => { document.cookie = cookie.serialize("loggedIn", null, { maxAge: 0 }); }}>test</button> */}
      {/* <div>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
        {message && <p>{message}</p>}
      </div> */}

      {/* Display the list of usernames */}

      <Box sx={{ borderBottom: 0, borderColor: 'divider', display: "flex", justifyContent: "center" }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Login" {...a11yProps(0)} style={{display: "flex", flexDirection: "column"}}  />
          <Tab label="Register" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0} style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
        <div id='login-tab' style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "25vw"}}>
          <TextField id="outlined-basic" label="Username" variant="outlined" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}/>
          <TextField id="outlined-basic" label="Password" variant="outlined" 
          style={{margin: "2vh"}}
          value={password}
          onChange={(e) => setPassword(e.target.value)}/>
          <Button variant="outlined" onClick={handleLogin}>Login</Button>
        </div>


      </CustomTabPanel>
      <CustomTabPanel value={value} index={1} style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
        <div id='register-tab' style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "25vw"}}>
          <TextField id="outlined-basic" label="Username" variant="outlined" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}/>
          <TextField id="outlined-basic" label="Password" variant="outlined" 
          style={{margin: "2vh"}}
          value={password}
          onChange={(e) => setPassword(e.target.value)}/>
          {message && <p>{message}</p>}
          <Button variant="outlined" onClick={handleRegister}>Register</Button>
        </div>
      </CustomTabPanel>

      
    </div>
  );
}

export default Login;