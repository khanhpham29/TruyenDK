// const httpServer = require("http").createServer();
const io = require("socket.io")();
io.path("/socket.io/manga");
const socketAPI = {}

io.on("connection", function(socket){
    let name = socket.handshake.query["manga-name"]
    socket.join("manga-" + name)
    socket.on("new_post", function(data){
        console.log("Admin posted")
        socket.broadcast.emit("new_post", data)
    })
    socket.on("new_comment", function({ comment, manga }){
        let room = "manga-" + manga['manga-name']
        socket.to(room).emit("new_comment", {
            comment: comment,
            from: socket.id,
        });
    })
    socket.on("reply_comment", function({ replyComment, manga, commentId }){
        let room = "manga-" + manga['manga-name']
        socket.to(room).emit("reply_comment", {
            replyComment: replyComment,
            commentId: commentId,
            from: socket.id,
        });
    })
})
socketAPI.io = io

module.exports = socketAPI