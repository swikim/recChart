import React, { useEffect,useState } from "react";
import { Card, Title,Button}from "@tremor/react";
import {ko} from "date-fns/locale/ko";
import {format} from "date-fns/format";
import axios from "axios";

function LastestP(){
    const dateFormat = (date) => {
        try {
          let formattedDate = format(date, "yyyyMMdd");
          return formattedDate;
        } catch (error) {
          console.error("Error formatting date:", error);
          return null;
        }
      };   
    const lastedTT=()=>{
        const today = new Date();
        today.setDate(today.getDate()-1)
        while(1){
            
            if(today.getDay() == 2|| today.getDay()==4){
                console.log(dateFormat(today),today.getDate())
                
                break;
            }else {
                today.setDate(today.getDate() - 1);
                console.log(today.getDay())
            }
            }
            return today;
    }
    const closestTT = lastedTT();

    const [LPA, setLPA] = useState(null)    
    useEffect(()=>{
        const fetchData = async()=>{
            try{
            const response  =  await axios.get(`check_land?data=${'20240222'}`);
            const LHP = response.data.data.최고가;
            const LLP = response.data.data.최저가;
           
            console.log(LPA);
            return {'최고가' : LHP, '최저가' : LLP}
        }
            catch(err){console.error("LastestP - useEffect error",err)}
            return null;
        }
        fetchData().then((data)=>{
            if(data){
                setLPA(data);

                console.log('success')
            }
        })

        console.log(LPA);
    },[])
    
    return(
        <>
        <Card className="top_card_left">
            <Title>REC현물</Title>
            <h2>{`${dateFormat(closestTT)}`}</h2>
            {LPA ? (
                <div>
                <p>Highest Price: {`${LPA.최고가}`}</p>
                <p>Lowest Price: {LPA.최저가}</p>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </Card>
        </>
    );
}

export default LastestP;