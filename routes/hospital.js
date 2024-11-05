const express = require('express')
const Router = express.Router()
require('dotenv').config()

const Hospital = require('../models//Hospital')

const bcrypt = require('bcrypt')
const cloudinary = require('cloudinary').v2
const jwt = require('jsonwebtoken')
const { default: mongoose } = require('mongoose')


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API,
    api_secret: process.env.CLOUD_SECRET
});

Router.post('/signin', async (req, res) => {
    try {

        const isPresent = await Hospital.find({ email: req.body.email })
        if (isPresent.length > 0) {
            return res.status(500).json({
                "msg": "Email already exist"
            })
        }

        const uploadImage = await cloudinary.uploader.upload(req.files.logo.tempFilePath)
        // console.log(uploadImage)

        const hasPassword = await bcrypt.hash(req.body.password, 10)
        // console.log(hasPassword)

        const newHospital = new Hospital({
            _id: new mongoose.Types.ObjectId,
            name: req.body.name,
            licenceNumber: req.body.licenceNumber,
            email: req.body.email,
            password: hasPassword,
            phoneNumber: req.body.phoneNumber,
            logoUrl: uploadImage.secure_url,
            logoId: uploadImage.public_id,
            // photoUrl : {type:String,require:true},
            // photoId : {type:String,require:true},
            facility: req.body.facility.split(","),
        })
        const hospital = await newHospital.save()
        res.status(200).json({
            hospital: hospital
        })
    }
    catch (err) {
        res.status(500).json({
            "Error": err
        })
        console.log(err)
    }
})

Router.post('/login', async (req, res) => {
    // console.log(req.body.password)
    // console.log(req.body.email)

    try {
        const hospital = await Hospital.find({ email: req.body.email })
        if (hospital == 0) {
            return res.status(500).json({
                "msg": "You have no accout with this Emanil"
            })
        }
        // console.log(req.body.password)

        const isValidPassword = await bcrypt.compare(req.body.password, hospital[0].password)
        if (!isValidPassword) {
            res.status(500).json({
                "msg": "invalid password"
            })
        }

        const token = await jwt.sign({
            _id: hospital[0]._id,
            name: hospital[0].name,
            licenceNumber: hospital[0].licenceNumber,
            email: hospital[0].email,
            password: hospital[0].password,
            phoneNumber: hospital[0].phoneNumber,
            logoUrl: hospital[0].logoUrl,
            logoId: hospital[0].logoId,
            // photoUrl : {type:String,require:true},
            // photoId : {type:String,require:true},
            facility: hospital[0].facility,
        },
            "Driver jwt Password",
            { expiresIn: "365d" }
        )

        res.status(200).json({
            _id: hospital[0]._id,
            name: hospital[0].name,
            licenceNumber: hospital[0].licenceNumber,
            email: hospital[0].email,
            password: hospital[0].password,
            phoneNumber: hospital[0].phoneNumber,
            logoUrl: hospital[0].logoUrl,
            logoId: hospital[0].logoId,
            // photoUrl : {type:String,require:true},
            // photoId : {type:String,require:true},
            facility: hospital[0].facility,
            token : token
        })
    }
    catch (err) {
        res.status(500).json({
            "Error": err
        })
        console.log(err)
    }


})

module.exports = Router



