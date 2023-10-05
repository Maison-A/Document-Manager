const jwt = require('jsonwebtoken')
const { log } = require('../utils/generalUtils')
const crypto = require('crypto')
require('dotenv').config()


function generateJWT(user) {
    const secretKey = process.env.JWT_SECRET
    return jwt.sign({ id: user._id, email: user.email }, secretKey, { expiresIn: '1h' })
}



function generateSecretKey() { // only call this ONE time per session/server start
    return process.env.JWT_SECRET = crypto.randomBytes(64).toString('hex')
    //console.log(generateSecretKey())
}

function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization

  if (authHeader) {
    const token = authHeader.split(' ')[1] // Bearer <token>

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403)
      }
      req.user = user
      next()
    })
  } else {
    res.sendStatus(401)
  }
}

module.exports = {
  generateJWT,
  authenticateJWT,
  generateSecretKey
}