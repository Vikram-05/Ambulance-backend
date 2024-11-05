const express = require('express')
const Router = express.Router()
require('dotenv').config()

const Patient = require('../models//Patient')

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

        const isPresent = await Patient.find({ email: req.body.email })
        if (isPresent.length > 0) {
            return res.status(500).json({
                "msg": "Email already exist"
            })
        }

        const uploadImage = await cloudinary.uploader.upload(req.files.photo.tempFilePath)
        // console.log(uploadImage)

        const hasPassword = await bcrypt.hash(req.body.password, 10)
        // console.log(hasPassword)

        const newPatient = new Patient({
            _id : new mongoose.Types.ObjectId,
            name : req.body.name,
            email : req.body.email,
            password : hasPassword,
            phoneNumber :req.body.phoneNumber,
            photoUrl : uploadImage.secure_url,
            photoId : uploadImage.public_id,
        })
        const patient = await newPatient.save()
        res.status(200).json({
            patient: patient
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
        const patient = await Patient.find({ email: req.body.email })
        if (patient == 0) {
            return res.status(500).json({
                "msg": "You have no accout with this Emanil"
            })
        }
        // console.log(req.body.password)

        const isValidPassword = await bcrypt.compare(req.body.password, patient[0].password)
        if (!isValidPassword) {
            res.status(500).json({
                "msg": "invalid password"
            })
        }

        const token = await jwt.sign({
            _id : patient[0]._id,
            name : patient[0].name,
            email : patient[0].email,
            password : patient[0].password,
            phoneNumber :patient[0].phoneNumber,
            photoUrl : patient[0].photoUrl,
            photoId : patient[0].photoId,
        },
            "Driver jwt Password",
            { expiresIn: "365d" }
        )

        res.status(200).json({
            _id : patient[0]._id,
            name : patient[0].name,
            email : patient[0].email,
            password : patient[0].password,
            phoneNumber :patient[0].phoneNumber,
            photoUrl : patient[0].photoUrl,
            photoId : patient[0].photoId,
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



