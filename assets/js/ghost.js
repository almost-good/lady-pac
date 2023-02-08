import { MoveDirection } from "./constants.js";

/**
 * Ghost object.
 *
 * Conatins all information about Ghost.
 *
 * Public methods:
 *
 *     create(ctx, squareSize, pause, ghostFoodState, ghostSwitchingState)
 *     bumpIntoLadyPac(squareSize, ladyPac)
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
 *     #setImage(ctx, squareSize, ghostFoodState, ghostSwitchingState)
 *     #switchGhostImages()
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
    this.ghostSwitchingTimerDef = 10;
    this.ghostSwitchingTimer = this.ghostSwitchingTimerDef;

    this.ghostEaten = false;

    this.#getImages();
  }

  /**
   * Create Ghost and all it's content and functionalities.
   * @param {object} ctx - Canvas context.
   * @param {number} squareSize - Size of one side of the square.
   * @param {boolean} pause - Ghost movements are paused.
   * @param {object} ladyPac - Lady Pac object.
   */

  create(ctx, squareSize, pause, ladyPac) {
    // If positions are not defined, define them.
    if (!this.xPosition && !this.yPosition) {
      this.#setPosition(squareSize);
    }

    // If the screen is resized, "remember" ghost position prior to resize.
    // Adjust the speed.
    if (this.squarePreResize != squareSize) {
      this.#adjustPosition(squareSize);
    }

    // Only move if Lady Pac made initial movement.
    if (!pause) {
      this.#move(squareSize);
      this.#changeMoveDirection(squareSize);
    }

    this.#checkIfEaten(squareSize, ladyPac);

    this.#setImage(
      ctx,
      squareSize,
      ladyPac.energizedPelletActive,
      ladyPac.energizedPelletFinishing
    );
  }

  /**
   * Check if the ghost bumped into Lady Pac.
   * @param {number} squareSize - Size of one side of the square.
   * @param {object} ladyPac - Lady Pac object.
   * @return {boolean} Return true if ghost bumped into Lady Pac, false otherwise.
   */

  bumpIntoLadyPac(squareSize, ladyPac) {
    const halfSize = squareSize / 2;

    /*
    Following code in the if statement is inspired by MDN docs. 
    Original code from MDN docs has been altered to suit app purposes.
    https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
    */
    if (
      this.xPosition < ladyPac.xPosition + halfSize &&
      this.xPosition + halfSize > ladyPac.xPosition &&
      this.yPosition < ladyPac.yPosition + halfSize &&
      this.yPosition + halfSize > ladyPac.yPosition
    ) {
      this.#changeMoveDirection(squareSize);
      return true;
    }

    return false;
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
    this.ghostNormalImg = new Image();
    this.ghostNormalImg.src = "./assets/img/game/ghost-normal.png";

    this.ghostFoodImg = new Image();
    this.ghostFoodImg.src = "./assets/img/game/ghost-food.png";

    this.ghostSwitchingImg = new Image();
    this.ghostSwitchingImg.src = "./assets/img/game/ghost-switching.png";

    this.ghostEatenImg = new Image();
    this.ghostEatenImg.src = "./assets/img/game/ghost-eaten.png";

    this.ghostImg = this.ghostNormalImg;
  }

  /**
   * Set ghost image and draw it.
   * @param {object} ctx - Canvas context.
   * @param {number} squareSize - Size of one side of the square.
   * @param {boolean} ghostFoodState - Energized pellet is active and ghost is food.
   * @param {boolean} ghostSwitchingState - Energizing pellet effects are expiring and ghost is switching back.
   */

  #setImage(ctx, squareSize, ghostFoodState, ghostSwitchingState) {
    if (this.ghostEaten) {
      this.ghostImg = this.ghostEatenImg;
    } else if (ghostFoodState) {
      this.ghostImg = this.ghostFoodImg;
    } else if (ghostSwitchingState) {
      this.#switchGhostImages();
    } else {
      this.ghostImg = this.ghostNormalImg;
    }

    ctx.drawImage(
      this.ghostImg,
      this.xPosition,
      this.yPosition,
      squareSize,
      squareSize
    );
  }

  /**
   * Switch ghost images between two, while ghost is in switching state.
   */

  #switchGhostImages() {
    this.ghostSwitchingTimer--;

    if (this.ghostSwitchingTimer === 0) {
      this.ghostSwitchingTimer = this.ghostSwitchingTimerDef;

      if (this.ghostImg === this.ghostFoodImg) {
        this.ghostImg = this.ghostSwitchingImg;
      } else {
        this.ghostImg = this.ghostFoodImg;
      }
    }
  }

  /**
   * Check if the ghost is in eaten state.
   * @param {number} squareSize - Size of one side of the square.
   * @param {object} ladyPac - Lady Pac object.
   */

  #checkIfEaten(squareSize, ladyPac) {
    if (
      this.ghostImg != this.ghostNormalImg &&
      this.bumpIntoLadyPac(squareSize, ladyPac)
    ) {
      this.ghostEaten = true;

      // Ghost will be respawned after number of seconds
      setTimeout(() => {
        this.ghostEaten = false;
      }, 1000 * 8);
    }
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
