import React from 'react'
import { Routes, Route } from 'react-router'
import Home from './containers/Home'
// import About from './components/About'


const Router = () => {
    return (
        <Routes>
            <Route exact path="/" element={<Home/>} />
            {/* <Route path="/about" element={<About/>} /> */}
        </Routes>
    );
};

export default Router;