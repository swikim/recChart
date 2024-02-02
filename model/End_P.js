const mongoose= require('mongoose');

const endPSchema =mongoose.Schema({
    date: {
        type : Number,
        unique : 1,
    },
    price:{
        type :Number
    }
   
},{ collection : 'endP'})

const End_P = mongoose.model("End_P",endPSchema);

module.exports = { End_P };