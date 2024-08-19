class Game {
  constructor(data) {
    this.code = data.code;
    this.player1 = {
      name: data.name,
      id: data.id,
    };
    this.player2 = null;
    this.started = false;
  }
}

class GameManager {
  constructor() {
    console.log("creating game manager");
    this.games = [];
  }
  createGame(socket, data) {
    const codeExists = this.games.findIndex((g) => g.code == data.code);
    if (codeExists != -1) return { error: "A game with this code exists" };
    data.id = socket.id;
    const game = new Game(data);
    this.games.push(game);
    return game;
  }
  joinGame(socket, data) {
    const game = this.games.find((g) => g.code == data.code);
    if (!game) return { error: "Game not found." };
    game.player2 = {
      name: data.name,
      id: socket.id,
    };
    return game;
  }
  leaveGame(socket) {
    const game = this.games.find((g) => g.code == socket.data.code);
    if (game) {
      if (socket.id == game.player1.id) {
        if (game.player2 != null) {
          game.player1 = { ...game.player2 };
          game.player2 = null;
        } else {
          this.removeGame(socket.data.code);
        }
      } else if (socket.id == game.player2.id) {
        game.player2 = null;
      }
    }

    return game;
  }
  getGame(code) {
    const game = this.games.find((g) => g.code == code);
    if (!game) return { error: "Game not found" };
    return game;
  }
  updateGame(updatedGame) {
    const game = this.games.find((g) => g.code == updatedGame.code);
    if (!game) return { error: "Game not found" };
    game = updatedGame;
  }
  removeGame(code) {
    const game = this.games.find((g) => g.code == code);
    if (!game) return { error: "Game not found" };
    this.games = this.games.filter((g) => g.code != code);
    return { success: true };
  }
}

const gm = new GameManager();

module.exports = { gm };
