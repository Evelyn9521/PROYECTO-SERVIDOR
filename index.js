//INICIALIZAMOS EXPRESS
const express = require("express");
const app = express();
const cors = require("cors");
const path = require('path');

require("./config/config")

const http = require('http'); //es necesario para conectarnos con socket.io
const servidor = http.createServer(app);

//CONECTAMOS A SOCKET
const socketio = require("socket.io");
const io = socketio(servidor);

//ESTABLECEMOS LA CONEXIÓN A SOCKET PARA EL CHAT
io.on("connection", (socket) => {
    let nombre;
  
    socket.on("conectado", (nomb) => {
      nombre = nomb;
      //socket.broadcast.emit manda el mensaje a todos los clientes excepto al que ha enviado el mensaje
      socket.broadcast.emit("mensajes", {
        nombre: nombre,
        mensaje: `${nombre} ha entrado en la sala del chat`,
      });
    });
  
    socket.on("mensaje", (nombre, mensaje) => {
      //io.emit manda el mensaje a todos los clientes conectados al chat
      io.emit("mensajes", { nombre, mensaje });
    });
  
    socket.on("disconnect", () => {
      io.emit("mensajes", {
        servidor: "Servidor",
        mensaje: `${nombre} ha abandonado la sala`,
      });
    });
  });



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

//servidor.listen(5000, () => console.log("Servidor inicializado"));

