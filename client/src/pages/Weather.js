import React, {useEffect, useState} from 'react';
import axios from "axios";
import { Card, Title ,Text,Button ,Flex,
    DateRangePicker ,DatePickerValue, DateRangePickerValue,DatePicker,DateRangePickerItem} from "@tremor/react";
import { Tab,TabGroup,TabList,TabPanels,TabPanel } from '@tremor/react';
import { ko } from 'date-fns/locale';
import { differenceInDays,format } from 'date-fns';
import "./Main.css";

function Weather(){

    //dateValue
    const [d_Value, setD_Value] = useState({
        start : new Date(),
    })
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

    const [weatherData, setWeatherData] = useState([
        {
            "날짜" : "",
            "지점" : "",
            "날씨": "",
        }
    ]);
    // const [ssHrData, setSsHrData] = useState([
    //     {
    //         "날짜" : "",
    //         "지점" : "",
    //         "일조량": "",
    //     }
    // ]);
    let ssHrData = [];
    const [avgTaData, setAvgTaData] = useState([
        {
            "날짜" : "",
            "지점" : "",
            "기온": "",
        }
    ]);
    


    const apiKey = process.env.REACT_APP_API_Key
    //날의 차
    const dateSubtract=()=>{
        const startDate = dateValue.from;
        const endDate = dateValue.to;

        const dayDifference = differenceInDays(endDate,startDate)
        
        return dayDifference
    }

    const [avgHr, setAvgHr] = useState('');

    const get_Weather = async(url)=>{
        const response = await axios.get(url);
        const data = response.data.response.body;
        const dayDifference = dateSubtract()
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
        console.log(sumHr/dayDifference);
        setAvgHr(sumHr/dayDifference);
    }

    var compareTMX = -99;
    var compareTMN = 99;

    const [resultTMX, setResultTMX] = useState(null);
    const [resultTMN, setResultTMN] = useState(null);
    const getToday_W=async()=>{
        const today = new Date()
        const response = await axios.get(`https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${apiKey}&pageNo=1&numOfRows=1000&dataType=json&base_date=${dateFormat(today)}&base_time=0500&nx=55&ny=127`);
        const data = response.data.response.body.items
        var i;
        
        var SKY;
        for(i=0;i<809;i++){
            const result = data.item[i].category
            if(result == 'TMX'){
                let TMX = Number(data.item[i].fcstValue);
                compareTMX = (TMX>compareTMX)?TMX:compareTMX;
               // console.log(TMX,compareTMX) //최고 기온 compareTMX
            }
            if(result == 'TMN'){
                let TMN = Number(data.item[i].fcstValue);
                compareTMN = (TMN<compareTMN)?TMN:compareTMN;
            }
            
        }
        setResultTMX(compareTMX);
        setResultTMN(compareTMN);
        console.log(compareTMN,compareTMX)
    }
    useEffect(()=>{
        const startDate = dateFormat(dateValue.from);
        const currentDate = dateValue.to;
        const endDate = dateFormat(currentDate.setDate(currentDate.getDate()-1));
        const dayDifference = dateSubtract()

        const weatherUrl =`https://apis.data.go.kr/1360000/AsosDalyInfoService/getWthrDataList?serviceKey=${apiKey}&pageNo=1&numOfRows=${dayDifference}&dataType=json&dataCd=ASOS&dateCd=DAY&startDt=${startDate}&endDt=${endDate}&stnIds=112`

        get_Weather(weatherUrl);
        getToday_W();
        
    },[])

    //db저장
    const saveData_DB =()=>{

    }
    const testingButton=()=>{
        const startDate = dateFormat(dateValue.from);
        const endDate = dateFormat(dateValue.to);
        const dayDifference = dateSubtract()

        const weatherUrl =`https://apis.data.go.kr/1360000/AsosDalyInfoService/getWthrDataList?serviceKey=${apiKey}&pageNo=1&numOfRows=${dayDifference}&dataType=json&dataCd=ASOS&dateCd=DAY&startDt=${startDate}&endDt=${endDate}&stnIds=112`

        get_Weather(weatherUrl);
        
        console.log(avgHr)
    }
    const test_DV=()=>{
        console.log(apiKey);
    }
    return(
        <>
        <TabGroup>
            <TabList>
                <Tab>일</Tab>
                <Tab>월</Tab>
                <Tab>연</Tab>
            </TabList>
            <TabPanels>
                {/* 일 */}
                <TabPanel>
                 <Flex>
                    <div className='calender_box'>
                        <DatePicker
                        defaultValue={d_Value.start}
                        onValueChange={setD_Value}
                        locale={ko}/>
                    </div>
                    <Card className='weather_box'>
                        <Title>서울</Title>
                        {resultTMX?(
                            <Text>최고기온:{`${resultTMX}`}</Text>
                        ):(
                            <p>Loading...</p>
                        )}
                        {resultTMN?(
                            <Text>최저기운:{`${resultTMN}`}</Text>
                        ):(
                            <p>Loading...</p>
                        )}
                    </Card>
                 </Flex>
                 <Button onClick={test_DV}>d_Value</Button>
                </TabPanel>
                {/* 월 */}
                <TabPanel>
                    <DateRangePicker
                        value={dateValue}
                        onValueChange={setDateValue}
                        locale={ko}
                        selectPlaceholder='선택하세요'
                        >
                    </DateRangePicker>
                    
                        {avgHr?(
                            <div>
                                <Text>일조량 평균 : {`${avgHr}`}</Text>
                            </div>
                        ) : (
                            <p>Loading...</p>
                        )}
                        <Button onClick={getToday_W}>test</Button>
                </TabPanel>
                {/* 연 */}
                <TabPanel>
                    <Text>year</Text>
                </TabPanel>
            </TabPanels>
        </TabGroup>
        </>
    );
}

export default Weather;