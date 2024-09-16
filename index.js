const expres = require('express')
const http = require('http')
const {Server} = require('socket.io')


const app = expres()
const server=  http.createServer(app)
const io = new Server(server)

app.get('/', (req, res)=>{
    res.sendFile(__dirname + '/index.html')
})

io.on('connection', (socket)=>{
    let nickName = 'Anonymous'

    
    socket.on('set-nickname', (name) => {
        nickName = name;
        socket.broadcast.emit('hi', `${nickName} has joined the chat`);
        socket.emit('server-specific', `Your nickname is set to ${nickName}`);
    });

    socket.on('client', (msg)=>{
        console.log(`${nickName} says: ${msg}`)

        socket.emit('server-specific', 'message from server specific')
        io.emit('server-genralize', `${nickName}: ${msg}`);

    })

    

    socket.on('disconnect', (a)=>{
        console.log('disconnected', a)
        socket.broadcast.emit('hi', `${nickName} has left the chat`);
    })

   

})

server.listen(4000, ()=>{console.log('listening')})
