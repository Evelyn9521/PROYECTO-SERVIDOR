const mongoose = require("mongoose");

const recipesSchema = mongoose.Schema({
    photo: {
        type: String
    },

    name: {
        type: String,
    },

    description: {
        type: String,
    },

    date: {
        type: Date,
        default: Date.now
    },

});

module.exports = mongoose.model("Recipes", recipesSchema)