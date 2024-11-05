const mongoose = require('mongoose')

const HospitalSchema = mongoose.Schema({
    _id : mongoose.Schema.ObjectId,
    name :  {type:String,require:true},
    licenceNumber :  {type:String,require:true},
    email :  {type:String,require:true},
    password : {type:String,require:true},
    phoneNumber : {type:String,require:true},
    logoUrl : {type:String,require:true},
    logoId : {type:String,require:true},
    // photoUrl : {type:String,require:true},
    // photoId : {type:String,require:true},
    facility :  {type:Array},
},{timestamps : true})

module.exports = mongoose.model('Hospital',HospitalSchema)