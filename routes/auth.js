const router = require("express").Router();

const User = require("../models/User");

const bcrypt = require("bcrypt"); //encriptar la contraseña

const jwt = require("jsonwebtoken");

const ramda = require("ramda");

require("../config/config")

const joi = require("@hapi/joi"); //validar datos
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
router.post("/login", async (req, res) => {

    const { error } = schemaLogin.validate(req.body)
    if (error) return res.status(400).json({ error: error.details[0].message })

    const user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).json({ error: true, message: "email incorrecto" })

    const passValida = await bcrypt.compare(req.body.password, user.password)
    if (!passValida) return res.status(400).json({ error: true, message: "contraseña incorrecta" })


    jwt
    const token = jwt.sign(
        {
            user: user.name,
            expiresIn: 60 * 60 * 24
        }, process.env.SEED);

    res.json({
        error: null,
        message: "Bienvenido",
        token: token,
        user: user
    }) 
})


//REGISTRO DE USUARIOS
router.post("/register", async (req, res) => {

    //Validaciones de usuario
    const { error } = schemaRegister.validate(req.body)
    if (error) {
        return res.status(400).json({ error: error.details[0].message })
    }

    const existeEmail = await User.findOne({ email: req.body.email })
    if (existeEmail) return res.status(400).json({ error: true, message: "email ya registrado" })



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
            error: null,
            data: userDB
        })

    } catch (error) {
        res.status(400).json(error)
    }


});


//ACTUALIZAR USUARIOS
router.put("/edit", (req, res) => {
  
    const id = req.params.id;
    const body = ramda.pick(["name", "lastname", "password"], req.body);

    User.findByIdAndUpdate(
        id,
        body,
        { new: true, runValidators: true, context: 'query' }, // options
        (error, updatedUser) => {
            if (error) {
                res.status(400).json({ ok: false, error });
            } else {
                res.status(200).json({ ok: true, updatedUser });
            }
        }
    )
     });

//ELIMINAR USUARIOS
router.delete("/delete", (req, res) => {
    const id = req.params.id;
    
    console.log(id);

    User.findByIdAndDelete(id, {}, (error, removedUser) => {
        if(error) {
            res.status(400).json({ok: false, error});

        } else if (!removedUser){
            res.status(400).json({ok: false, error: "Usuario no encontrado"});
            
        } else {
            res.status(204).json({ok: true, removedUser});
        }
    })
});




module.exports = router;