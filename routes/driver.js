const express = require('express')
const Router = express.Router()
require('dotenv').config()

const Driver = require('../models/Driver')

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

        const isPresent = await Driver.find({ email: req.body.email })
        if (isPresent.length > 0) {
            return res.status(500).json({
                "msg": "Email already exist"
            })
        }

        const uploadImage = await cloudinary.uploader.upload(req.files.photo.tempFilePath)
        // console.log(uploadImage)

        const hasPassword = await bcrypt.hash(req.body.password, 10)
        // console.log(hasPassword)

        const newDriver = new Driver({
            _id: new mongoose.Types.ObjectId,
            name: req.body.name,
            email: req.body.email,
            password: hasPassword,
            photoUrl: uploadImage.secure_url,
            photoId: uploadImage.public_id,
            carNumber: req.body.carNumber,
            aadharNumber: req.body.aadharNumber,
            phoneNumber: req.body.phoneNumber,
        })
        const driver = await newDriver.save()
        res.status(200).json({
            driver: driver
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
        const driver = await Driver.find({ email: req.body.email })
        if (driver == 0) {
            return res.status(401).json({
                "msg": "You have no accout with this Emanil"
            })
        }
        // console.log(driver[0].password)

        const isValidPassword = await bcrypt.compare(req.body.password, driver[0].password)
        if (!isValidPassword) {
            res.status(401).json({
                "msg": "invalid password"
            })
        }

        const token = await jwt.sign({
            _id: driver[0]._id,
            name: driver[0].name,
            email: driver[0].email,
            password: driver[0].password,
            photoUrl: driver[0].photoUrl,
            photoId: driver[0].photoId,
            carNumber: driver[0].carNumber,
            aadharNumber: driver[0].aadharNumber,
            phoneNumber: driver[0].phoneNumber,
        },
            "Driver jwt Password",
            { expiresIn: "365d" }
        )

        res.status(200).json({
            _id: driver[0]._id,
            name: driver[0].name,
            email: driver[0].email,
            password: driver[0].password,
            photoUrl: driver[0].photoUrl,
            photoId: driver[0].photoId,
            carNumber: driver[0].carNumber,
            aadharNumber: driver[0].aadharNumber,
            phoneNumber: driver[0].phoneNumber,
            token : token
        })
    }
    catch(err){
        res.status(500).json({
            "Error" : err
        })
        console.log(err)
    }


})

module.exports = Router



