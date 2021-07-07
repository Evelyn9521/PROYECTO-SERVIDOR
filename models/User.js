const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        max:120
    },

    lastname: {
        type: String,
        required: true,
        max:120
    },

    email: {
        type: String,
        required: true,
        
        max:120
    },

    password: {
        type: String,
        required: true,
        min: 8,
        max:1024
    },

    date: {
        type: Date,
        default: Date.now
    },

})

module.exports = mongoose.model("User", userSchema)