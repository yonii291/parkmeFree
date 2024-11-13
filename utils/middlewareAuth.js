const jwt = require('jsonwebtoken');
const config = require('../config/config.js')

function authenticate(req, res, next) {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).send('Accès refusé : aucun token fourni');
    }

    try {
        // Vérifie et décode le token
        const decoded = jwt.verify(token, 'secret_key');
        req.user = decoded; // attache les données du token à la requête
        next(); // passe à la suite si le token est valide
    } catch (error) {
        res.status(401).send('Token invalide');
    }
}
// module.exports = authenticate;

