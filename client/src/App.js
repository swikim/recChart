import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Card, Metric, Text } from '@tremor/react';
import { HashRouter as BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './pages/Main';


function App() {
  

 

  

  async function getOpenApiData(url){
    try{
      const response = await axios.get(url);
      return response.data;
    }catch(error){
      console.error(`Error : ${error}`)
      return null;
    }
  }

  // const openApiUrl = "https://apis.data.go.kr/B552115/RecMarketInfo2/getRecMarketInfo2?serviceKey=yoDxAeXuxWRtQ%2BxEhRsJ0aFpqAVIInugpacEw9CJlopBLfc78UtjrXoR2KwMDtIrOtPL33SSz%2FdjDYI08s1%2Ffw%3D%3D&pageNo=1&numOfRows=30&dataType=json&bzDd=20211125"
  // const [endPrice, setEndPrice] = useState("");
  

  // getOpenApiData(openApiUrl)
  //   .then(data=>{
  //     console.log(data.response.body.items.item[0].clsPrc);
  //   })
   
  //   .catch(error=>{
  //     console.error(`Error : ${error}`);
  //   })
  
    
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Main />} ></Route>    
      </Routes>
      </BrowserRouter> 
      <div>
    </div>
    </div>
    
  );
}

export default App;
