import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.use((socket, next) => {
  const username = socket.handshake.auth.name;
  if (!username || username.length <= 2) {
    return next(new Error("Invalid Username"))
  }
  socket.username = username;
  next()
})

io.on("connection", (socket) => {
  
  // process.send({
  //   event: "log message",
  //   message: `Socket ID: ${socket.id}, Username: ${socket.username} - Connected`,
  //   log_level: "info"
  // })
  console.info(`Socket ID: ${socket.id}, Username: ${socket.username} - Connected`)


  const users = [];

  for (let [id, socket] of io.of("/").sockets) {
    users.push({
      userID: id,
      username: socket.username,
      room: null
    });
  }

  // Provide list of users to newly connected client
  socket.emit("users", users);

  // Notify All Users when a user connects
  socket.broadcast.emit("user connected", {
    userID: socket.id,
    username: socket.username,
    room: null
  })

  socket.on("join-room", (roomNum) => {    
    socket.rooms.forEach(room => {
      if (room !== socket.id) {
        socket.leave(room)
      }
    });
    socket.join(roomNum)
    // process.send({
    //   event: "log message",
    //   message: `Socket ID: ${socket.id}, Username: ${socket.username} Joined Room: ${roomNum}`,
    //   log_level: "info"
    // })
    console.info(`Socket ID: ${socket.id}, Username: ${socket.username} - Joined Room: ${roomNum}`)
  })

  // SEND MSG TO ROOM
  socket.on("room-msg", (msgData) => {
    socket.to(msgData.room).emit("room-emit",msgData)
  })

  // DISCONNECT
  socket.on("disconnect", (reason) => {
    socket.broadcast.emit("user disconnected", (socket.id))
    // process.send({
    //   event: "log message",
    //   message: `UserID: ${socket.id}, UserName: ${socket.username}, Disconnected Because: ${reason}`,
    //   log_level: "info"
    // })
    console.info(`Socket ID: ${socket.id}, Username: ${socket.username} - Disconnected Because: ${reason}`)
  })
  
});


io.listen(3000);
console.info("WS: ws://localhost:3000")