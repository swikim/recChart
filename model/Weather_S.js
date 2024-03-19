const mongoose = require('mongoose');

const Weather_Schema = mongoose.Schema({
    날짜:{
        type : String,
        unique:1,
    },
    지점:{
        type:String,
    },
    날씨:{
        type:String,
    },
},{collection:'weatherData'})

const Weather_S = mongoose.model("Weather_S",Weather_Schema);

module.exports = {Weather_S};