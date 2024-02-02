import React, {useEffect, useState} from 'react';
import { Card, LineChart, Title,Button ,DateRangePicker ,DatePickerValue, DateRangePickerValue} from "@tremor/react";
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { ko } from 'date-fns/locale';
import { format } from 'date-fns';

import App from '../App'


// const chartdata2 = [
//     {
//       date: "Jan 23",
//       "2022": 45,
//       "2023": 78,
//     },
//     {
//       date: "Feb 23",
//       "2022": 52,
//       "2023": 71,
//     },
//     {
//       date: "Mar 23",
//       "2022": 48,
//       "2023": 80,
//     },
//     {
//       date: "Apr 23",
//       "2022": 61,
//       "2023": 65,
//     },
//     {
//       date: "May 23",
//       "2022": 55,
//       "2023": 58,
//     },
//     {
//       date: "Jun 23",
//       "2022": 67,
//       "2023": 62,
//     },
//     {
//       date: "Jul 23",
//       "2022": 60,
//       "2023": 54,
//     },
//     {
//       date: "Aug 23",
//       "2022": 72,
//       "2023": 49,
//     },
//     {
//       date: "Sep 23",
//       "2022": 65,
//       "2023": 52,
//     },
//     {
//       date: "Oct 23",
//       "2022": 68,
//       "2023": null,
//     },
//     {
//       date: "Nov 23",
//       "2022": 74,
//       "2023": null,
//     },
//     {
//       date: "Dec 23",
//       "2022": 71,
//       "2023": null,
//     },
//   ];

function Main(){
    const navigate = useNavigate();

    const [data, setData] = useState(null);

    
      
    // const handleButtonClick = () =>{
    //     navigate('/chart');
    // }
    

    const [value, setValue] = useState(null);
    
    //db에서 값 가져오기
    const [enddata_db, setEnd_DataDB] = useState("");


    
    const [endPrice, setendPrice] = useState([
      {
        "date":0,
        "price":0
      }
    ])

    // Datepicker
    const [dateValue, setDateValue] = useState({
      from : new Date(2024,0,1),
      to : new Date(),
    })

    const dateFormat=(date)=>{
      let formattedDate = format(date,"yyyyMMdd");
      let year = formattedDate.substring(0,4);
      let month = (date.getMonth()+1).toString();
      let day = formattedDate.substring(6,);


      return formattedDate
    }
    let dateUrl;
    dateUrl = String(dateFormat(dateValue.from))
    // 요일
    const getDay =(date)=>{
      let week = date.getDay();
      
      return week; //2:화,4:목
    }
   
    const checkButton = ()=>{
      console.log("from",dateFormat(dateValue.from),"to : ",dateFormat(dateValue.to) , "week :",getDay(dateValue.from), typeof(dateFormat(dateValue.to)))
      
     
    }

    const openApiUrl = `https://apis.data.go.kr/B552115/RecMarketInfo2/getRecMarketInfo2?serviceKey=yoDxAeXuxWRtQ%2BxEhRsJ0aFpqAVIInugpacEw9CJlopBLfc78UtjrXoR2KwMDtIrOtPL33SSz%2FdjDYI08s1%2Ffw%3D%3D&pageNo=1&numOfRows=30&dataType=json&bzDd=${dateUrl}`;


    
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
    const handleSaveData = async ()=>{
      try{
        await axios.post("http://localhost:8080/api/saveData",{data : endPrice});
        console.log("data save success")
      }catch(error){
        console.error('error saving data', error)
      }
    }
  
    const test = () =>{
      const startDate = dateFormat(dateValue.from);
      const endDate = dateFormat(dateValue.to);
      try{
        axios.get('http://localhost:8080/search',{
          params:{
            startDate,
            endDate,
          }
        })
        // .then(response=>{
        //   console.log('data from data',response.data);
        // })
      }catch(err){
        console.error('Error searching code from client',err);
      }
    }

    //chart
    useEffect(()=>{
      const startDate = dateFormat(dateValue.from);
      const endDate = dateFormat(dateValue.to);

       axios.get('http://localhost:8080/search',{
          params:{
            startDate,
            endDate,
          }
        })
          .then(response=>{
            console.log(response.data.data[0].date)
            setEnd_DataDB(response.data.data)
          })
          .catch(error=>console.log('Error fetching data',error))
        }, [])

    
    // const OnbuttonClick =()=>{
    //   fetch(openApiUrl)
    //   .then(response=>response.json())
    //   .then(data =>{
    //     setendPrice(data.response.body.items.item[0].clsPrc)
    //     console.log(endPrice)
    //   })
    //  }

    const ttSearch=async()=>{
      const startDate = new Date(dateFormat(dateValue.from));
      const endDate = new Date(dateFormat(dateValue.to));

      let currentDate = new Date(startDate);

      let result = null;

      while(currentDate <= endDate){
        if(getDay(currentDate)==2||getDay(currentDate)==4){
          try{ //DB에서 찾기
            await axios.get('http://localhost:8080/search',{
              params:{
                startDate,
                endDate,
              }
            })
            .then(response=>{
              console.log('data from DB',response.data)
              result = response.data //DB결과값
            })
          }catch(err){
            console.error('Error searching code from client',err);
          }
          if(result!=null){
            setEnd_DataDB(result);
          }else{
            await axios.get(openApiUrl)
              .then(response => { //데이터 받아오기
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

              //DB에 넣기
              try{
                await axios.post("http://localhost:8080/api/saveData",{data : endPrice});
                console.log("data save success")
              }catch(error){
                console.error('error saving data', error)
              }
              //end_Value에 넣기
              setEnd_DataDB(endPrice);
          }
        }
        currentDate.setDate(currentDate.getDate()+1);
      }
    }

    
  return (
    <>
      <DateRangePicker
        value={dateValue}
        onValueChange={setDateValue}
        locale={ko}
        color='rose'
        >

      </DateRangePicker>
      <Button onClick={checkButton}>확인</Button>
      <Button onClick={OnbuttonClick}>button</Button>
      <Card>
        <Title>Closed Pull Requests</Title>
        <LineChart
          className="h-72 mt-4"
          data={enddata_db}
          index="date"
          categories={["price"]}
          colors={["neutral"]}
          yAxisWidth={20}
          onValueChange={(v) => setEnd_DataDB(v)}
          connectNulls={true}
        />
      </Card>
      <div>
        {enddata_db && <h2>API Data : {enddata_db.date}</h2>}
        <Button onClick={handleSaveData}>save data</Button>
        <Button onClick={test}>Search DB Test</Button>
        <Button onClick={ttSearch}>과연 될려나</Button>
      </div>
    </>
  );
}

export default Main;