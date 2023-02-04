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
 *     #touchStartEvent
 *     #touchDirectionEvent
 *
 * Private methods:
 *
 *     #setPosition(squareSize)
 *     #adjustPosition(squareSize)
 *     #calcStepDiff(moveSteps, squareSize)
 *     #move(squareSize)
 *     #setMoveToCheckDirection(squareSize)
 *     #requestMoveDirection(directionCode)
 *     #setOrCheckRequestedDirection(oppositeDirection, requestedDirection)
 *     #getSwipeDirectionCode(xDiff, yDiff)
 *     #getImages()
 *     #animate()
 *     #stopAnimation()
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

    // Timers
    this.timerDef = 8;
    this.timer = null;

    // Event listeners for key and swipes
    document.addEventListener("keydown", this.#checkKeyPressedEvent);
    document.addEventListener("touchstart", this.#touchStartEvent);
    document.addEventListener("touchmove", this.#touchDirectionEvent);

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
    // Adjust the speed.
    if (this.squarePreResize != squareSize) {
      this.#adjustPosition(squareSize);
      this.speed = this.gameMap.setSpeed();
    }

    this.#move(squareSize);
    this.#animate();

    ctx.drawImage(
      this.ladyPacImgs[this.ladyPacImgIndex],
      this.xPosition,
      this.yPosition,
      squareSize,
      squareSize
    );
  }

  /**
   * Check which key was pressed event. Request key direction.
   */

  #checkKeyPressedEvent = (event) => {
    event.preventDefault();
    this.#requestMoveDirection(event.keyCode);
  };

  /**
   * Starting position of swipe Event.
   */

  #touchStartEvent = (event) => {
    this.xInitialTouch = event.touches[0].clientX;
    this.yInitialTouch = event.touches[0].clientY;
  };

  /**
   * Direction of the swipe Event.
   * @summary
   * Get one touch position, positioned immediately after initial touch position.
   * Get difference bewteen current touch and initial touch positions.
   * Use the difference to get final direction code.
   * Request move direction using direction code.
   */

  #touchDirectionEvent = (event) => {
    // Do not run if initial touch haven't been positioned.
    if (this.xInitialTouch === null || this.yInitialTouch === null) {
      return;
    }

    let xCurrentTouch = event.touches[0].clientX;
    let yCurrentTouch = event.touches[0].clientY;

    let xTouchDiff = this.xInitialTouch - xCurrentTouch;
    let yTouchDiff = this.yInitialTouch - yCurrentTouch;

    // Get direction code.
    let directionCode = this.#getSwipeDirectionCode(xTouchDiff, yTouchDiff);

    // Reset initial touch.
    this.xInitialTouch = null;
    this.yInitialTouch = null;

    // Pass direction code.
    this.#requestMoveDirection(directionCode);
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
    let diff = Math.round((moveSteps / this.squarePreResize) * squareSizeDiff);

    // If the speed is two, diff has to be pair number,
    // othervise Lady Pac will go out of the position.
    return diff - (diff % this.speed);
  }

  /**
   * Move LadyPac and start .
   *
   * @param {number} squareSize - Size of one side of the square.
   */

  #move(squareSize) {
    // Only change move direction to check direction if they are different.
    if (this.moveDirection !== this.checkDirection) {
      this.#setMoveToCheckDirection(squareSize);
    }

    // Lady Pac movement without change of direction continuosly checks
    // if there is wall in front. If there is, do not move.
    if (
      this.gameMap.bumpIntoWall(
        this.xPosition,
        this.yPosition,
        this.moveDirection,
        squareSize
      )
    ) {
      // When the movement stops, so does the animation.
      this.#stopAnimation()
      return;
    }

    // Lady Pac movement.
    switch (this.moveDirection) {
      case MoveDirection.up:
        // To move up subtract speed from yPosition,
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

  /**
   * Set move direction to check direction if applicable.
   *
   * @param {number} squareSize - Size of one side of the square.
   */

  #setMoveToCheckDirection(squareSize) {
    // Lady Pac can only change direction if she is aligned perfectly in middle of square.
    if (
      this.gameMap.positionInMiddleOfSquare(
        this.xPosition,
        this.yPosition,
        squareSize
      )
    ) {
      // Check if Lady Pac did not bump into wall.
      if (
        !this.gameMap.bumpIntoWall(
          this.xPosition,
          this.yPosition,
          this.checkDirection,
          squareSize
        )
      ) {
        // Set move direction.
        this.moveDirection = this.checkDirection;
      }
    }
  }

  /**
   * Request move direction by comparing the code recieved with direction numbers.
   * @param {number} directionCode - Contains code which dictates direction.
   */

  #requestMoveDirection(directionCode) {
    switch (directionCode) {
      case 38:
        // To up.
        this.#setOrCheckRequestedDirection(
          MoveDirection.down,
          MoveDirection.up
        );
        break;
      case 40:
        // To down.
        this.#setOrCheckRequestedDirection(
          MoveDirection.up,
          MoveDirection.down
        );
        break;
      case 37:
        // To left.
        this.#setOrCheckRequestedDirection(
          MoveDirection.right,
          MoveDirection.left
        );
        break;
      case 39:
        // To right.
        this.#setOrCheckRequestedDirection(
          MoveDirection.left,
          MoveDirection.right
        );
    }
  }

  /**
   * Set or Check requested moving direction.
   * @summary
   * If current moving direction is opposite then requested one, set moving direction straight away.
   * If it's different then pass new direction to be checked.
   * @param {number} oppositeDirection - Direction opposite then requested one.
   * @param {number} requestedDirection - Direction being requested.
   */

  #setOrCheckRequestedDirection(oppositeDirection, requestedDirection) {
    if (this.moveDirection === oppositeDirection) {
      this.moveDirection = requestedDirection;
    }
    this.checkDirection = requestedDirection;
  }

  /**
   * Get direction code.
   * @summary If the description is long, write your summary here. Otherwise, feel free to remove this.
   * @param {number} xDiff - X coordinate difference between initial and current touch.
   * @param {number} yDiff - Y coordinate difference between initial and current touch.
   * @return {number} Direction code.
   */

  #getSwipeDirectionCode(xDiff, yDiff) {
    // Get swipe direction.
    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      // Horizontal swipe
      if (xDiff > 0) {
        // To the left.
        return 37;
      } else {
        // To the right.
        return 39;
      }
    } else {
      // Vertical swipe.
      if (yDiff > 0) {
        // To up.
        return 38;
      } else {
        // To down.
        return 40;
      }
    }
  }

  /**
   * Check if current position is aligned perfectly in middle of square.
   *
   * @param {number} squareSize - Size of one side of the square.
   * @return {boolean}
   */

  /**
   * Get all images and allow for their access.
   */

  #getImages() {
    const img1 = new Image();
    img1.src = "./assets/img/game/ladypac-open-half.png";

    const img2 = new Image();
    img2.src = "./assets/img/game/ladypac-closed.png";

    const img3 = new Image();
    img3.src = "./assets/img/game/ladypac-open-half.png";

    const img4 = new Image();
    img4.src = "./assets/img/game/ladypac-open-full.png";

    this.ladyPacImgs = [img1, img2, img3, img4];

    this.ladyPacImgIndex = 0;
  }

  /**
   * Animate Lady Pac.
   * @summary
   * Animation is only active when there is movement.
   */

  #animate() {
    // If animation is not active then check for movement.
    if (this.timer === null) {
      if (this.moveDirection != null) {
        this.timer = this.timerDef;
      } else {
        return;
      }
    }

    this.timer--;
    // When the timer times out it's time to switch to new img and reset.
    if (this.timer === 0) {
      this.timer = this.timerDef;
      this.ladyPacImgIndex++;

      if (this.ladyPacImgIndex === this.ladyPacImgs.length) {
        this.ladyPacImgIndex = 0;
      }
    }
  }

  /**
   * Stops animation.
   */

  #stopAnimation() {
    this.timer = null;
    this.ladyPacImgIndex = 0;
  }
}
