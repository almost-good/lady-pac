import { MoveDirection } from "./constants.js";

/**
 * Ghost object.
 *
 * Conatins all information about Ghost.
 *
 * Public methods:
 *
 *     create(ctx, squareSize)
 *
 * Private methods:
 *
 *     #move(squareSize)
 *     #getImages()
 *     #random(min, max)
 */

export default class Ghost {
  constructor(speed, column, row, gameMap) {
    this.speed = speed;

    this.column = column;
    this.row = row;
    this.gameMap = gameMap;

    // Initial move direction is random.
    this.moveDirection = this.#random(0, 4);

    // How much Ghost moved.
    this.xMoveSteps = 0;
    this.yMoveSteps = 0;

    // Timers.
    this.moveTimerDef = this.#random(10, 50);
    this.moveTimer = this.moveTimerDef;

    this.#getImages();
  }

  /**
   * Create Ghost and all it's content and functionalities.
   * @param {object} ctx - Canvas context.
   * @param {number} squareSize - Size of one side of the square.
   */

  create(ctx, squareSize) {
    if (!this.xPosition && !this.yPosition) {
      this.xPosition = this.column * squareSize;
      this.yPosition = this.row * squareSize;
    }

    this.#move(squareSize);

    ctx.drawImage(
      this.ghostImg,
      this.xPosition,
      this.yPosition,
      squareSize,
      squareSize
    );
  }

  /**
   * Ghost movement.
   *
   * @param {number} squareSize - Size of one side of the square.
   */

  #move(squareSize) {
    // If the ghost did not bump into wall, then move.
    if (
      !this.gameMap.bumpIntoWall(
        this.xPosition,
        this.yPosition,
        this.moveDirection,
        squareSize
      )
    ) {
      // Ghost movement.
      switch (this.moveDirection) {
        case MoveDirection.up:
          // To move up subtract speed from yPosition.
          this.yPosition -= this.speed;
          this.yMoveSteps -= this.speed;
          break;
        case MoveDirection.down:
          this.yPosition += this.speed;
          this.yMoveSteps += this.speed;
          break;
        case MoveDirection.left:
          this.xPosition -= this.speed;
          this.xMoveSteps -= this.speed;
          break;
        case MoveDirection.right:
          this.xPosition += this.speed;
          this.xMoveSteps += this.speed;
      }
    }
  }

  /**
   * Get all images and allow for their access.
   */

  #getImages() {
    const ghostNormalImg = new Image();
    ghostNormalImg.src = "./assets/img/game/ghost-normal.png";

    const ghostFoodImg = new Image();
    ghostFoodImg.src = "./assets/img/game/ghost-food.png";

    const ghostSwitchingImg = new Image();
    ghostSwitchingImg.src = "./assets/img/game/ghost-switching.png";

    this.ghostImg = ghostNormalImg;
  }

  /**
   * Get the random number between two numbers.
   * @param {number} min - Minimum value.
   * @param {number} max - Maximum value.
   * @return {number} Random number between min and max.
   */

  #random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
