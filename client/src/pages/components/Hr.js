import React,{useEffect,useState} from "react";
import axios from "axios";
import { DateRangePicker,Button,Text,Title} from "@tremor/react";
import { ko } from 'date-fns/locale';
import { differenceInDays,format } from 'date-fns';
import "../Main.css"

const Hr=({onRegionChange})=>{
    const apiKey = process.env.REACT_APP_API_Key

    const [dateValue, setDateValue] = useState({
        from : new Date(2024,0,1),
        to : new Date(),
    })
    const [avgHr, setAvgHr] = useState([]);
    let ssHrData = [];

    //지역코드 보내기
    const handleClick=(buttonId)=>{
        const dataToSend =`${buttonId}`;
        onRegionChange(dataToSend);
    }
    //날의 차

    const dateSubtract=()=>{
        const startDate = dateValue.from;
        const endDate = dateValue.to;

        const dayDifference = differenceInDays(endDate,startDate)
        
        return dayDifference
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

    const get_Weather = async(startDate,endDate,region_Code)=>{
       
        const dayDifference = dateSubtract()
        const url =`https://apis.data.go.kr/1360000/AsosDalyInfoService/getWthrDataList?serviceKey=${apiKey}&pageNo=1&numOfRows=${dayDifference}&dataType=json&dataCd=ASOS&dateCd=DAY&startDt=${startDate}&endDt=${dateFormat(endDate)}&stnIds=${region_Code}`
        const response = await axios.get(url);
        const data = response.data.response.body;
        //const weatherInfo = data.items.item[0].tm;
        const stnid = data.items.item[0].stnId
        var i;
        var sumHr=0;
        for( i = 0; i<dayDifference-1;i++){
            const weatherInfo_date = data.items.item[i].tm;
            //const weatherInfo_avTa= data.items.item[i].avgTa;
            const weatherInfo_Hr = data.items.item[i].sumSsHr;
            //const weatherInfo_iscs = data.items.item[i].iscs;
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
            if (!prevArray.includes(stnid)) {
              return [averageHr, ...prevArray];
            } else {
              return prevArray;
            }
          });
    }
    function isToday(date) {
        const today = new Date();
        return (
          date.getDate() === today.getDate() &&
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear()
        );
      }

      useEffect(()=>{
        const regionCodes = [119,114,131,232,146,156,138,152,184]
         //,156,138,152,184
        //경기,강원,충북,충남,전북1,전남,경북,경남,제주

        const startDate = new Date(dateValue.from);
        const currentDate = new Date(dateValue.to);
        var endDate = new Date(currentDate);

        if (isToday(currentDate)) {
            endDate.setDate(currentDate.getDate() - 1);
          } else {
        }
        for(const regionCode of regionCodes){
            get_Weather(dateFormat(startDate),endDate,regionCode)
        }


      },[dateValue])
     
    return (
        <>
         <div style={{width:'800px',height:'auto',position:'relative'}}>
            <Title>일조량 평균값</Title>
         <DateRangePicker
            value={dateValue}
            onValueChange={setDateValue}
            locale={ko}
            selectPlaceholder='선택하세요'
            >
        </DateRangePicker>
            <h2 style={{position:'absolute',top:'5px',right:'10px'}}>단위:시간</h2>
         <img src="/koreamap.png" 
        style={{width:'800px',height:'800px'}}/>
           
            <Button className="ggbox" onClick={()=>handleClick('경기')}> 
                {avgHr?(          
                    <Text className='text'>경기<br/>{`${avgHr[0]}`}</Text>
                ) : (
                    <p>Loading...</p>
                )}</Button>
            <Button className='gwbox' onClick={()=>handleClick('강원')}>
                {avgHr?(          
                    <Text className='text'>강원<br/>{`${avgHr[1]}`}</Text>
                ) : (
                    <p>Loading...</p>
                )}
            </Button>
            <Button className='cbbox' onClick={()=>handleClick('충북')}>
                {avgHr?(          
                        <Text className='text'>충북<br/>{`${avgHr[2]}`}</Text>
                    ) : (
                        <p>Loading...</p>
                    )}
            </Button>
            <Button className='cnbox' onClick={()=>handleClick('충남')}>
                {avgHr?(          
                        <Text className='text'>충남<br/>{`${avgHr[3]}`}</Text>
                    ) : (
                        <p>Loading...</p>
                    )}
            </Button>
            <Button className='jbbox' onClick={()=>handleClick('전북')}>
                {avgHr?(          
                        <Text className='text'>전북<br/>{`${avgHr[4]}`}</Text>
                    ) : (
                        <p>Loading...</p>
                    )}
            </Button>
            <Button className='jnbox' onClick={()=>handleClick('전남')}>
                {avgHr?(          
                        <Text className='text'>전남<br/>{`${avgHr[5]}`}</Text>
                    ) : (
                        <p>Loading...</p>
                    )}
            </Button>
            <Button className='gbbox' onClick={()=>handleClick('경북')}>
                {avgHr?(          
                        <Text className='text'>경북<br/>{`${avgHr[6]}`}</Text>
                    ) : (
                        <p>Loading...</p>
                    )}
            </Button>
            <Button className='gnbox' onClick={()=>handleClick('경남')}>
                {avgHr?(          
                        <Text className='text'>경남<br/>{`${avgHr[7]}`}</Text>
                    ) : (
                        <p>Loading...</p>
                    )}
            </Button>
            <Button className='jjbox' onClick={()=>handleClick('제주')}>
                {avgHr?(          
                        <Text className='text'>제주<br/>{`${avgHr[8]}`}</Text>
                    ) : (
                        <p>Loading...</p>
                    )}
            </Button>
        </div>
        </>
    )
}

export default Hr;