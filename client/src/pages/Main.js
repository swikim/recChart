import React, {useEffect, useState} from 'react';
import { Card, Title,Button ,DateRangePicker } from "@tremor/react";
import axios from 'axios';
import { ko } from 'date-fns/locale';
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import "./Main.css";
import LastestP from './components/LastestP'
import LastestSMP from './components/LastestSMP';



function Main(){

    const apiKey = process.env.REACT_APP_API_Key;

    let [landPrice, setLandPrice] = useState([
      {
        "날짜":"",
        "최고가":"",
        "최저가":"",
        "매도물량":"",
        "체결물량":"",
        "평균가":"",
      }
    ])
    const [landPrice_get, setLandPrice_get] = useState([
      {
        "날짜":"",
        "최고가":"",
        "최저가":"",
        "매도물량":"",
        "체결물량":"",
        "평균가":"",
      }
    ])
    let landPrice2 = [];

    // Datepicker
    const [dateValue, setDateValue] = useState({
      from : new Date(2024,0,1),
      to : new Date(),
    })

    const dateFormat = (date) => {
      try {
        let formattedDate = format(date, "yyyyMMdd");
        return formattedDate;
      } catch (error) {
        console.error("Error formatting date:", error);
        return null;
      }
    };
    
    let dateUrl;
    dateUrl = String(dateFormat(dateValue.from))
  
   
   

    const openApiUrl = `https://apis.data.go.kr/B552115/RecMarketInfo2/getRecMarketInfo2?serviceKey=${apiKey}&pageNo=1&numOfRows=30&dataType=json&bzDd=${dateUrl}`;


    
    
    //종가 가져오기
   
    const get_landData = async (url) => {
      try {
        const response = await axios.get(url);
        const data = response.data;
        const newdate = data.response.body.items.item[0].bzDd;
        const newlandHgPrc = data.response.body.items.item[0].landHgPrc;
        const newlandLwPrc = data.response.body.items.item[0].landLwPrc;
        const newLandOrdRecValue = data.response.body.items.item[0].landOrdRecValue;
        const newlandTrdRecValue = data.response.body.items.item[0].landTrdRecValue;
        const newlandAvgPrc = data.response.body.items.item[0].landAvgPrc;
        setLandPrice([
          {
            "날짜": newdate,
            "최고가": newlandHgPrc,
            "최저가": newlandLwPrc,
            "매도물량": newLandOrdRecValue,
            "체결물량": newlandTrdRecValue,
            "평균가": newlandAvgPrc,
          }
        ]);
  
        landPrice2 = [
          {
            "날짜": newdate,
            "최고가": newlandHgPrc,
            "최저가": newlandLwPrc,
            "매도물량": newLandOrdRecValue,
            "체결물량": newlandTrdRecValue,
            "평균가": newlandAvgPrc,
          }
        ];
      } catch (err) {
        console.error("error get_landData", err);
      }
    };
   
  
  
    const handleSaveDateland = async (count) => {
      
      try {
        await axios.post("/api/saveData2", { data: landPrice2[0] });
      } catch (err) {
        console.error('error saving data 2', err);
      }
    };
    

    const getDB_Land=async(currentDate)=>{
      try{
        const response = await axios.get(`/check_land?data=${dateFormat(currentDate)}`);
        const data_db_land = response.data.data;
        return data_db_land;
      }catch(err){
        console.error("getDB_land err",err);
      }

    }
    
    const lastestdate=(date)=>{
      const daysOfWeek = [2, 4]; // 0: 일요일, 1: 월요일, 2: 화요일, ..., 6: 토요일
      const targetDays = daysOfWeek.filter(day => day <= date.getDay()); // 현재 요일 이전의 화요일, 목요일

      if (targetDays.length === 0) {
        // 현재 요일 이전의 화요일, 목요일이 없으면 지난 주의 마지막 목요일을 찾음
        const daysUntilLastThursday = date.getDay() - 4;
        return new Date(date.getTime() + daysUntilLastThursday * 24 * 60 * 60 * 1000);
      }

      // 현재 요일 이전의 화요일, 목요일 중 가장 가까운 것을 찾음
      const daysUntilLastTargetDay = date.getDay() - targetDays[targetDays.length - 1];
      return new Date(date.getTime() - daysUntilLastTargetDay * 24 * 60 * 60 * 1000);
    }
    

  const test = async () => {
      const startDate = new Date(dateValue.from);
      const endDate = new Date(dateValue.to);

      const currentDate = new Date(startDate);
      let count = 0;
      while (currentDate <= endDate) {
        if (currentDate.getDay() == 2 || currentDate.getDay() == 4) {
          let result_db;
          count++;
          try {
            // getDB_Land 함수 비동기 호출
            result_db = await getDB_Land(currentDate);
            
            if (result_db == null) {
              const date_ApiUrl = `https://apis.data.go.kr/B552115/RecMarketInfo2/getRecMarketInfo2?serviceKey=${apiKey}&pageNo=1&numOfRows=30&dataType=json&bzDd=${dateFormat(currentDate)}`;
              
              // 비동기 함수 호출 후 기다리기
              await get_landData(date_ApiUrl);
              // 비동기 함수 호출 후 기다리기
              await handleSaveDateland(count);

            } else {
              setLandPrice(result_db)
            }
          } catch (err) {
            console.error(err);
          }
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
}
      var today_endP= [];
      
      

      useEffect(() => {
      const fetchData = async () => {
        const startDate = dateFormat(dateValue.from);
        const endDate = dateFormat(dateValue.to);
        const today = new Date();
        const closestTT = lastestdate(today);
    
        try {
          const response = await axios.get('/search_land', {
            params: {
              startDate,
              endDate,
            },
          });
          setLandPrice_get(response.data.data);
        } catch (error) {
          console.error('Error fetching data', error);
        }
    
       
       
      };
    
      fetchData();
    
    }, [dateValue.from, dateValue.to, landPrice]); 
    
    

    

    
    

    
  return (
    <>
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '23vh' }}>
      <LastestP/>
      <LastestSMP/>
    </div>
      <DateRangePicker
        value={dateValue}
        onValueChange={setDateValue}
        locale={ko}
        color='rose'
        >

      </DateRangePicker>
      <Button onClick={test}> 확인</Button>
      <Card>
        <Title>육지 rec 가격</Title>
        <LineChart
         width={1000}
         height={500}
         data={landPrice_get}
         margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey={"날짜"}/>
          <YAxis yAxisId="left" type='number' domain={[60000,90000]}/>
          <YAxis yAxisId="right" orientation="right" />
          <CartesianGrid strokeDasharray="3 3" />

          {/* Tooltip 설정 */}
          <Tooltip />

          {/* 범례 설정 */}
          <Legend />
          <Line type="linear" dataKey="최고가" stroke="#8884d8" yAxisId="left" />
          <Line type="linear" dataKey="최저가" stroke="#82ca9d" yAxisId="left" />
          <Line type="linear" dataKey="평균가" stroke="#8dd1e1" yAxisId="left" />
        </LineChart>
      </Card>
      <Card>
        <Title>육지 rec 물량차트</Title>
        <LineChart
        width={1000}
        height={500}
        data={landPrice_get}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <XAxis dataKey={"날짜"}/>
        <YAxis yAxisId="left" type='number' domain={[40000,210000]} />
        <YAxis yAxisId="right" orientation="right" />
        <CartesianGrid strokeDasharray="3 3" />

        {/* Tooltip 설정 */}
        <Tooltip />

        {/* 범례 설정 */}
        <Legend />
        <Line type="linear" dataKey="매도물량" stroke="#82ca9d" yAxisId="right" />
        <Line type="linear" dataKey="체결물량" stroke="#ffc658" yAxisId="left" />
        </LineChart>
      </Card>
    </>
  );
}

export default Main;