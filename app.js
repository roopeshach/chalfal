const express = require('express');
const socketio = require('socket.io');
const app = express()
const http = require('http')
const path = require('path');
const port = 8000;
const formatMessage = require('./utils/message')
const {userJoin , getCurrentUser , userLeave , getRoomUsers} = require('./utils/user')


const server = http.createServer(app)
const io = socketio(server)

app.use(express.static(path.join(__dirname , 'public')));


const botName = 'Jigree'


io.on('connection', socket =>{

    socket.on('joinroom' , ({username , room}) =>{
        const user = userJoin(socket.id , username , room);
        socket.join(user.room);


        socket.on('disconnect', () =>{
            const user = userLeave(socket.id);

            if(user){
                io.to(user.room).emit('message' , formatMessage(botName, `${user.username} has left the chat`))
            }
            
        }) 

        //on message changes 
        socket.on('chatMessage' , msg=>{
            const user = getCurrentUser(socket.id)

            io.to(user.room).emit('message' , formatMessage(user.username , msg))
        })
        //Welcome current user
        socket.emit('message' , formatMessage(botName, 'CHitchat ma swagat xa'))
        //broadcast when user joins room
        socket.broadcast
        .to(user.room)
        .emit('message', formatMessage(botName, ` ${user.username} has hoined`))

        //send users and room info
        io.to(user.room).emit('roomUsers', {
            room : user.room,
            users : getRoomUsers(user.room),
        })
    })

})

server.listen(port , ()=>{
    console.log(`Server started on port ${port}`)
})