import GameMap from "./map.js";

export default class Game {
  constructor() {
    this.squareSize = 40;

    // Canvas
    this.canvas = document.getElementById("game-canvas");
    this.ctx = this.canvas.getContext("2d");

    // Create new Map object.
    this.gameMap = new GameMap(this.squareSize);
  }

  /** 
  * Call the game.
  * @summary 
  * Allows us to start the game. 
  * This function contains all setup needed for game to run.
  */
  
  game() {
    // Set the size of canvas.
    this.gameMap.setCanvasSize(this.canvas);

    // Run the game once every second.
    setInterval(this.#runGame.bind(this), 1000);
  }

  /** 
  * Run the game.
  * @summary Main function which runs one instance of the game.
  */
  
  #runGame() {
    this.gameMap.create(this.ctx);
  }
}
