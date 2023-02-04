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
    // If xPosition and yPosition are not defined, define them.
    if (!this.xPosition && !this.yPosition) {
      this.xPosition = this.column * squareSize;
      this.yPosition = this.row * squareSize;
      this.squarePreResize = squareSize;
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
      if (
        this.#positionInMiddleOfSquare(squareSize)
      ) {
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

  #positionInMiddleOfSquare(squareSize){
    return (Number.isInteger(this.xPosition / squareSize) && Number.isInteger(this.yPosition / squareSize))
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
