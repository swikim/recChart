import React, {useEffect, useState} from 'react';
import { Card, LineChart, Title,Button ,DateRangePicker ,DatePickerValue, DateRangePickerValue} from "@tremor/react";
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { ko } from 'date-fns/locale';
import { format } from 'date-fns';

import App from '../App'



function Main(){
    const navigate = useNavigate();

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
              console.log('dont have')
              const date_ApiUrl = `https://apis.data.go.kr/B552115/RecMarketInfo2/getRecMarketInfo2?serviceKey=yoDxAeXuxWRtQ%2BxEhRsJ0aFpqAVIInugpacEw9CJlopBLfc78UtjrXoR2KwMDtIrOtPL33SSz%2FdjDYI08s1%2Ffw%3D%3D&pageNo=1&numOfRows=30&dataType=json&bzDd=${dateFormat(currentDate)}`;
              console.log(date_ApiUrl)
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
    //종가 가져오기
    const get_openApiData =(url)=>{
      axios.get(url)
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
          console.error('Error fetching data,get_openApidata:', error);
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
    useEffect(() => {
      const startDate = dateFormat(dateValue.from);
      const endDate = dateFormat(dateValue.to);
    
      axios
        .get('http://localhost:8080/search', {
          params: {
            startDate,
            endDate,
          },
        })
        .then((response) => {
          console.log(response.data.data[0].date);
          setEnd_DataDB(response.data.data);
        })
        .catch((error) => console.log('Error fetching data', error));
    }, [dateValue.from, dateValue.to]);
    

    
    

    
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
          yAxisWidth={55}
          onValueChange={(v) => setEnd_DataDB(v)}
          connectNulls={true}
        />
      </Card>
      <div>
        {enddata_db && <h2>API Data : {enddata_db.date}</h2>}
        <Button onClick={handleSaveData}>save data</Button>
        <Button onClick={test}>Search DB Test</Button>
        <Button>과연 될려나</Button>
      </div>
    </>
  );
}

export default Main;