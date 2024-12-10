import mongoose, { model } from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import config from '../config/config.js';


//create the user schema
const userSchema = new mongoose.Schema({
    id: {
        type: mongoose.ObjectId
    },
    firstname: {
        type: String,
        required: [true, 'You must provide a name!'],
        maxLength: 20,
        minLength: 3
    },
    lastname: {
        type: String,
        required: [true, 'You must provide a lastname!'],
        maxLength: 20,
        minLength: 3
    },
    username: {
        type: String,
        required: [true, 'You must provide a username!'],
        maxLength: 20,
        minLength: 3,
        unique: true
    },
    password: {
        type: String,
        required: [true, 'You must provide a password!'],
        minLength: 3
    },
    email: {
        type: String,
        required: [true, 'You must provide an email!'],
        unique: true,
        match: [/\S+@\S+\.\S+/, 'Please enter a valid email']
    },
    notificationToken: {
        type: String,
        required: false // Ce champ est facultatif
    },
    creationDate: {
        type: Date,
        default: Date.now
    },
    admin: {
        type: Boolean,
        default: false
    },
})

//Hide the hashed password and _v to the api users
userSchema.set("toJSON", {
    transform: transformJsonUser
});
function transformJsonUser(doc, json, options) {
    // Remove the hashed password and _v from the generated JSON.
    delete json.password;
    delete json.__v;
    return json;
}

<<<<<<< HEAD
// // Méthode pour trouver un utilisateur par ses identifiants
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Unable to login');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Unable to login');

    }

    return user;
};


//create model and export it
const User = mongoose.model('User', userSchema)

=======
>>>>>>> 2c58b5f706c23656720c101e19d13a4ad9afcef8
//export the model
export const User = model('User', userSchema)