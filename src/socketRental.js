const io = require("socket.io")();
io.path("/socket.io/rental");
const socketAPI = {}

io.on("connection", function(socket){
    socket.on("cart", function( data ) {
        io.emit("cart-list", data)
    })
})
socketAPI.io = io
module.exports = socketAPI