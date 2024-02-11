const express = require('express');

const http = require('http')
const maestros = require('./routes/maestros.routes')
const alumnos = require('./routes/alumnos.routes')
const dbConnection = require('./database/dbconfig')
const cors = require('cors')
require('dotenv').config()

const app = express();
app.use(cors())
const server=http.createServer(app);
const io= require('socket.io')(server,{
    cors:{
        origin:'http://localhost:5173'
    }
})

app.use(express.json())
const PORT = process.env.PORT || 3001;
let activeRooms = {};
//rutas------------------------------------
app.use('/maestros', maestros )
app.use('/alumnos', alumnos)
app.get('/rooms', (req, res) => {
  
    const checkForUpdates = () => {
      if (Object.keys(activeRooms).length > 0) {
      
        const rooms = Object.keys(activeRooms);
        res.json(rooms);
      } else {
       
        setTimeout(checkForUpdates, 10000); 
      }
    };
  
  
    checkForUpdates();
  });
  
  
dbConnection

//socket.io------------------------------------------------


const lastMessages = [];

io.on("connection", (socket) => {
  console.log('cliente conectado');

  socket.on("joinRoom", (room) => {
    socket.join(room);
    console.log(`Cliente ${socket.id} se unió a la sala: ${room}`);
    
        if (!activeRooms[room]) {
            activeRooms[room] = true;
        }

    const recentMessagesForRoom = lastMessages.filter(msg => msg.room === room);
    socket.emit("recentMessages", recentMessagesForRoom);
  });

  socket.on("message", (data) => {
    console.log("Nuevo mensaje recibido:", data);
    const newMessage = {
      body: data.body,
      from: socket.id.slice(6),
      room: data.room,
    };

    lastMessages.push(newMessage);
    if (lastMessages.length > 10) {
      lastMessages.shift();
    }

    io.to(data.room).emit("message", newMessage);
  });

  socket.on("leaveRoom", (room) => {
    socket.leave(room);
    console.log(`Cliente ${socket.id} salió de la sala: ${room}`);
  });
});

//server corriendo

server.listen(PORT, ()=>{
    console.log(`server corriendo en el puerto ${PORT}`)
});