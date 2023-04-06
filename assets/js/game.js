import GameMap from "./map.js";

/**
 * Game class used to start the game.
 *
 * Public methods:
 *
 *     clear()
 *     game()
 *
 * Event methods:
 *
 *     #gameUncoverEvent
 *     #gameCoverEvent
 *     #resizeGameWhileCoveredEvent
 *
 * Private methods:
 *
 *     #runGame()
 *     #gameInstance()
 *     #createGhosts(ctx, squareSize)
 *     #pause()
 *     #isGameOver()
 *     #gameIsOver(result, soundEffect)
 *     #showWinLoseScreen(gameResult)
 *     #positionGameIntoView()
 */

export default class Game {
  constructor(app, currentScore) {
    this.app = app;

    // Canvas.
    this.canvas = document.getElementById("game-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.canvasCover = document.getElementById("canvas-cover");

    // Current score
    this.currentScore = currentScore

    // Create new Map object, Lady Pac and ghosts.
    this.gameMap = new GameMap(this.currentScore);
    [this.ladyPac, this.ghosts] = this.gameMap.getMovingObjects();

    // Initial browser width.
    this.browserWidth = window.innerWidth;

    // Game results.
    this.gameOver = false;
    this.gameWin = false;
    this.gameLose = false;
    this.gameResult = "";

    // Sounds.
    this.gameLoseSound = new Audio("./assets/sounds/game-lose-sound.wav");
    this.gameWinSound = new Audio("./assets/sounds/game-win-sound.wav");

    // Event listeners.
    this.canvasCover.addEventListener("mousedown", this.#gameUncoverEvent);
    document.addEventListener("mousedown", this.#gameCoverEvent);
    window.addEventListener("resize", this.#resizeGameWhileCoveredEvent);
  }

  /**
   * Clears all event listeners.
   */

  clear() {
    this.canvasCover.removeEventListener("mousedown", this.#gameUncoverEvent);
    document.removeEventListener("mousedown", this.#gameCoverEvent);
    window.removeEventListener("resize", this.#resizeGameWhileCoveredEvent);
  }

  /**
   * Call the initial instance of the game to be shown on screen.
   * @summary Timeout ensures everything is loaded when displaying upon screen.
   */

  game() {
    setTimeout(() => {
      this.#gameInstance();
    }, 30);
  }

  /**
   * Uncover the gaming area, position into view and run the game.
   */

  #gameUncoverEvent = (event) => {
    this.canvasCover.classList.add("canvas-cover-out");
    this.#positionGameIntoView();
    clearInterval(this.gameLoop);
    
    this.uncoverActive = true
    this.gameLoop = setInterval(this.#runGame.bind(this), 1000 / 60);
  };

  /**
   * Cover the gaming area, allow scrolling and stop the game.
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
      
      this.uncoverActive = false
      clearInterval(this.gameLoop);
    }
  };

  /**
   * Resize the game while the game is covered and not actively running.
   * @summary If the game is running this will result in moving Objects slightly moving.
   * This is due to differences in square sizes and number of steps each move takes.
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
    this.gameMap.create(this.ctx, this.squareSize, this.gameOver);
    this.ladyPac.create(this.ctx, this.squareSize);
    this.#createGhosts(this.ctx, this.squareSize);

    // Check if it is game over.
    this.#isGameOver();
  }

  /**
   * Loop over ghosts and create each one.
   * @param {object} ctx - Canvas context. The map is drawn inside ctx.
   * @param {number} squareSize - Size of one side of the square.
   */

  #createGhosts(ctx, squareSize) {
    for (let ghost of this.ghosts) {
      ghost.create(ctx, squareSize, this.#pause(), this.ladyPac);
    }
  }

  /**
   * Pause is triggered if Lady Pac didn't make initial movement, player lost a life or game is over.
   * @return {boolean} Return true if the pause is triggered, otherwise false.
   */

  #pause() {
    return !this.ladyPac.initialMove || this.gameMap.loseLife || this.gameOver || !this.uncoverActive;
  }

  /**
   * Check if the game is over, and if it is a lose or a win.
   */

  #isGameOver() {
    // If there are no more lifes left, the game is lost.
    if (!this.gameMap.lifes && !this.gameOver) {
      this.#gameIsOver("lose", this.gameLoseSound);
    } else if (!this.gameMap.pelletNumber && !this.gameOver) {
      // If there are no more pellets left, the game is won.
      this.#gameIsOver("win", this.gameWinSound);
    }
  }

  /**
   * If the game is over play the sound and display win/lose screen.
   * @param {string} result - Result of the game. Can be: win/lose.
   * @param {object} soundEffect - Sound effect object which will play upon game completion.
   */

  #gameIsOver(result, soundEffect) {
    this.gameOver = true;
    this.gameResult = result;
    this.gameMap.playSound(soundEffect);

    setTimeout(this.#showWinLoseScreen.bind(this), 500, this.gameResult);
    clearInterval(this.gameLoop);
  }

  /**
   * Call the right screen to be displayed.
   * @param {string} gameResult - Result of the game. Can be: win/lose.
   */

  #showWinLoseScreen(gameResult) {
    this.app.winLoseScreen(gameResult);
    document.getElementById("win-lose").classList.remove("hide");
    this.gameOver = false;
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
