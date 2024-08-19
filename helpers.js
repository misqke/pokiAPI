const { gm } = require("./gameManager.js");

const createGame = (data, socket) => {
  const game = gm.createGame(socket, data);
  if (game.error) {
    socket.emit("error", game.error);
    return;
  }
  socket.data = data;
  socket.join(game.code);
  socket.emit("joinGame", game);
  console.log(`player ${game.player1.name} created game called: ${game.code}`);
};

const leaveGame = (socket, io) => {
  if (socket?.data?.code) {
    const game = gm.leaveGame(socket);
    if (game) {
      io.to(game.code).emit("gameData", game);
    }
    socket.data = null;
    socket.leave(game.code);
  }
};

const joinGame = (data, socket, io) => {
  const game = gm.joinGame(socket, data);
  if (game.error) {
    socket.emit("error", game.error);
    return;
  }
  socket.data = data;
  socket.join(game.code);
  socket.emit("joinGame", game);
  console.log(`player ${game.player2.name} joined game: ${game.code}`);
  io.to(data.code).emit("gameData", game);
};

module.exports = { createGame, leaveGame, joinGame };
