const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const UserModel = require('../../models/userModel')
const { log } = require('../../../utils/generalUtils')
const router = express.Router()
router.use(bodyParser.json())

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  
  // Fetch the user from the database
  const user = await UserModel.findOne({ email })
  
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }
  
  // Compare the hashed passwords
  const isMatch = await bcrypt.compare(password, user.password)
  
  if (isMatch) {
    const token = jwt.sign({ email }, 'yourSecretKey', { expiresIn: '1h' })
    res.json({ token })
  } else {
    res.status(401).json({ message: 'Invalid credentials' })
  }
})

router.post('/signup', async (req, res) => {
  const { email, password, username } = req.body
  
  // Check if the email already exists in the database
  const existingUser = await UserModel.findOne({ email })
  if (existingUser) {
    return res.status(400).json({ message: 'Email already exists' })
  }
  
  // Hash the password
  const saltRounds = 10
  const hashedPassword = await bcrypt.hash(password, saltRounds)
  
  // Create a new user
  const newUser = new UserModel({
    email,
    password: hashedPassword,
    username
  })

  try {
    // Save to the database
    await newUser.save()
    
    // Generate a token
    const token = jwt.sign({ email }, 'yourSecretKey', { expiresIn: '1h' })
    
    // Respond with the token
    res.status(201).json({ token, message: 'User created successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error })
  }
})

module.exports = router  // Export the router instance
