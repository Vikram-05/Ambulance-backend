const express = require('express')
const app = express()
require('dotenv').config()

const driverRoute = require('./routes/driver')
const hospitalRoute = require('./routes/hospital')
const patientRoute = require('./routes/patient')
const locationRoute = require('./routes/location')

const cors = require('cors')

const body_parser = require('body-parser')
const fileUpload = require('express-fileupload')

const mongoose = require('mongoose')
const DBConnect = async() => {
    try
    {
        const response = await mongoose.connect(process.env.DB_URl)
        console.log("DB connection Success")

    }catch(err){
        console.log("DB connection fail")
    }
}
DBConnect()

app.use(body_parser.json())
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));
app.use(cors())
app.use('/driver',driverRoute)
app.use('/hospital',hospitalRoute)
app.use('/patient',patientRoute)
app.use('/location',locationRoute)




module.exports = app