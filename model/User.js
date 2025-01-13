import mongoose, { model } from "mongoose";
import jwt from "jsonwebtoken";
//import bcrypt from 'bcryptjs';
import config from "../config/config.js";

//create the user schema
const userSchema = new mongoose.Schema({
  id: {
    type: mongoose.ObjectId,
  },
  firstName: {
    type: String,
    required: [true, "You must provide a name!"],
    maxLength: 20,
    minLength: 3,
  },
  lastName: {
    type: String,
    required: [true, "You must provide a lastname!"],
    maxLength: 20,
    minLength: 3,
  },
  userName: {
    type: String,
    required: [true, "You must provide a username!"],
    maxLength: 20,
    minLength: 3,
    unique: true,
  },
  password: {
    type: String,
    required: [true, "You must provide a password!"],
    minLength: 3,
  },
  email: {
    type: String,
    required: [true, "You must provide an email!"],
    unique: true,
    match: [/\S+@\S+\.\S+/, "Please enter a valid email"],
  },
  notificationToken: {
    type: String,
    required: false, // Ce champ est facultatif
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },

  car_id: {
    type: mongoose.ObjectId,
    required: false, 

  admin: {
    type: Boolean,
    default: false,
  },
});

//Hide the hashed password and _v to the api users
userSchema.set("toJSON", {
  transform: transformJsonUser,
});
function transformJsonUser(doc, json, options) {
  // Remove the hashed password and _v from the generated JSON.
  //delete json.password;
  delete json.__v;
  return json;
}

//export the model
export const User = model("User", userSchema);
