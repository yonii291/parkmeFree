import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import config from '../config/config.js';


//create the user schema
const userSchema = new mongoose.Schema({
    id: {
        type: mongoose.ObjectId
    },
    firstName: {
        type: String,
        required: [true, 'You must provide a name!'],
        maxLength: 20,
        minLength: 3
    },
    lastName: {
        type: String,
        required: [true, 'You must provide a lastname!'],
        maxLength: 20,
        minLength: 3
    },
    userName: {
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


// Hachage du mot de passe avant de sauvegarder l'utilisateur
userSchema.pre('save', async function (next) {
    const user = this;
    user.password = await bcrypt.hash(user.password, 8);
    next();
});

// Méthode pour générer un token JWT
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString(), role: user.role }, config.jwtSecret, { expiresIn: '1h' });
    return token;
};



// // //Hide the hashed password and _v to the api users
// userSchema.set("toJSON", {
//     transform: transformJsonUser
// });
// function transformJsonUser(doc, json, options) {
//     // Remove the hashed password and _v from the generated JSON.
//     delete json.password;
//     delete json.__v;
//     return json;
// }

// // Vérification d'unicité avant de sauvegarder
async function createUser(data) {
    const existingUser = await User.findOne({ $or: [{ username: data.username }, { email: data.email }] });
    if (existingUser) {
        throw new Error('Username or email already exists');
    }

    const user = new User(data);
    await user.save();
    console.log('Utilisateur créé avec succès');
}

// // Méthode pour trouver un utilisateur par ses identifiants
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Unable to login45');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error(password + user.password + isMatch);

    }

    return user;
};


//create model and export it
const User = mongoose.model('User', userSchema)

//export the model
export default User;