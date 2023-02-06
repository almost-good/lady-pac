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
 *     #pause()
 *     #positionGameIntoView()
 */

export default class Game {
  constructor() {
    // Canvas
    this.canvas = document.getElementById("game-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvasCover = document.getElementById('canvas-cover')

    // Create new Map object and Lady Pac.
    this.gameMap = new GameMap();
    [this.ladyPac, this.ghosts] = this.gameMap.getMovingObjects();

    this.browserWidth = window.innerWidth;

    // Event listeners.
    this.canvasCover.addEventListener("mousedown", this.#gameStartEvent);
  }

  /**
   * Call the game.
   * @summary
   * Allows us to start the game and continue playing it.
   * This function contains all setup needed for game to run.
   */

  game() {
    // Create the game by running it only once.
    setTimeout(() => {
      this.#runGame()
    }, 100);
    
    // Run the game once every second.
    //setInterval(this.#runGame.bind(this), 1000 / 60);
  }

  #gameStartEvent = (event) => {
    this.canvasCover.classList.add('canvas-cover-out')
    this.#positionGameIntoView();
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
      ghost.create(ctx, squareSize, this.#pause());
    }
  }

  /**
   * Pause is triggered if Lady Pac didn't make initial movement.
   * @return {boolean} Return true if the pause is triggered, otherwise false.
   */

  #pause() {
    return !this.ladyPac.initialMove;
  }

  /**
   * Position game perfectly into view.
   */

  #positionGameIntoView() {
    setTimeout(() => {
      this.canvas.scrollIntoView({ block: "end" });
      document.body.classList.add("remove-overflow");
    }, 100);
  }
}
