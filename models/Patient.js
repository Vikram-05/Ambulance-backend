const mongoose = require('mongoose')

const PatientSchema = mongoose.Schema({
    _id : mongoose.Schema.ObjectId,
    name : {type:String,require:true},
    email : {type:String,require:true},
    password : {type:String,require:true},
    phoneNumber :{type:String,require:true},
    photoUrl : {type:String,require:true},
    photoId : {type:String,require:true},
},{timestamps : true})

module.exports = mongoose.model('Patient',PatientSchema)