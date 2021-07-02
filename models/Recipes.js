const mongoose = require("mongoose");

const recipesSchema = mongoose.Schema({
    image: {
        type: String
    },

    name: {
        type: String,
    },

    description: {
        type: String,
    },


});

module.exports = mongoose.model("Recipes", recipesSchema)