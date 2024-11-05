const express = require('express');

const app = express();

const Router = express.Router()
require('dotenv').config()

const Location = require('../models/Location')
const Driver = require('../models/Driver')



const jwt = require('jsonwebtoken')
const { default: mongoose } = require('mongoose');



// Router.post('/locationUpdate', async (req, res) => {

Router.post('/locationUpdate', async (req, res) => {
    const { userId, latitude, longitude } = req.body;
    // ...

    try {
        // ... (your existing code)
      
        let existingLocation = await Location.find({ userId });

        if (existingLocation.length == 0) {
            // Create a new location
            const newLocation = new Location({ _id: new mongoose.Types.ObjectId, userId, latitude, longitude });
            await newLocation.save();
            res.status(201).json({ message: 'Location created' });
            return; // Return to prevent further execution
        }

        // Update the existing location
        const updatedLocation = await Location.findByIdAndUpdate(existingLocation[0]._id, {
            latitude: req.body.latitude,
            longitude: req.body.longitude,
        }, { new: true });
        res.status(200).json({ updatedLocation });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error updating location' });
    }
});




// try {
//     // Find the user's existing location document
//     let existingLocation = await Location.find({ userId });
//     // let allDriver = await Driver.find()
//     // // console.log(allDriver)
//     // allDriver.forEach(element => {
//     //     const newDriver = new Location({
//     //         userId: element._id,
//     //     })
//     //     const driver =  newDriver.save()

//     // });

//     if (!existingLocation) {
//         // Create a new document if no existing location found
//         const newLocation = new Location({ userId, latitude, longitude });
//         await newLocation.save();
//       } else {
//         // Update the existing location
//         // const updatedLocation = new Location({
//         //   latitude: req.body.latitude,
//         //   longitude: req.body.longitude,
//         // });
//         // const updated = await Location.findByIdAndUpdate(existingLocation[0]._id, updatedLocation, { new: true });
//         const updated = await Location.findByIdAndUpdate(existingLocation[0]._id, {
//             latitude: req.body.latitude,
//             longitude: req.body.longitude,
//           }, { new: true });
//         res.status(200).json({ "Updated": updated });
//       }

//     res.sendStatus(200);
// } catch (err) {
//     console.error(err);
//     res.status(500).send('Error updating location');
// }
// });

module.exports = Router