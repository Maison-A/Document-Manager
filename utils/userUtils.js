const jwt = require('jsonwebtoken')
const { log } = require('../utils/generalUtils')
const crypto = require('crypto')
require('dotenv').config()

function generateJWT(user) {
    const secretKey = process.env.JWT_SECRET
    return jwt.sign({ id: user._id, email: user.email }, secretKey, { expiresIn: '1h' })
}


function authenticateJWT(req, res, next) {
    const token = req.cookies.token; // Assuming you're using a middleware like cookie-parser
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }

}

module.exports = {
  generateJWT,
  authenticateJWT,
  // generateSecretKey
}