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
    geolocation: {
        type: String,
        required: true,
        validate: {
            validator: validateGeoJsonCoordinates,
            message: '{VALUE} is not a valid longitude/latitude(/altitude) coordinates array'
        }
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