const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const UserModel = require('../../models/userModel')
const { log } = require('../../../utils/generalUtils')
const router = express.Router()
router.use(bodyParser.json())
// base route is '/user'


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    // log(`Searching for email: ${email}`)
    // Fetch the user from the database
    const user = await UserModel.findOne({ email })
    
    if (!user) {
      return res.status(401).json({ message: 'Email not found' })
    }
    
    // Compare the hashed passwords
    const isMatch = await bcrypt.compare(password, user.password)
    
    if (isMatch) {
      // Remove sensitive data from user object
      const safeUser = { ...user._doc }
      delete safeUser.password

      const token = jwt.sign({ email }, 'yourSecretKey', { expiresIn: '1h' })
      
      // Include the safe user object along with the token
      return res.json({ token, user: safeUser })
    } 
    else {
      return res.status(401).json({ message: 'Password is incorrect' })
    }
  } catch (error) {
    console.log(`Error in login: ${error}`)
    return res.status(500).json({ message: 'Internal Server Error' })
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
