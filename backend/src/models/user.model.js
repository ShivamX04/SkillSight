const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { 
        type: String,
        unique: [true, 'Name must be unique'],
        required: true
    },  
    email: {
        type: String,
        required: true,                                                                     
        unique: [true, 'Email must be unique'],
        match: /^\S+@\S+\.\S+$/
    },
    password: { 
        type: String,
        required: true,
    }

}, { timestamps: true });

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;