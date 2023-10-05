const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const generalUtils = require('../../../utils/generalUtils')
const UserModel = require('../../models/userModel')
const userUtils = require('../../../utils/userUtils')
const router = express.Router()

router.use(bodyParser.json())

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  const user = await UserModel.findOne({ email })
  
  if (!user) {
    return res.status(401).json({ message: 'Email not found' })
  }
  
  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    return res.status(401).send('Invalid password')
  }
  
  const safeUser = { ...user._doc }
  delete safeUser.password
  
  const token = userUtils.generateJWT(user)
  
  res.cookie('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict'
  })
  
  return res.status(200).json({ message: 'Login successful',user: safeUser, token: token  })
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
    const secretKey = process.env.JWT_SECRET
    const token = jwt.sign({ id: newUser._id, email }, secretKey, { expiresIn: '1h' })
    
    return res.status(201).json({ token, message: 'User created successfully' })
  }catch (e) {
    return res.status(500).json({ message: '>>>ERROR in /signup post request<<<' })
  }
 
})


router.post('/logout', (req, res) => {
  res.clearCookie('token')
  return res.status(200).send('Logged out successfully')
})

// this route should display "other" users
router.get('/:id', userUtils.authenticateJWT, async (req, res) =>  {
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

// New GET route to get currrent user's info
router.get('/me', userUtils.authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id;  // Assuming authenticateJWT middleware sets req.user
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const safeUser = { ...user._doc };
    delete safeUser.password;
    return res.status(200).json(safeUser);
  } catch (e) {
    generalUtils.log(e)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
});


module.exports = router
