//INICIALIZAMOS EXPRESS
const express = require("express");
const app = express();
const cors = require("cors");
const path = require('path');

require("./config/config")

//CONECTAMOS CON LA BBDD
const mongoose = require("mongoose");

const uri = "mongodb://localhost/proyect";
const option = {useNewUrlParser:true, useUnifiedTopology:true};
mongoose.connect(uri, option)
.then(()=> console.log("BBDD conectada"))
.catch(e=> console.log("error db:", e));


//HACEMOS USO DEL BODY, RUTAS MIDDLEWARES
const bodyparse = require("body-parser");

app.use(bodyparse.urlencoded({extended:false}));
app.use(bodyparse.json());
app.use(cors());
app.use('/recipes-img', express.static(path.resolve(__dirname, './recipes-img'))); //damos el permiso para qu el cliente pueda acceder a la carpeta imagenes del servidor


//IMPORTAMOS RUTAS
const authRoutes = require("./routes/auth");
const recipes = require("./routes/recipes");
const { required } = require("@hapi/joi");

app.use("/api", authRoutes);
app.use("/api2", recipes);




app.listen(process.env.PORT, ()=>{
    console.log(`servidor andando en el puerto: ${process.env.PORT}`);
})


