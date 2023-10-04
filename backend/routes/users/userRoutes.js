const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const UserModel = require('../../models/userModel')
const authenticateJWT = require('../../middlewares/authenticateJWT')
const generateSecretKey = require('../../middlewares/generateSecretKey')
const router = express.Router()

router.use(bodyParser.json())

// Use the middleware on specific routes where needed
// router.use(authenticateJWT)  

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body //
    const user = await UserModel.findOne({ email })
    
    if (!user) { // check if user exists
      return res.status(401).json({ message: 'Email not found' })
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).send('Invalid password')
    }
    else if (isPasswordValid) {
      const safeUser = { ...user._doc } // create new user object without password - safer to send to client
      delete safeUser.password
    }
    
    const secretKey = process.env.JWT_SECRET
    const token = jwt.sign({ id: user.id, email }, secretKey, { expiresIn: '1h' })
    
    
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict'
    })
    
    return res.json({ token, user: safeUser })
     
  }catch (e) {
      return res.status(500).json({ message: 'Internal Server Error' })
  }
})

router.post('/signup', async (req, res) => {
  try{
    const { email, password, username } = req.body
    const existingUser = await UserModel.findOne({ email })
  
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' })
    }

    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    const newUser = new UserModel({
      email,
      password: hashedPassword,
      username
    }) 
    
    await newUser.save()
    const token = jwt.sign({ id: newUser._id, email }, 'yourSecretKey', { expiresIn: '1h' })
    
    return res.status(201).json({ token, message: 'User created successfully' })
  }catch (e) {
    return res.status(500).json({ message: '>>>ERROR in /signup post request<<<' })
  }
 
})


router.post('/logout', async (req, res) => {
  try {
    // Clear the user session
    req.session.destroy((error) => {
      if (error) {
        console.error(error)
        res.status(500).send('Internal Server Error')
      } else {
        res.status(200).send('Logged out successfully')
      }
    })
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal Server Error')
  }
})

router.get('/user', async (req, res) => {
  try {
    const token = req.cookies['token']
    if (!token) {
      return res.status(401).json({ message: 'No token provided.' })
    }
    
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    const userId = decodedToken.id

    const user = await UserModel.findById(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    return res.status(200).json(user)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
})


module.exports = router
