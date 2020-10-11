const express =  require('express') ;
const http = require('http');
const path  = require('path') ;
const socketio = require('socket.io') ;
const { generateMessage }= require('./utils/messages');
const {addUser , removeUser , getUser , getUserInRoom} =require('./utils/users');

const app = express() ;
const server = http.createServer(app) ; //explicity created because socketio uses a server as input so to give that we need to create 
const io = socketio(server) ;


const port = process.env.PORT || 3000 ;
const publicPathDirectory = path.join(__dirname,'../public') ;

app.use(express.static(publicPathDirectory)) ;


io.on('connection',(socket)=>{
    console.log('New web socket connection') ;
    
    socket.on('join',({username,room},callback)=>{

        const {error,user} = addUser({ id:socket.id, username,room})
        if(error){
            return callback(error)
        }


        //alow us to join the chatroom we want to join 
        socket.join(user.room);

        socket.emit('message',generateMessage('Admin','WELCOME'));
        socket.broadcast.to(user.room).emit('message',generateMessage('Admin',` ${user.username} has joined the room`));
        io.to(user.room).emit('roomData',{
            room: user.toom,
            users: getUserInRoom(user.room)
        })
        callback()
        //io.to.emit-> emits msg to everybody in a room
        //socket.broadcast.io-> sending to everyone except to specific client 
        // in a chat room

    })
   
    socket.on('sendMessage',(inp,callback)=>{
        const user = getUser(socket.id) ;
        io.to(user.room).emit('message',generateMessage(user.username ,inp));

        callback(); 
    });

    // socket.on('sendLocation',(location)=>{
    //     io.emit('message',`https://google.com/maps?${location.latitude},${location.longitude}`);
    // })

    // when disconnects buit-in events
    // when it gets called that means that user 
    // has already left so no need to send 
    // boradcast simply send it willsend to every except you 
    socket.on('disconnect',()=>{
        const user = removeUser(socket.id) ;
        
        if(user){
            io.to(user.room).emit('message',generateMessage('Admin' ,`${user.username} has left `));
            io.to(user.room).emit('roomData',{
                room: user.room,
                users: getUserInRoom(user.room)
            })
    }
    });
}) ;



server.listen(port ,()=>{
    console.log(`Server is running ${port}`) ;
}) ;



