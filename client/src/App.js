import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Card, Metric, Text } from '@tremor/react';
import {  BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './pages/Main';
import Weather from './pages/Weather';
import Calculator from './pages/Calculator';
import NavBar from './pages/components/NavBar';
import Sidebar from './pages/components/Sidebar';

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

          <Route>
            <Route path='/' element={<Main />} />
            <Route path='/calculator' element={<Calculator />} />
            <Route path='/weather' element={<Weather />} />
          </Route>

        </Routes>
      </div>

    </div>
  </BrowserRouter>
    </div>
    </>
  );
}

export default App;
