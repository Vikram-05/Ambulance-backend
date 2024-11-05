const mongoose = require('mongoose')

const DriverSchema = mongoose.Schema({
    _id : mongoose.Schema.ObjectId,
    name : {type:String,require:true},
    email : {type:String,require:true},
    password : {type:String,require:true},
    photoUrl : {type:String,require:true},
    photoId : {type:String,require:true},
    carNumber : {type:String,require:true},
    aadharNumber : {type:Number,require:true},
    phoneNumber : {type:Number,require:true},
},{timestamps : true})

module.exports= mongoose.model('Driver', DriverSchema);

