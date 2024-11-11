import mongoose, { Schema, model } from "mongoose";

//create the ParkingSession schema
let parkingSessionSchema = new Schema({
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
    creationDate: {
        type: Date,
        default: Date.now
    }
})


//create model and export it
export const ParkingSession = model('ParkingSession', parkingSessionSchema)