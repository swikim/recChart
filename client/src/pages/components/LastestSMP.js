import React, { useEffect,useState } from "react";
import { Card, Title,Button}from "@tremor/react";
import {ko} from "date-fns/locale/ko";
import {format} from "date-fns/format";
import axios from "axios";
import XMLParser from 'react-xml-parser';

function LastestSMP(){
    const url = 'https://openapi.kpx.or.kr/openapi/smp1hToday/getSmp1hToday?serviceKey=yoDxAeXuxWRtQ%2BxEhRsJ0aFpqAVIInugpacEw9CJlopBLfc78UtjrXoR2KwMDtIrOtPL33SSz%2FdjDYI08s1%2Ffw%3D%3D&areaCd=1'
    const [jsonData, setJsonData] = useState(null)
    const fetchData=async()=>{
        try {
            const response = await axios.get('https://openapi.kpx.or.kr/openapi/smp1hToday/getSmp1hToday?serviceKey=yoDxAeXuxWRtQ%2BxEhRsJ0aFpqAVIInugpacEw9CJlopBLfc78UtjrXoR2KwMDtIrOtPL33SSz%2FdjDYI08s1%2Ffw%3D%3D&areaCd=1');
            const xmlData = response.data;

            const parser = new XMLParser();
            const jsonResult = parser.parseFromString(xmlData);

            setJsonData(jsonResult);

            console.log(jsonData)

        } catch (error) {
            console.error('Error from fetchData',error)
        }
    }
    useEffect(() => {
        
        // 예시로 사용할 XML 데이터
        fetchData();
      }, []);

      const testSMP=()=>{
        fetchData()
        console.log('testing')
      }
     
      
    return (
        <>
        <Card className="top_card_right">
            <Title>SMP</Title>
            <Button onClick={testSMP}>test</Button>
        </Card>
        </>
      );
}

export default LastestSMP;