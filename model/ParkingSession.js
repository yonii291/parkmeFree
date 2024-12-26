import mongoose, { Schema, model } from "mongoose";

//create the ParkingSession schema
let parkingSessionSchema = new mongoose.Schema({
    id: {
        type: mongoose.ObjectId
    },
    start_time: {
        type: Date,
        required: [true, 'You must provide a start_time!']
    },
    end_time: {
        type: Date,
        required: [true, 'You must provide an end_time!']
    },
    park_id: {
        type: mongoose.ObjectId,
        required: [true, 'You must provide a park_id!']
    },
    user_id: {
        type: mongoose.ObjectId,
        required: [true, 'You must provide a user_id!']
    },
    car_id: {
        type: mongoose.ObjectId,
        required: [true, 'You must provide a car_id!']
    },
    geolocation: {
        type: [Number],
        required: true,
        validate: {
            validator: validateGeoJsonCoordinates,
            message: '{VALUE} is not a valid longitude/latitude(/altitude) coordinates array'
        }
    },
    creationDate: {
        type: Date,
        default: Date.now
    }
})

// Validate a GeoJSON coordinates array (longitude, latitude and optional altitude).
function validateGeoJsonCoordinates(value) {
    return Array.isArray(value) && value.length >= 2 && value.length <= 3 && isLongitude(value[0]) && isLatitude(value[1]);
}

function isLatitude(value) {
    return value >= -90 && value <= 90;
}

function isLongitude(value) {
    return value >= -180 && value <= 180;
}


//create model and export it
export const ParkingSession = model('ParkingSession', parkingSessionSchema)