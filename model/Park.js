import mongoose, { Schema, model } from "mongoose";

//create the user schema
let parkSchema = new Schema({
    id: {
        type: mongoose.ObjectId
    },
    name: {
        type: String,
        required: [true, 'You must provide a name'],
        maxLength: 50,
        minLength: 3
    },
    height: {
        type: Number,
        required: [true, 'You must provide a height'],
        min: 0
    },
    picture: {
        type: String,
        required: [true, 'You must provide a picture'],
    },
    capacity: {
        type: Number,
        required: [true, 'You must provide a capacity']
    },
<<<<<<< HEAD
    adress: {
        type: String,
        required: [true, 'You must provide an address'],
    },
    npa: {
        type: Number,
        required: [true, 'You must provide a postal code'],
        min: 1000,
        max: 9999
    },
    city: {
        type: String,
        required: [true, 'You must provide a city'],
=======
    geolocation: {
        type: [Number],
        required: true,
        validate: {
            validator: validateGeoJsonCoordinates,
            message: '{VALUE} is not a valid longitude/latitude(/altitude) coordinates array'
        }
>>>>>>> 9b71a392e765d8ff26536b7d9f155ff41c0588ad
    },
    creationDate: {
        type: Date,
        default: Date.now
    },
    freeTime: {
        type: Number,
        required: [true, 'You must provide a free time duration'],
        min: 0,
        default: 0 // Par défaut, pas de temps gratuit
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
export const Park = model('Park', parkSchema)