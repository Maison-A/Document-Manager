// init mongoose
const mongoose = require('mongoose') 

// define schema
const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    username:{
        type: String,
    },  
    },
    {
        collection:'tUsers'
    }
)

// compile model
const User = mongoose.model('User', userSchema)

// export
module.exports = Document