import React, {useEffect, useState} from 'react';
import axios from "axios";
// import { Card, Title ,Text,Button ,Flex,
//     DateRangePicker ,DatePickerValue, DateRangePickerValue,DatePicker,DateRangePickerItem} from "@tremor/react";
// import { Tab,TabGroup,TabList,TabPanels,TabPanel } from '@tremor/react';
// import { ko } from 'date-fns/locale';
import { differenceInDays,format } from 'date-fns';
import "./Main.css";
import WeatherCard from './components/WeatherCard';
// import Hr from './components/Hr'

function Weather(){

    return(
        <>
        <div style={{position:'relative'}}>
            
                <WeatherCard/>
           
        </div>
        </>
    );
}

export default Weather;