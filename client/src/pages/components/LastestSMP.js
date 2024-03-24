import React, { useEffect,useState } from "react";
import { Card, Title,Text,Flex}from "@tremor/react";
import axios from "axios";

function LastestSMP(){
    
    const [jsonData, setJsonData] = useState(null)
    const fetchData=async()=>{
        try {
            const response = await axios.get('/test');
            setJsonData(response.data.smp)
        } catch (error) {
            console.error('Error from fetchData',error)
        }
    }
    useEffect(() => {
        
        // 예시로 사용할 XML 데이터
        fetchData();
      }, []);

      
      
    return (
        <>
        <Card className="top_card_right">
            <Title>SMP</Title>
            <Flex>
                <Text>오늘의 시장 가격</Text>
                {jsonData?(
                    <h1>{`${jsonData}`}</h1>
                ):(
                    <p>Loading...</p>
                )}
            </Flex>
        </Card>
        </>
      );
}

export default LastestSMP;