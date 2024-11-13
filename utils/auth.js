// auth.js
export default function authenticate() {

    const jwt = require('jsonwebtoken');
    const User = require('../models/User');
    const config = require('../config/config');

    exports.login = async (req, res) => {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user || user.password !== password) {
            return res.status(401).send('Identifiants incorrects');
        }

        const token = jwt.sign({ userId: user._id }, config.jwtSecret, { expiresIn: '1h' });
        res.status(200).send({ token });
    };
    // code d'authentification
}
