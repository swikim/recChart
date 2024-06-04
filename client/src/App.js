import './App.css';
import React from 'react';
import {  BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './pages/Main';
import Weather from './pages/Weather';
import Calculator from './pages/Calculator';
import NavBar from './pages/components/NavBar';
import Sidebar from './pages/components/Sidebar';
import WeatherCard from './pages/components/WeatherCard';

function App() {
  return (
    <>
    <div className ='app'>
    <BrowserRouter>
    <NavBar/>
    <div className='container'>
      <Sidebar/>
      <div className='others'>
         <Routes>
            <Route path='/' element={<Main />} />
            <Route path='/calculator' element={<Calculator />} />
            <Route path='/weathercard' element={<WeatherCard/>}/>
            <Route path='/weather' element={<Weather />} />

        </Routes>
      </div>

    </div>
  </BrowserRouter>
    </div>
    </>
  );
}

export default App;
