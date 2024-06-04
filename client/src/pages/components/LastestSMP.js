import React, { useEffect,useState } from "react";
import { Card, Title,Text,Flex}from "@tremor/react";
import axios from "axios";

function LastestSMP(){
    
    const [jsonData, setJsonData] = useState(null)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/test');
                setJsonData(response.data.smp);
                setLoading(false);
            } catch (error) {
                console.error('Error from fetchData', error);
            }
        };

        // 데이터를 가져오는 fetchData 함수를 호출하고, 한 번만 호출되도록 함
        if (!jsonData) {
            fetchData();
        }
    }, [jsonData]);

    return (
        <Card className="top_card_right">
            <Title>SMP</Title>
            <Flex>
                <Text>오늘의 시장 가격</Text>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <h1>{jsonData}</h1>
                )}
            </Flex>
        </Card>
    );
}

export default LastestSMP;