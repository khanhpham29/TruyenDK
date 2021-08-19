// const httpServer = require("http").createServer();
const io = require("socket.io")();
io.path("/socket.io/notify");
const socketAPI = {}

io.on("connection", function(socket){
    if (typeof socket.handshake.query["mangas"] != "undefined") {
        let mangas = socket.handshake.query["mangas"]; 
        mangas = mangas.split(",");
        socket.join(mangas);
    }
    socket.on("new_notify", function({ chapter, manga, createdAt }){
        socket.to(manga._id).emit("new_notify", {
            chapter: chapter,
            manga: manga,
            createdAt: createdAt,
            from: socket.id,
        });
    });
})
socketAPI.io = io

module.exports = socketAPI