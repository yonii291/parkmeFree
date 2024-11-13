import mongoose from "mongoose";


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
    Zip_code: {
        type: Number,
        required: [true, 'You must provide a Zip code!'],
        minLength: 4,
        maxLength: 4
    },
    city: {
        type: String,
        required: [true, 'You must provide a city!'],
        maxLength: 30,
        minLength: 3
    },
    address: {
        type: String,
        required: [true, 'You must provide an address!'],
        maxLength: 50,
        minLength: 5
    },
    creationDate: {
        type: Date,
        default: Date.now
    }
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

// Vérification d'unicité avant de sauvegarder
async function createUser(data) {
    const existingUser = await User.findOne({ $or: [{ username: data.username }, { email: data.email }] });
    if (existingUser) {
        throw new Error('Username or email already exists');
    }

    const user = new User(data);
    await user.save();
    console.log('Utilisateur créé avec succès');
}

//create model and export it
const User = mongoose.model('User', userSchema)

//export the model
export default User;