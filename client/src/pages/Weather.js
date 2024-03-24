import React, {useEffect, useState} from 'react';
import axios from "axios";
// import { Card, Title ,Text,Button ,Flex,
//     DateRangePicker ,DatePickerValue, DateRangePickerValue,DatePicker,DateRangePickerItem} from "@tremor/react";
// import { Tab,TabGroup,TabList,TabPanels,TabPanel } from '@tremor/react';
// import { ko } from 'date-fns/locale';
import { differenceInDays,format } from 'date-fns';
import "./Main.css";
import WeatherCard from './components/WeatherCard';
// import Hr from './components/Hr';

function Weather(){

    
    //monthValue
    const [dateValue, setDateValue] = useState({
        from : new Date(2024,0,1),
        to : new Date(),
    })
    const dateFormat = (date)=>{
        try {
            let formattedDate = format(date, "yyyyMMdd");
            return formattedDate;
          } catch (error) {
            console.error("Error formatting date:", error);
            return null;
          }
    }

    
    // const [ssHrData, setSsHrData] = useState([
    //     {
    //         "날짜" : "",
    //         "지점" : "",
    //         "일조량": "",
    //     }
    // ]);
    let ssHrData = [];
   
    


    const apiKey = process.env.REACT_APP_API_Key
    //날의 차
    const dateSubtract=()=>{
        const startDate = dateValue.from;
        const endDate = dateValue.to;

        const dayDifference = differenceInDays(endDate,startDate)
        
        return dayDifference
    }

    const [avgHr, setAvgHr] = useState([]);

    const get_Weather = async(startDate,endDate,region_Code)=>{
       
        const dayDifference = dateSubtract()
        const url =`https://apis.data.go.kr/1360000/AsosDalyInfoService/getWthrDataList?serviceKey=${apiKey}&pageNo=1&numOfRows=${dayDifference}&dataType=json&dataCd=ASOS&dateCd=DAY&startDt=${startDate}&endDt=${endDate}&stnIds=${region_Code}`
        const response = await axios.get(url);
        const data = response.data.response.body;
        const weatherInfo = data.items.item[0].tm;
        var i;
        var sumHr=0;
        for( i = 0; i<dayDifference;i++){
            const weatherInfo_date = data.items.item[i].tm;
            const weatherInfo_avTa= data.items.item[i].avgTa;
            const weatherInfo_Hr = data.items.item[i].sumSsHr;
            const weatherInfo_iscs = data.items.item[i].iscs;
            const regionInfo =data.items.item[i].stnId;
            const weather_date=dateFormat(weatherInfo_date);
            ssHrData[i]= [
                {
                    "날짜": weather_date,
                    "지점":regionInfo,
                    "일조량":weatherInfo_Hr,
                }
            ]
            sumHr += Number(ssHrData[i][0].일조량);
        }
        const averageHr = (sumHr/dayDifference).toFixed(1)
        setAvgHr(prevArray => {
            // 중복 체크
            if (!prevArray.includes(averageHr)) {
              return [averageHr, ...prevArray];
            } else {
              return prevArray;
            }
          });
    }
    
    
    useEffect(()=>{
       
        
    },[])

  
    
    return(
        <>
        <div style={{position:'relative'}}>
            
                <WeatherCard/>
           
        </div>
        </>
    );
}

export default Weather;