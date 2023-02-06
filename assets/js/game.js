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
 *     #createGhosts(ctx, squareSize)
 *     #positionGameIntoView()
 */

export default class Game {
  constructor() {
    // Canvas
    this.canvas = document.getElementById("game-canvas");
    this.ctx = this.canvas.getContext("2d");

    // Create new Map object and Lady Pac.
    this.gameMap = new GameMap();
    [this.ladyPac, this.ghosts] = this.gameMap.getMovingObjects();

    this.browserWidth = window.innerWidth;
  }

  /**
   * Call the game.
   * @summary
   * Allows us to start the game and continue playing it.
   * This function contains all setup needed for game to run.
   */

  game() {
    this.#positionGameIntoView();

    // Run the game once every second.
    setInterval(this.#runGame.bind(this), 1000 / 60);
  }

  /**
   * Run the game.
   * @summary Main function which runs one instance of the game.
   */

  #runGame() {
    // If the game area is resized, position back into view.
    let currentWidth = window.innerWidth;
    if (currentWidth != this.browserWidth) {
      this.#positionGameIntoView();
    }

    // Set the size of square, and canvas.
    this.squareSize = this.gameMap.setSquareSize();
    this.gameMap.setCanvasSize(this.canvas, this.squareSize);

    // Create map, Lady Pac and ghosts.
    this.gameMap.create(this.ctx, this.squareSize);
    this.ladyPac.create(this.ctx, this.squareSize);
    this.#createGhosts(this.ctx, this.squareSize);
  }

  /**
   * Loop over ghosts and create each one.
   * @param {object} ctx - Canvas context. The map is drawn inside ctx.
   * @param {number} squareSize - Size of one side of the square.
   */

  #createGhosts(ctx, squareSize) {
    for (let ghost of this.ghosts) {
      ghost.create(ctx, squareSize);
    }
  }

  /**
   * Position game perfectly into view.
   * @summary
   */

  #positionGameIntoView() {
    setTimeout(() => {
      this.canvas.scrollIntoView({ block: "end" });
      document.body.classList.add("remove-overflow");
    }, 100);
  }
}
