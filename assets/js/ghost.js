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
 *     #setPosition(squareSize)
 *     #adjustPosition(squareSize)
 *     #calcStepDiff(moveSteps, squareSize)
 *     #move(squareSize)
 *     #changeMoveDirection(squareSize)
 *     #resetMoveSettings()
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
    this.moveDirection = this.#random(0, 3);

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
    // If positions are not defined, define them.
    if (!this.xPosition && !this.yPosition) {
      this.#setPosition(squareSize);
    }

    // If the screen is resized, "remember" ghost position prior to resize.
    // Adjust the speed.
    if (this.squarePreResize != squareSize) {
      this.#adjustPosition(squareSize);
      this.speed = this.gameMap.setSpeed();
    }

    this.#move(squareSize);
    this.#changeMoveDirection(squareSize);
    ctx.drawImage(
      this.ghostImg,
      this.xPosition,
      this.yPosition,
      squareSize,
      squareSize
    );
  }

  /**
   * Set x and y positions, set square pre resize size.
   * @summary
   * If ghost moved, then add offset to the original position.
   * @param {number} squareSize - Size of one side of the square.
   * @param {number} xOffset - OPTIONAL. X coordinate offset value.
   * @param {number} yOffset - OPTIONAL. Y coordinate offset value.
   */

  #setPosition(squareSize, xOffset = 0, yOffset = 0) {
    this.xPosition = this.column * squareSize + xOffset;
    this.yPosition = this.row * squareSize + yOffset;
    this.squarePreResize = squareSize;
  }

  /**
   * Adjust Ghost position after square size changes it's value.
   * @summary Allows ghost to remain on exact same position in map,
   * after square size has changed as a result of screen being resized.
   * @param {number} squareSize - Size of one side of the square.
   */

  #adjustPosition(squareSize) {
    // Get the step difference.
    let xStepDiff = this.#calcStepDiff(this.xMoveSteps, squareSize);
    let yStepDiff = this.#calcStepDiff(this.yMoveSteps, squareSize);

    // Set new ghost position adjusted for screen resize.
    this.#setPosition(
      squareSize,
      this.xMoveSteps - xStepDiff,
      this.yMoveSteps - yStepDiff
    );

    // Refresh the number of steps ghost made to match current square size.
    this.xMoveSteps -= xStepDiff;
    this.yMoveSteps -= yStepDiff;
  }

  /**
   * Calculate step difference that comes with differently sized squares.
   * @param {number} moveSteps - Number of steps from original position.
   * @param {number} squareSize - Size of one side of the square.
   * @return {number} Step difference.
   */

  #calcStepDiff(moveSteps, squareSize) {
    let squareSizeDiff = this.squarePreResize - squareSize;
    let diff = Math.round((moveSteps / this.squarePreResize) * squareSizeDiff);

    // If the speed is two, diff has to be pair number,
    // othervise ghost will go out of the position.
    return diff - (diff % this.speed);
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
   * Change move direction. Call until the direction is changed.
   * @param {number} squareSize - Size of one side of the square.
   */

  #changeMoveDirection(squareSize) {
    this.newMoveDirection = null;
    this.moveTimer--;

    // Reset timer and new move direction.
    if (this.moveTimer === 0) {
      this.#resetMoveSettings();
    }

    // Change move direction.
    if (
      this.newMoveDirection != null &&
      this.moveDirection != this.newMoveDirection
    ) {
      if (
        this.gameMap.positionInMiddleOfSquare(
          this.xPosition,
          this.yPosition,
          squareSize
        )
      ) {
        // Check if ghost did not bump into wall.
        if (
          !this.gameMap.bumpIntoWall(
            this.xPosition,
            this.yPosition,
            this.newMoveDirection,
            squareSize
          )
        ) {
          this.moveDirection = this.newMoveDirection;
        } else {
          // Run again, until the direction is changed.
          this.moveTimer === 1;
          this.#changeMoveDirection(squareSize);
        }
      }
    }
  }

  /**
   * Reset move settings.
   */

  #resetMoveSettings() {
    this.moveTimerDef = this.#random(1, 15);
    this.moveTimer = this.moveTimerDef;

    this.newMoveDirection = this.#random(0, 4);
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
    return Math.floor(Math.random() * (max - min)) + min;
  }
}
