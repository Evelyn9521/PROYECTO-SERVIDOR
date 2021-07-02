const router = require("express").Router();

const Recipe = require("../models/Recipes");


//LOGIN
router.get("/recipes", async (req, res) => {


    const recipes = await Recipe.find({});
    if (recipes) return res.status(200).json({recipes})

})
     
     

module.exports = router;

