import GameMap from "./map.js";

export default class Game {
  constructor() {
    this.squareSize = 20;

    // Canvas
    this.canvas = document.getElementById("game-canvas");
    this.ctx = this.canvas.getContext("2d");

    // Create new Map object.
    this.gameMap = new GameMap(this.squareSize);
  }

  game() {
    // Set the size of canvas.
    this.gameMap.setCanvasSize(this.canvas);
    setInterval(this.#runGame.bind(this), 1000);
  }

  #runGame() {
    this.gameMap.create();
  }
}
