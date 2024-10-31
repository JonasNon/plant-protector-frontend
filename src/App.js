import React, { useEffect, useState } from 'react';
// import Navigation from './components/Navigation'
import './App.css'
import Router from './Router'
import { BrowserRouter, useLocation, useNavigate } from 'react-router-dom';
import { Provider } from 'react-redux'
import store from './redux/store'
import NavBar from './components/NavBar'
import * as cookie from "cookie"
import TextField from '@mui/material/TextField';


const checkAuth = () => {
  const cookies = cookie.parse(document.cookie);
  return cookies["loggedIn"] ? true : false;
};

function App() {
  // const location = useLocation();  // Track the current route
  const [isLoggedIn, setIsLoggedIn] = useState(checkAuth);
  const [search, setSearch] = useState('');
  // const navigate = useNavigate();


  useEffect(() => {
    const interval = setInterval(() => {
      setIsLoggedIn(checkAuth()); // Update the auth status periodically
    }, 100); // Check every .1 second (can adjust as needed) 

    ///this timer is garbage and i hate it but i haven't got anything else to work so... 

    return () => clearInterval(interval); // Clean up interval when component unmounts
  }, []); // Empty array ensures this only runs on mount

  // const handleSearch = (e) => {
  //   if (e.key != 'Enter') {
  //     return
  //   } 
  //   console.log(search)
  //   navigate('/search')
  // }


  return (
    <Provider store={store}>
      <BrowserRouter>
      {/* <NavBar /> */}
      {/* {isLoggedIn  ?
        <TextField id="outlined-basic" label="Search" variant="outlined" 
        style={{width: "90vw"}}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={handleSearch}/> :
        null
      } */}
      
        {isLoggedIn  ? <NavBar search={search} setSearch={setSearch}/> : null}
        <Router search={search}/>
      </BrowserRouter>
    </Provider>
  );
}

export default App;

