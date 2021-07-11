const socketIO = require('socket.io')
const io = socketIO()
const socketAPI = {}
// your socket logic here

io.on("connection", function(socket){
    console.log("User connected")
    socket.on("new_post", function(data){
        socket.broadcast.emit("new_post", data)
    })
    socket.on("new_comment", function(data){
        socket.broadcast.emit("new_comment", data)
    })
})

socketAPI.io = io

module.exports = socketAPI