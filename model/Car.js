import mongoose, { Schema, model } from "mongoose";

// create the car schema
let carSchema = new Schema({
    id: {
        type: mongoose.ObjectId
    },
    model: {
        type: String,
        required: [true, 'You must provide a name!'],
        maxLength: 30,
        minLength: 3
    },
    height: {
        type: Number,
        required: [true, 'You must provide a height in cm'],
        min: 2,
        max: 3
    },
    license_plate: {
        type: String,
        required: [true, 'You must provide a license plate number!'],
        unique: true,
        maxLength: 9,
        minLength: 1
    },
    creationDate: {
        type: Date,
        default: Date.now
    }

})

//Hide the _v to the api users
carSchema.set("toJSON", {
    transform: transformJsonCar
});


function transformJsonCar(doc, json, options) {
    // Remove the _v from the generated JSON.
    delete json.__v;
    return json;
}

//create model and export it
export const Car = model('Car', carSchema)