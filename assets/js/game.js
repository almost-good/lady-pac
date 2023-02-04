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

    // Create new Map object and Lady Pac.
    this.gameMap = new GameMap();
    this.ladyPac = this.gameMap.getLadyPac();
  }

  /**
   * Call the game.
   * @summary
   * Allows us to start the game and continue playing it.
   * This function contains all setup needed for game to run.
   */

  game() {
    // Scroll the game into position when playing it.
    window.onscroll = (event) => {
      this.canvas.scrollIntoView({ block: "end" });
    };

    // Run the game once every second.
    setInterval(this.#runGame.bind(this), 1000/50);
  }

  /**
   * Run the game.
   * @summary Main function which runs one instance of the game.
   */

  #runGame() {
    // Set the size of square, and canvas.
    this.squareSize = this.gameMap.setSquareSize();
    this.gameMap.setCanvasSize(this.canvas, this.squareSize);

    // Create map, create Pacman.
    this.gameMap.create(this.ctx, this.squareSize);
    this.ladyPac.create(this.ctx, this.squareSize);
  }
}
