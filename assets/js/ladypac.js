import { MoveDirection } from "./constants.js";

/**
 * Lady Pac object.
 *
 * Conatins all information about Lady Pac.
 *
 * Public methods:
 *
 *     create(ctx, squareSize)
 *
 * Event methods:
 *
 *     #checkKeyPressedEvent
 *
 * Private methods:
 *
 *     #setPosition(squareSize)
 *     #adjustPosition(squareSize)
 *     #calcStepDiff(moveSteps, squareSize)
 *     #move(squareSize)
 *     #compareMoveAndCheckDirection(squareSize)
 *     #positionInMiddleOfSquare(squareSize)
 *     #getImages()
 */

export default class LadyPac {
  constructor(speed, column, row, gameMap) {
    this.speed = speed;

    this.column = column;
    this.row = row;
    this.gameMap = gameMap;

    // Moving directions
    this.moveDirection = null;
    this.checkDirection = null;

    // How much Lady Pac moved
    this.xMoveSteps = 0;
    this.yMoveSteps = 0;

    // Event listeners
    document.addEventListener("keydown", this.#checkKeyPressedEvent);

    this.#getImages();
  }

  /**
   * Create Lady Pac and all it's content.
   * @param {object} ctx - Canvas context.
   * @param {number} squareSize - Size of one side of the square.
   */

  create(ctx, squareSize) {
    // If positions are not defined, define them.
    if (!this.xPosition && !this.yPosition) {
      this.#setPosition(squareSize);
    }

    // If the screen is resized, "remember" lady pac position prior to resize.
    if (this.squarePreResize != squareSize) {
      this.#adjustPosition(squareSize);
    }

    this.#move(squareSize);

    ctx.drawImage(
      this.ladyPacImgs[this.ladyPacImgIndex],
      this.xPosition,
      this.yPosition,
      squareSize,
      squareSize
    );
  }

  /**
   * Check which key was pressed event.
   * Set the position to be checked and if applicable set the move direction.
   */

  #checkKeyPressedEvent = (event) => {
    // Up key.
    if (event.keyCode === 38) {
      if (this.moveDirection === MoveDirection.down) {
        this.moveDirection = MoveDirection.up;
      }
      this.checkDirection = MoveDirection.up;
    }

    // Down key.
    if (event.keyCode === 40) {
      if (this.moveDirection === MoveDirection.up) {
        this.moveDirection = MoveDirection.down;
      }
      this.checkDirection = MoveDirection.down;
    }

    // Left key.
    if (event.keyCode === 37) {
      if (this.moveDirection === MoveDirection.right) {
        this.moveDirection = MoveDirection.left;
      }
      this.checkDirection = MoveDirection.left;
    }

    // Right key.
    if (event.keyCode === 39) {
      if (this.moveDirection === MoveDirection.left) {
        this.moveDirection = MoveDirection.right;
      }
      this.checkDirection = MoveDirection.right;
    }
  };

  /**
   * Set x and y positions, set square pre resize size.
   * @summary
   * If Lady Pac moved, then add offset to the original position.
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
   * Adjust Lady Pac position after square size changes it's value.
   * @summary Allows Lady Pac to remain on exact same position in map,
   * after square size has changed as a result of screen being resized.
   * @param {number} squareSize - Size of one side of the square.
   */

  #adjustPosition(squareSize) {
    // Get the step difference.
    let xStepDiff = this.#calcStepDiff(this.xMoveSteps, squareSize);
    let yStepDiff = this.#calcStepDiff(this.yMoveSteps, squareSize);

    // Set new Lady Pac position adjusted for screen resize.
    this.#setPosition(
      squareSize,
      this.xMoveSteps - xStepDiff,
      this.yMoveSteps - yStepDiff
    );

    // Refresh the number of steps Lady Pac made to match current square size.
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

    return Math.round((moveSteps / this.squarePreResize) * squareSizeDiff);
  }

  /**
   * Move LadyPac.
   *
   * @param {number} squareSize - Size of one side of the square.
   */

  #move(squareSize) {
    this.#compareMoveAndCheckDirection(squareSize);

    switch (this.moveDirection) {
      case MoveDirection.up:
        // To move up subtract speed from yPosition,
        this.yPosition -= this.speed;
        this.yMoveSteps--;
        break;

      case MoveDirection.down:
        this.yPosition += this.speed;
        this.yMoveSteps++;
        break;

      case MoveDirection.left:
        this.xPosition -= this.speed;
        this.xMoveSteps--;
        break;

      case MoveDirection.right:
        this.xPosition += this.speed;
        this.xMoveSteps++;
    }
  }

  /**
   * Set move direction to check direction if applicable.
   *
   * @param {number} squareSize - Size of one side of the square.
   */

  #compareMoveAndCheckDirection(squareSize) {
    // Only change move direction to check direction if they are different.
    if (this.moveDirection !== this.checkDirection) {
      // Lady Pac can only change direction if she is aligned perfectly in middle of square.
      if (this.#positionInMiddleOfSquare(squareSize)) {
        this.moveDirection = this.checkDirection;
      }
    }
  }

  /**
   * Check if current position is aligned perfectly in middle of square.
   *
   * @param {number} squareSize - Size of one side of the square.
   * @return {boolean}
   */

  #positionInMiddleOfSquare(squareSize) {
    return (
      Number.isInteger(this.xPosition / squareSize) &&
      Number.isInteger(this.yPosition / squareSize)
    );
  }

  /**
   * Get all images and allow for their access.
   */

  #getImages() {
    const img1 = new Image();
    img1.src = "./assets/img/game/ladypac-open-half.png";

    this.ladyPacImgs = [img1];

    this.ladyPacImgIndex = 0;
  }
}
