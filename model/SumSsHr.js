const mongoose = require('mongoose');

const SumSsHr_Schema  = mongoose.Schema({
    날짜:{
        type : String,
        unique:1,
    },
    지점:{
        type:String,
    },
    일조량:{
        type:String,
    },
})

const SumSsHr = mongoose.model("SumSsHr",SumSsHr_Schema);

module.exports = { SumSsHr };