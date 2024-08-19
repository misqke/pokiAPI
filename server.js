const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const cors = require("cors");
const { gm } = require("./gameManager.js");
const { createGame, leaveGame, joinGame } = require("./helpers.js");

const PORT = process.env.PORT || 9000;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

// app.use(express.static(path.join(__dirname, "client")));
app.use(express.json({ limit: "50mb", extended: true }));
// app.use(cors({ origin: "http://localhost:3000" }));

io.on("connection", (socket) => {
  console.log(`user connected: ${socket.id}`);

  socket.on("disconnecting", (reason) => {});

  socket.on("disconnect", (reason) => {
    console.log(`user disconnected: ${socket.id}`);
    leaveGame(socket, io);
  });

  socket.on("createGame", (data) => {
    createGame(data, socket);
  });

  socket.on("joinGame", (data) => {
    joinGame(data, socket, io);
  });

  socket.on("leaveGame", () => {
    leaveGame(socket, io);
  });

  socket.on("getGameData", () => {
    const game = gm.getGame(socket.data.code);
    if (game.error) {
      socket.emit("error", game.error);
    }
    socket.emit("gameData", game);
  });
});

server.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
