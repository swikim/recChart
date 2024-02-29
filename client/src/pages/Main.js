import React, {useEffect, useState} from 'react';
import { Card,Flex, Title,Button ,DateRangePicker ,DatePickerValue, DateRangePickerValue, Metric} from "@tremor/react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ko } from 'date-fns/locale';
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import "./Main.css";
import LastestP from './components/LastestP'
import LastestSMP from './components/LastestSMP';
import App from '../App'



function Main(){
    const navigate = useNavigate();

    const apiKey = process.env.REACT_APP_API_Key;
    const [data, setData] = useState(null);

   
      
    // const handleButtonClick = () =>{
    //     navigate('/chart');
    // }
    

    
    //db에서 값 가져오기
    const [enddata_db, setEnd_DataDB] = useState([
      {
        "date":"",
        "price":0
      }
    ]);
    
    const [endPrice, setendPrice] = useState([
      {
        "date":0,
        "price":0
      }
    ])
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
  
   
    const checkButton = async()=>{
      console.log("from",dateFormat(dateValue.from),"to : ",dateFormat(dateValue.to) , "week :",dateValue.from.getDay())

      const startDate = new Date(dateValue.from);
      const endDate = new Date(dateValue.to);
      
      const currentDate = new Date(startDate)
      while(currentDate<=endDate){
        if(currentDate.getDay()==2||currentDate.getDay()==4){
          try {
            const response = await axios.get(`http://localhost:8080/check?data=${dateFormat(currentDate)}`);
            const data_db = response.data.data;
            console.log('check data', data_db);
            if(data_db!=null){
              console.log('have data',currentDate)
            }else if(data_db===null){
              const date_ApiUrl = `https://apis.data.go.kr/B552115/RecMarketInfo2/getRecMarketInfo2?serviceKey=${apiKey}&pageNo=1&numOfRows=30&dataType=json&bzDd=${dateFormat(currentDate)}`;
              console.log('dont have',date_ApiUrl)
              get_openApiData(date_ApiUrl);
              handleSaveData();
            }
          } catch (err) {
            console.error("error check-client", err);
          }
          console.log(dateFormat(currentDate));
          
        }
        currentDate.setDate(currentDate.getDate()+1)
      }
     
    }

    const openApiUrl = `https://apis.data.go.kr/B552115/RecMarketInfo2/getRecMarketInfo2?serviceKey=${apiKey}&pageNo=1&numOfRows=30&dataType=json&bzDd=${dateUrl}`;


    
    const OnbuttonClick = () => {
      axios.get(openApiUrl)
        .then(response => {
          const data = response.data;
          const newDate = parseInt(data.response.body.items.item[0].bzDd,10); 
          const newPrice = parseInt(data.response.body.items.item[0].clsPrc, 10); // 10은 기수를 나타냄
          

          setendPrice({
            date: newDate,
            price: newPrice
          });
          console.log(endPrice,newDate);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }
    //종가 가져오기
    const get_openApiData =(url)=>{
      axios.get(url)
        .then(response => {
          const data = response.data;
          const newDate = parseInt(data.response.body.items.item[0].bzDd,10); 
          const newPrice = parseInt(data.response.body.items.item[0].clsPrc, 10); // 10은 기수를 나타냄
          console.log(newDate);
          setendPrice({
            date: newDate,
            price: newPrice
          });
          console.log(endPrice,newDate);
        })
        .catch(error => {
          console.error('Error fetching data,get_openApidata:', error);
        });
    }
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
        console.log(landPrice2,newdate,"run getlanddata functions");
      } catch (err) {
        console.error("error get_landData", err);
      }
    };
   
    const handleSaveData = async ()=>{
      getDB_Land(new Date(dateValue.from))
      .then((result)=>{
        const result_db = result
        console.log(result_db,"db");
      })
      .catch((err)=>{
        console.error(err);
      })

    }
  
    const handleSaveDateland = async (count) => {
      
      try {
        await axios.post("http://localhost:8080/api/saveData2", { data: landPrice2[0] });
        console.log('data save success2', landPrice2[0]);
      } catch (err) {
        console.error('error saving data 2', err);
      }
    };
    

    const getDB_Land=async(currentDate)=>{
      try{
        const response = await axios.get(`http://localhost:8080/check_land?data=${dateFormat(currentDate)}`);
        const data_db_land = response.data.data;
        console.log (data_db_land)
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
          console.log(currentDate);
          let result_db;
          count++;
          try {
            // getDB_Land 함수 비동기 호출
            result_db = await getDB_Land(currentDate);
            
            if (result_db == null) {
              const date_ApiUrl = `https://apis.data.go.kr/B552115/RecMarketInfo2/getRecMarketInfo2?serviceKey=${apiKey}&pageNo=1&numOfRows=30&dataType=json&bzDd=${dateFormat(currentDate)}`;
              console.log('dont have data')
              
              // 비동기 함수 호출 후 기다리기
              await get_landData(date_ApiUrl);
              // 비동기 함수 호출 후 기다리기
              await handleSaveDateland(count);

            } else {
              console.log("have data - land (setLandPrice)")
              setLandPrice(result_db)
            }
          } catch (err) {
            console.error(err);
          }
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
};
      var today_endP= [];
      let lastedtH;
      const isthis=async()=>{
        const today = new Date();
        const closestTuesdayOrThursdayBefore = lastestdate(today);
  
        const result = await getDB_Land(closestTuesdayOrThursdayBefore.toString())
        today_endP = [{
          "날짜" : result.날짜,
          "최고가" : result.최고가,
          "최저가" : result.최저가
        }]
        console.log(result.날짜,today_endP);

        return result
      }
      
      
      const [jsonData, setJsonData] = useState(null);

      useEffect(() => {
      const fetchData = async () => {
        const startDate = dateFormat(dateValue.from);
        const endDate = dateFormat(dateValue.to);
        const today = new Date();
        const closestTT = lastestdate(today);
    
        try {
          const response = await axios.get('http://localhost:8080/search_land', {
            params: {
              startDate,
              endDate,
            },
          });
          console.log(response.data.data);
          setLandPrice_get(response.data.data);
        } catch (error) {
          console.log('Error fetching data', error);
        }
    
        try {
          const response = await axios.get(`/check_land?data=${dateFormat(closestTT)}`);
          const today_endP = [{
            "날짜": response.data.data.날짜,
            "최고가": response.data.data.최고가,
            "최저가": response.data.data.최저가
          }];
          console.log(today_endP); // 1번 콘솔
        } catch (error) {
          console.log('Error fetching data', error);
        }

       
      };
    
      fetchData();
      console.log(today_endP)
    
    }, [dateValue.from, dateValue.to, landPrice]); // 하나의 의존성 배열로 통합
    
    

    

    
    

    
  return (
    <>
    <Flex>
      <LastestP></LastestP>
      <LastestSMP></LastestSMP>
      {/* <Card className='top_card_left'>
        <Title>REC현물</Title>
        <Metric>최고가 : {`${today_endP.최고가}`}</Metric>
      </Card> */}
      {/* <Card className='top_card_right'>
        <Title>SMP</Title>
        <Metric>R</Metric>
      </Card> */}
    </Flex>
      <DateRangePicker
        value={dateValue}
        onValueChange={setDateValue}
        locale={ko}
        color='rose'
        >

      </DateRangePicker>
      <Button onClick={test}> Test</Button>
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
        {/* <LineChart
          className="h-72 mt-4"
          data={landPrice_get}
          index="날짜"
          categories={["최고가","최저가","매도물량","평균가"]}
          colors={["emerald", "gray","indigo","violet"]}
          yAxisWidth={55}
          onValueChange={(v) => setLandPrice_get(v)}
          connectNulls={true}
        /> */}
      </Card>
      <div>
        <Title>육지 rec 물량차트</Title>
        <LineChart
        width={1000}
        height={500}
        data={landPrice_get}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <XAxis dataKey={"날짜"}/>
        <YAxis yAxisId="left" type='number' domain={[40000,160000]} />
        <YAxis yAxisId="right" orientation="right" />
        <CartesianGrid strokeDasharray="3 3" />

        {/* Tooltip 설정 */}
        <Tooltip />

        {/* 범례 설정 */}
        <Legend />
        <Line type="linear" dataKey="매도물량" stroke="#82ca9d" yAxisId="right" />
        <Line type="linear" dataKey="체결물량" stroke="#ffc658" yAxisId="left" />
        </LineChart>
      </div>
    </>
  );
}

export default Main;