import { MoveDirection } from "./constants.js";

/**
 * Ghost object.
 *
 * Conatins all information about Ghost.
 *
 * Public methods:
 *
 *     create(ctx, squareSize, pause, ghostFoodState, ghostSwitchingState)
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
 *     #switchGhostImages(img1, img2)
 *     #checkIfBumpedIntoLadyPac(squareSize, ladyPac, ghostFoodState, ghostSwitchingState)
 *     #didBump(squareSize, ladyPac)
 *     #eatLadyPac(ladyPac)
 *     #waitForInitialMove(ladyPac)
 *     #ghostIsEaten(ladyPac)
 *     #eatenStateOn()
 *     #eatenFinishingStateOnOff(onOffState)
 *     #playGhostSound(ladyPac, soundEffect)
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

    // Ghost eaten states.
    this.ghostEaten = false;
    this.ghostEatenSwitching = false;
    this.ghostAteLadyPac = false;

    // Score points.
    this.scorePoints = 200;

    // Sounds.
    this.eatGhostSound = new Audio("./assets/sounds/eat-ghost-sound.wav");
    this.ladyPacEatenSound = new Audio("./assets/sounds/bump-into-ghost.wav");

    // Timers.
    this.moveTimerDef = this.#random(10, 50);
    this.moveTimer = this.moveTimerDef;

    this.ghostSwitchingTimerDef = 10;
    this.ghostSwitchingTimer = this.ghostSwitchingTimerDef;

    this.ghostEatenTime = 4 * 1000;
    this.ghostEatenFinishingTime = 2 * 1000;

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
    if (this.squarePreResize != squareSize) {
      this.#adjustPosition(squareSize);
    }

    // Only move and do checks if Lady Pac made initial movement.
    if (!pause) {
      this.#move(squareSize);
      this.#changeMoveDirection(squareSize);
      this.#checkIfBumpedIntoLadyPac(
        squareSize,
        ladyPac,
        ladyPac.energizedPelletActive,
        ladyPac.energizedPelletFinishing
      );
    }

    this.#setImage(
      ctx,
      squareSize,
      ladyPac.energizedPelletActive,
      ladyPac.energizedPelletFinishing
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
    } else if (this.ghostEatenSwitching) {
      this.#switchGhostImages(this.ghostEatenImg, this.ghostNormalImg);
    } else if (ghostFoodState) {
      this.ghostImg = this.ghostFoodImg;
    } else if (ghostSwitchingState) {
      this.#switchGhostImages(this.ghostSwitchingImg, this.ghostFoodImg);
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
   * @param {object} img1 - Image object 1.
   * @param {object} img2 - Image object 2.
   */

  #switchGhostImages(img1, img2) {
    this.ghostSwitchingTimer--;

    if (this.ghostSwitchingTimer === 0) {
      this.ghostSwitchingTimer = this.ghostSwitchingTimerDef;

      if (this.ghostImg === img1) {
        this.ghostImg = img2;
      } else {
        this.ghostImg = img1;
      }
    }
  }

  /**
   * Check if the ghost bumped into Lady Pac and do ation, depending if the ghost of Lady Pac is eaten.
   * @param {number} squareSize - Size of one side of the square.
   * @param {object} ladyPac - Lady Pac object.
   * @param {boolean} ghostFoodState - Energized pellet is active and ghost is food.
   * @param {boolean} ghostSwitchingState - Energizing pellet effects are expiring and ghost is switching back.
   */

  #checkIfBumpedIntoLadyPac(
    squareSize,
    ladyPac,
    ghostFoodState,
    ghostSwitchingState
  ) {
    if (
      this.#didBump(squareSize, ladyPac) &&
      !this.ghostEaten &&
      !this.ghostEatenSwitching
    ) {
      this.#changeMoveDirection(squareSize);

      if (ghostFoodState || ghostSwitchingState) {
        // Ghost is eaten.
        this.#ghostIsEaten(ladyPac);
      } else if (
        // Eat Lady Pac.
        !ghostFoodState &&
        !ghostSwitchingState &&
        !this.ghostAteLadyPac
      ) {
        this.#eatLadyPac(ladyPac);
      }
    }
  }

  /**
   * Check if the collision happened between Lady Pac and ghost.
   * @param {number} squareSize - Size of one side of the square.
   * @param {object} ladyPac - Lady Pac object.
   * @returns {boolean}
   */

  #didBump(squareSize, ladyPac) {
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
      return true;
    }

    return false;
  }

  /**
   * Ghost eaten Lady Pac, Lady Pac looses a life, and a sound is played.
   * Game is paused until initial move is made.
   * @param {object} ladyPac - Lady Pac object.
   */

  #eatLadyPac(ladyPac) {
    this.ghostAteLadyPac = true;

    this.#playGhostSound(ladyPac, this.ladyPacEatenSound);
    this.gameMap.removeLife();

    ladyPac.initialMove = false;
    setTimeout(this.#waitForInitialMove.bind(this), 1000, ladyPac);
  }

  /**
   * Reset ghost ate Lady Pac and lose life flags after initial move has been made.
   * @param {object} ladyPac - Lady Pac object.
   */

  #waitForInitialMove(ladyPac) {
    if (!ladyPac.initialMove) {
      // Run until initial move has been made.
      setTimeout(this.#waitForInitialMove.bind(this), 1000, ladyPac);
    } else {
      // Reset.
      this.ghostAteLadyPac = false;
      this.gameMap.loseLife = false;
    }
  }

  /**
   * Method that manipulates game elements when ghost is eaten.
   * @summary
   * This method:
   * - Eats a ghost.
   * - Plays the sound.
   * - Adds the score.
   * - Calls the timer to switch the current eaten state.
   * @param {object} ladyPac - Lady Pac object.
   */

  #ghostIsEaten(ladyPac) {
    // Eat ghost.
    this.#eatenStateOn();

    // Play sound, add score.
    this.#playGhostSound(ladyPac, this.eatGhostSound);
    this.gameMap.addScore(this.scorePoints);

    // Call the timer when the eaten state will switch to off and eaten finishing state to on.
    this.ghostEatenTimer = setTimeout(
      this.#eatenFinishingStateOnOff.bind(this),
      this.ghostEatenTime,
      true
    );
  }

  /**
   * Switch eaten ghost state to active.
   */

  #eatenStateOn() {
    this.ghostEaten = true;
    this.ghostEatenSwitching = false;

    // Clear timers.
    clearTimeout(this.ghostEatenTimer);
    clearTimeout(this.ghostEatenFinishingTimer);
  }

  /**
   * Switch eaten finishing state to active or inactive.
   * @summary
   * Turn off the eaten state.
   * When the method is called from outside it will set the finishing state to on.
   * When the method is called with recursion it will set the finishing state to off.
   * @param {boolean} onOffState - Setting which turns the ghost eaten finishing state to on or off.
   */

  #eatenFinishingStateOnOff(onOffState) {
    this.ghostEaten = false;
    this.ghostEatenSwitching = onOffState;

    if (this.ghostEaten || this.ghostEatenSwitching) {
      // Call the timer to switch finishing state to off.
      this.ghostEatenFinishingTimer = setTimeout(
        this.#eatenFinishingStateOnOff.bind(this),
        this.ghostEatenFinishingTime,
        false
      );
    }
  }

  /**
   * Play the sound when the ghost is eaten.
   * @param {object} ladyPac - Lady Pac object.
   * @param {object} soundEffect - Object containing a sound to be played.
   */

  #playGhostSound(ladyPac, soundEffect) {
    ladyPac.eatEnergizedPelletSound.pause();

    ladyPac.playSound(soundEffect);
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
