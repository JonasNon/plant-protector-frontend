import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router'
import * as cookie from "cookie"
import Home from './containers/Home'
import Login from './components/Login'
import SearchPage from './containers/SearchPage'
import SearchBar from './containers/SearchBar'
import NavBar from './components/NavBar';

const checkAuth = () => {
    const cookies = cookie.parse(document.cookie);
    return cookies.loggedIn ? true : false;
};


const ProtectedRoute = ({component: Component, ...rest}) => {
    return (
        checkAuth() ?
        <Component {...rest} /> :
        <Navigate to='/login'/>
    )
}


const Router = (props) => {
    // const [search, setSearch] = useState('');
    return (
        <Routes>
            
            <Route path="/testtesttest" element={<SearchBar setSearch={props.setSearch}/>} />
            <Route path="/login" element={<Login/>} />
            <Route exact path="/" element={<ProtectedRoute component={Home} />} />
            <Route path="/search" element={<ProtectedRoute component={SearchPage} search={props.search}/>} />

            
        </Routes>
    );
};

export default Router;