const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()
const { log } = require('../../../utils/generalUtils')
router.use(bodyParser.json())
const jwt = require('jsonwebtoken')
  
  router.post('/login', (req, res) => {
    const { email, password, username } = req.body
    
    // Normally you'd fetch user from database and compare hashed passwords
    if (email === dummyUser.email && password === dummyUser.password) {
      const token = jwt.sign({ email }, 'yourSecretKey', { expiresIn: '1h' })
      res.json({ token })
    } else {
      res.status(401).json({ message: 'Invalid credentials' })
    }
  })

module.exports = router // Export the router instance