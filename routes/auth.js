const router = require("express").Router();

const User = require("../models/User");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

require("../config/config")

const joi = require("@hapi/joi");
const schemaRegister = joi.object({
    name: joi.string().min(3).max(120).required(),
    lastname: joi.string().min(3).max(120).required(),
    email: joi.string().min(6).max(120).required().email(),
    password: joi.string().min(8).max(1024).required()
})

const schemaLogin = joi.object({
    email: joi.string().min(6).max(120).required().email(),
    password: joi.string().min(8).max(1024).required()
})



//LOGIN
router.post("/login", async(req, res)=>{

    const {error} = schemaLogin.validate(req.body)
    if (error) return res.status(400).json({error: error.details[0].message})
    
    const user = await User.findOne({email: req.body.email})
    if(!user) return res.status(400).json({error: true, message: "email incorrecto"})

    const passValida = await bcrypt.compare(req.body.password, user.password)
    if(!passValida) return res.status(400).json({error: true, message: "contraseña incorrecta"})

    //jwt
    const token = jwt.sign(
        {user: user.name,
        expiresIn: 60 * 60 * 24
        },process.env.SEED);
    
        res.json({
            error: null,
            message: "Bienvenido",
            token: token
        })
})




//REGISTRO DE USUARIOS
router.post("/register", async(req, res)=>{

    //Validaciones de usuario
    const {error} = schemaRegister.validate(req.body)
    if (error){
        return res.status(400).json({error: error.details[0].message})
    }

    const existeEmail = await User.findOne({email: req.body.email})
    if(existeEmail) return res.status(400).json({error: true, message: "email ya registrado"})
  


    //Encriptamos contraseñas
     const saltos = await bcrypt.genSalt(10);
     const password = await bcrypt.hash(req.body.password, saltos)


    const user = new User({
        name: req.body.name,
        lastname: req.body.lastname,
        email: req.body.email,
        password: password
    })

    try {
        const userDB = await user.save();
        res.json({
            error:null,
            data: userDB
        })
        
    } catch (error) {
        res.status(400).json(error)
    }

  
});



module.exports = router;