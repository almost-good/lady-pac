import GameMap from "./map.js";

/**
 * Game class used to start the game.
 *
 * Public methods:
 *
 *     game()
 *
 * Event methods:
 *
 *     #gameStartEvent
 *     #gamePauseEvent
 *     #resizeGameWhileCoveredEvent
 *
 * Private methods:
 *
 *     #runGame()
 *     #gameInstance()
 *     #createGhosts(ctx, squareSize)
 *     #pause()
 *     #positionGameIntoView()
 */

export default class Game {
  constructor() {
    // Canvas
    this.canvas = document.getElementById("game-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvasCover = document.getElementById("canvas-cover");

    // Create new Map object and Lady Pac.
    this.gameMap = new GameMap();
    [this.ladyPac, this.ghosts] = this.gameMap.getMovingObjects();

    this.browserWidth = window.innerWidth;

    // Event listeners.
    this.canvasCover.addEventListener("mousedown", this.#gameUncoverEvent);
    document.addEventListener("mousedown", this.#gameCoverEvent);
    window.addEventListener("resize", this.#resizeGameWhileCoveredEvent);
  }

  /**
   * Call the game.
   * @summary
   * Allows us to start the game and continue playing it.
   * This function contains all setup needed for game to run.
   */

  game() {
    // Create the game by creating it's instance.
    setTimeout(() => {
      this.#gameInstance();
    }, 100);

    // Run the game once every second.
    //setInterval(this.#runGame.bind(this), 1000 / 60);
  }

  /**
   * Uncover the gaming area, position into view.
   */

  #gameUncoverEvent = (event) => {
    this.canvasCover.classList.add("canvas-cover-out");
    this.#positionGameIntoView();
  };

  /**
   * Cover the gaming area, allow scrolling.
   */

  #gameCoverEvent = (event) => {
    // If click is outside of canvas area, and the game is not covered.
    if (
      !this.canvas.contains(event.target) &&
      !this.canvasCover.contains(event.target) &&
      this.canvasCover.classList.contains("canvas-cover-out")
    ) {
      this.canvasCover.classList.remove("canvas-cover-out");
      document.body.classList.remove("remove-overflow");
    }
  };

  /**
   * Resize the game while the game is covered and not actively running.
   */

  #resizeGameWhileCoveredEvent = (event) => {
    if (!this.canvasCover.classList.contains("canvas-cover-out")) {
      this.#gameInstance();
    }
  };

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

    this.#gameInstance();
  }

  /**
   * One instance of the game. Contains all game objects.
   */

  #gameInstance() {
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
      this.browserWidth = window.innerWidth;
    }, 100);
  }
}
