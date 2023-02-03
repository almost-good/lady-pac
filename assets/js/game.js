import GameMap from "./map.js";

/**
 * Game class used to start the game.
 * 
 * Public methods:
 * 
 *     game()
 * 
 * Private methods:
 *
 *     #runGame()
 */

export default class Game {
  constructor() {
    // Canvas
    this.canvas = document.getElementById("game-canvas");
    this.ctx = this.canvas.getContext("2d");

    // Create new Map object.
    this.gameMap = new GameMap();
  }

  /** 
  * Call the game.
  * @summary 
  * Allows us to start the game and continue playing it. 
  * This function contains all setup needed for game to run.
  */
  
  game() {
    // Run the game once every second.
    setInterval(this.#runGame.bind(this), 1000);
  }

  /** 
  * Run the game.
  * @summary Main function which runs one instance of the game.
  */
  
  #runGame() {
    // Set the size of square, and canvas.
    this.gameMap.setSquareSize()
    this.gameMap.setCanvasSize(this.canvas);

    // Create map and it's content.
    this.gameMap.create(this.ctx);
  }
}
