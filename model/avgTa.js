const mongoose = require('mongoose');

const avgTa_Schema  = mongoose.Schema({
    날짜:{
        type : String,
        unique:1,
    },
    지점:{
        type:String,
    },
    기온:{
        type:String,
    },
})

const avgTa = mongoose.model("avgTa",avgTa_Schema);

module.exports = { avgTa };