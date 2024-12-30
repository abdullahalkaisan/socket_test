

const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
const PORT = process.env.PORT || 5000;

const http = require('http');
const server = http.createServer(app);


server.listen(3001, ()=> {
    console.log('server is running...', PORT)
})


// https://subtle-klepon-055560.netlify.app/

const {Server} = require('socket.io');
const io = new Server (server, {
    cors:{
        origin:"http://localhost:5173",
        // origin:"https://subtle-klepon-055560.netlify.app/",
        methods:["GET","PUT","POST","PATCH","DELETE"]
    }
})


// buld in event id : connection, disconnect

io.on('connection', (socket)=>{
    // console.log(socket.id);

    socket.on('join_room', (data)=>{
        socket.join(data);
        console.log(`The user id is ${socket.id} and the room ID is ${data}`);
    })

    socket.on('sent_message', (data)=>{
        // emit is use for sending data and we're sending data to frontend 
        // socket.to() sends a message to all sockets in a specific room, except the sender. 
        socket.to(data.roomId).emit("receive_message", data)
        // console.log(`Message data is`, data);
    })

    socket.on('disconnect', ()=>{
        console.log("user disconnected", socket.id);
        
    })
})