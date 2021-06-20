//INICIALIZAMOS EXPRESS
const express = require("express");
const app = express();

require("./config/config")

//CONECTAMOS CON LA BBDD
const mongoose = require("mongoose");

const uri = "mongodb://localhost/chat";
const option = {useNewUrlParser:true, useUnifiedTopology:true};
mongoose.connect(uri, option)
.then(()=> console.log("BBDD conectada"))
.catch(e=> console.log("error db:", e));

//Para hacer uso del body
const bodyparse = require("body-parser");

//  require ("dotenv").config();

app.use(bodyparse.urlencoded({extended:false}));
app.use(bodyparse.json());


//IMPORTAMOS RUTAS
const authRoutes = require("./routes/auth");
const { required } = require("@hapi/joi");



//ROUTES MIDDLEWARES
app.use("/api/user", authRoutes);








app.listen(process.env.PORT, ()=>{
    console.log(`servidor andando en el puerto: ${process.env.PORT}`);
})


