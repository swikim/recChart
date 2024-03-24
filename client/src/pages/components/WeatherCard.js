import React, { useEffect,useState } from "react";
import axios from "axios"
import { Card, Title ,Text,Flex} from "@tremor/react";
import { format } from 'date-fns';
import "../Main.css"
import Hr from './Hr.js';

function WeatherCard(){
    const apiKey = process.env.REACT_APP_API_Key

    const [resultTMX, setResultTMX] = useState(null);
    const [resultTMN, setResultTMN] = useState(null);
    const [skyState, setSkyState] = useState(null);
    const [currnetT, setCurrnetT] = useState(null);

    //지역코드
    const [region_Code, setregion_Code] = useState("경기")
    const [XAxis, setXAxis] = useState(63)
    const [YAxis, setYAxis] = useState(127)
    const handleDataTransfer=(data)=>{
      setregion_Code(data);
      switch(data){
        case'경기': 
        setXAxis(63)
        setYAxis(127)
        break;
        case'강원': 
        setYAxis(127)
        setXAxis(81);
        break;
        case'충북': 
        setXAxis(77)
        setYAxis(107)
        break;
        case'충남': 
        setXAxis(57)
        setYAxis(105)
        break;
        case'전북': 
        setXAxis(63)
        setYAxis(87)
        break;
        case'전남': 
        setXAxis(59)
        setYAxis(67)
        break;
        case'경북': 
        setXAxis(90)
        setYAxis(99)
        break;
        case'경남': 
        setXAxis(90)
        setYAxis(77)
        break;
        case'제주': 
        setXAxis(53)
        setYAxis(35)
        break;
      }
    }
    const dateFormat = (date)=>{
        try {
            let formattedDate = format(date, "yyyyMMdd");
            return formattedDate;
          } catch (error) {
            console.error("Error formatting date:", error);
            return null;
          }
    }
    const getToday_W=async(x,y,today)=>{
        let nowHour = today.getHours() + "00";
        if(today.getHours()<10){
            nowHour = "0" + today.getHours() + "00";
        }else if(today.getHours()===2){
            nowHour = "0300"
        }
        else{
            nowHour = today.getHours() + "00";
        }
        const weather_url = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${apiKey}&pageNo=1&numOfRows=1000&dataType=json&base_date=${dateFormat(today)}&base_time=0200&nx=${x}&ny=${y}`
        const response = await axios.get(weather_url);
        const data = response.data.response.body.items
        let compareTMX = -99;
        let compareTMN = 99;
        let temper;
        let SKY;
        for(let i=0;i<254;i++){
            const result = data.item[i].category

            if(result === 'TMX'){
                let TMX = Number(data.item[i].fcstValue);
                compareTMX =  Math.max(TMX,compareTMX)
               
            }
            if(result === 'TMN'){
                let TMN = Number(data.item[i].fcstValue);
                compareTMN = Math.min(TMN,compareTMN)
            }
            if(result==='TMP'){
                if(data.item[i].fcstTime === nowHour){
                    temper = data.item[i].fcstValue;
                }
            }
            if(result === 'SKY' && data.item[i].fcstTime === nowHour){
                if(data.item[i].fcstValue === '1'){
                    SKY = "맑음"
                    break;
                }
                else if(data.item[i].fcstValue==='3'){
                    SKY = '구름많음'
                    break;
                }
                else if(data.item[i].fcstValue==='4'){
                    if(data.item[i+1].fcstValue==='0'){
                        SKY = '흐림'
                        break;
                    }else if(data.item[i+1].fcstValue==='1'){
                        SKY = '비'
                        break;
                    }else if(data.item[i+1].fcstValue==='2'){
                        SKY = '비/눈'
                        break;
                    }else if(data.item[i+1].fcstValue==='3'){
                        SKY = '눈'
                        break;
                    }else if(data.item[i+1].fcstValue==='4'){
                        SKY = '소나기'
                        break;
                    }
                }
            
        }
        }
        setResultTMX(compareTMX);
        setResultTMN(compareTMN);
        setCurrnetT(temper);
        setSkyState(SKY);
    }
    const getToday_W_E= async(x,y,today)=>{
        const nowHour = today.getHours() + "00";
        const weather_url = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${apiKey}&pageNo=1&numOfRows=1000&dataType=json&base_date=${dateFormat(today)}&base_time=0200&nx=${x}&ny=${y}`
        const response = await axios.get(weather_url);
        const data = response.data.response.body.items
        let compareTMX = -99;
        let compareTMN = 99;
        let temper;
        let SKY;
        for(let i=245;i<534;i++){
            const result = data.item[i].category

            if(result === 'TMX'){
                let TMX = Number(data.item[i].fcstValue);
                compareTMX =  Math.max(TMX,compareTMX)
               
            }
            if(result === 'TMN'){
                let TMN = Number(data.item[i].fcstValue);
                compareTMN = Math.min(TMN,compareTMN)
            }
            if(result==='TMP' &&data.item[i].fcstTime === nowHour){
                temper = data.item[i].fcstValue;
            }
            if(result === 'SKY' && data.item[i].fcstTime === nowHour){
                if(data.item[i].fcstValue === '1'){
                    SKY = "맑음"
                    break;
                }
                else if(data.item[i].fcstValue==='3'){
                    SKY = '구름많음'
                    break;
                }
                else if(data.item[i].fcstValue==='4'){
                    if(data.item[i+1].fcstValue==='0'){
                        SKY = '흐림'
                        break;
                    }else if(data.item[i+1].fcstValue==='1'){
                        SKY = '비'
                        break;
                    }else if(data.item[i+1].fcstValue==='2'){
                        SKY = '비/눈'
                        break;
                    }else if(data.item[i+1].fcstValue==='3'){
                        SKY = '눈'
                        break;
                    }else if(data.item[i+1].fcstValue==='4'){
                        SKY = '소나기'
                        break;
                    }
            }
        }
        }
      
        setResultTMX(compareTMX);
        setResultTMN(compareTMN);
        setCurrnetT(temper);
        setSkyState(SKY);
    }
    useEffect(()=>{
        const today = new Date();
        const currentHour = today.getHours();
        if(currentHour < 2){
             const needDate = new Date()
             needDate.setDate(needDate.getDate()-1)
            getToday_W_E(XAxis,YAxis,needDate)
        }
        else{
            getToday_W(XAxis,YAxis,today);

        }
    },[region_Code])
    return(
        <>
        <Flex>
            <Hr onRegionChange={handleDataTransfer}/>
        <Card style={{position:'absolute',
        top:'5px',
        right:'10px',
        width:'auto',
        }}>
        <Title>{region_Code}</Title>
                        {currnetT?(
                            <Text>{`${currnetT}`}°C</Text>
                        ):(
                            <p>Loading...</p>
                        )}
                        {skyState?(
                            <Text>{`${skyState}`}</Text>
                        ):(
                            <p>Loading...</p>
                        )}
                        <Flex>
                        {resultTMX!==null?(
                            <Text>최고기온:{`${resultTMX}`}</Text>
                        ):(
                            <p>Loading...</p>
                        )}
                        {resultTMN !== null ? (
                            <Text>최고기온:{`${resultTMN}`}</Text>
                            ) : (
                            <p>Loading...</p>
                            )}
                        </Flex>            
        </Card>
        </Flex>
        </>
    )
}

export default WeatherCard;