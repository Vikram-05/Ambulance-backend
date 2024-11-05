const mongoose = require('mongoose')


const userLocationSchema = new mongoose.Schema({
    _id : mongoose.Schema.ObjectId,
    userId: { type: String },
    latitude: { type: Number,default: 0},
    longitude: { type: Number ,default: 0},
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Location',userLocationSchema)

