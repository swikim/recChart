const mongoose = require('mongoose');

const LandPSchema = mongoose.Schema({
    날짜:{
        type : String,
        unique:1,
    },
    최고가:{//최고가
        type : String,
    },
    최저가:{//최저가
        type : String,
    },
    매도물량:{//매도물량
        type : String,
    },
    체결물량:{//체결물량
        type : String,
    },
    평균가:{//육지 평균가
        type : String,
    },

},{collection : 'landPrice'})

const Land_P = mongoose.model("Land_P",LandPSchema);

module.exports = {Land_P};