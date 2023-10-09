/**
 * Title: server.js
 * Description: This file serves as the main entry point for my Express server. It sets up middleware for handling CORS, request logging with Morgan,
 * parses cookies with cookie-parser, and serves static files from different directories based on URL parameters. It also establishes a connection
 * to the MongoDB database using Mongoose and imports and uses defined routes for managing documents. 
 * These routes are associated with specific URL prefixes.
 */

// initialize express server and allow env access
const express = require('express')
require('dotenv').config() // access env

// Import the middleware
const userUtils = require('../utils/userUtils.js')

// initialize helpers
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser') // initialize parser
const cors = require('cors') // initialize CORS (for all routes on Express server)
const morgan = require('morgan') // initialize morgan logger
const mongoose = require('mongoose') // initialize mongoose
const path = require('path')
const fs = require('fs')

// execute express
const app = express() // set as var

// execute helpers
app.use(cors(  
  {
    origin: process.env.ORIGIN_URL,  // frontend origin
    // origin: 'http://localhost:8080',
    credentials: true
  }
)) // execute cors
app.use(morgan('tiny')) // execute morgan
app.use(cookieParser()) // execute cookieParser

app.use(bodyParser.json()) // execute bodyParser
app.use(bodyParser.urlencoded({ extended: true })) // execute bodyParser
app.use('/Docs', express.static(path.join(__dirname,'../Docs'))) // serve files from this path

// set connection vars
const url = process.env.DB_URL || 'mongodb://localhost:27017/pdfStorage'

// import routes
const docRoutes = require('./routes/documents/docRoutes.js')
const userRoutes = require('./routes/users/userRoutes.js')
/**
 * CONNECT TO MONGO DB via MONGOOSE
*/
mongoose.connect(url)
// mongoose.connect('mongodb://localhost:27017/pdfStorage')
  .then(()=>{
    console.log("connection is now open")
    // start express server & listen for requests
    app.listen(3000, () => {
      console.log('app is listening on port 3000')
    })
  })
  .catch(e =>{
    console.log(`failed to connect: ${e}`)
  })

// Define API endpoints
app.use('/docs',userUtils.authenticateJWT, docRoutes)
app.use('/user', userRoutes)