import mapList from "./map-list.js";
import { MoveDirection } from "./constants.js";
import LadyPac from "./ladypac.js";
import Ghost from "./ghost.js";

/**
 * GameMap class used to create the map and it's content.
 *
 * Public methods:
 *
 *     create(ctx, squareSize)
 *     setSquareSize()
 *     setCanvasSize(canvas, squareSize)
 *     getMovingObjects()
 *     bumpIntoWall(xPosition, yPosition, direction, squareSize)
 *     pelletEaten(xPosition, yPosition, squareSize)
 *     removeLife()
 *     addScore(scoreToAdd)
 *     positionInMiddleOfSquare(xPosition, yPosition, squareSize)
 *     playSound(soundEffect)
 *
 * Private methods:
 *
 *     #canBeEaten(xPosition, yPosition, squareSize, mapItem)
 *     #addLife()
 *     #flashLife(flag)
 *     #createSquareImg(ctx, squareImg, column, row, squareSize)
 *     #setEnergizedPelletImg()
 */

export default class GameMap {
  constructor() {
    this.speed = 4;

    // Score.
    this.scoreHTML = document.getElementById("current-score");
    this.score = 0;
    this.pelletScore = 20;
    this.energizedPelletScore = 50;

    // Life.
    this.lifesHTML = document.getElementById("lifes");
    this.lifeHTML = this.lifesHTML.getElementsByTagName("li");
    this.lifes = this.lifeHTML.length - 1;
    this.loseLife = false;
    this.lifeAdded = false;

    // Sounds.
    this.soundBtn = document.getElementById("sound");
    this.lifeAddedSound = new Audio("./assets/sounds/life-added-sound.wav");

    // Images.
    this.wallImg = new Image();
    this.wallImg.src = "./assets/img/game/wall.png";

    this.pelletImg = new Image();
    this.pelletImg.src = "./assets/img/game/pellet.png";

    this.energizedPelletImg = new Image();
    this.energizedPelletImg.src = "./assets/img/game/energized-pellet.png";
    this.switchPelletImg = this.energizedPelletImg;

    // Timers.
    this.energizedPelletTimerDef = 30;
    this.energizedPelletTimer = this.energizedPelletTimerDef;
    this.lifeTimer = 10;
    this.lifeTimeout = 300;

    // Current map.
    // TO DO - map will be connected with player lvl, for now there is only one lvl.
    this.map = mapList;
  }

  /**
   * Create map and all it's content.
   * @param {object} ctx - Canvas context. The map is drawn inside ctx.
   * @param {number} squareSize - Size of one side of the square.
   */

  create(ctx, squareSize) {
    // Loop over map and get the correct img.
    for (let row = 0; row < this.map.length; row++) {
      for (let column = 0; column < this.map[0].length; column++) {
        let square = this.map[row][column];
        let squareImg;

        if (square === 0) {
          squareImg = this.pelletImg;
        } else if (square === 1) {
          squareImg = this.wallImg;
        } else if (square === 4) {
          squareImg = this.#setEnergizedPelletImg();
        } else {
          continue;
        }

        this.#createSquareImg(ctx, squareImg, column, row, squareSize);
      }
    }
  }

  /**
   * Set the size of one square in map.
   * @summary The square size is changed dynamically, depending on browser width.
   * @return {number} Square Size.
   */

  setSquareSize() {
    let browserWidth = window.innerWidth;

    if (browserWidth > 700) {
      return 40;
    } else if (browserWidth > 375) {
      return 28;
    }

    return 20;
  }

  /**
   * Set the size of canvas.
   * @param {object} canvas - Canvas element from HTML. The game area.
   * @param {number} squareSize - Size of one side of the square.
   */

  setCanvasSize(canvas, squareSize) {
    canvas.width = this.map[0].length * squareSize;
    canvas.height = this.map.length * squareSize;
  }

  /**
   * Create Lady Pac and ghost objects.
   * @summary
   * Get the initial position of moving elements and create objects.
   */

  getMovingObjects() {
    let ladyPac;
    const ghosts = [];

    for (let row = 0; row < this.map.length; row++) {
      for (let column = 0; column < this.map[0].length; column++) {
        let square = this.map[row][column];

        if (square === 2) {
          // Get the Lady Pac object.
          ladyPac = new LadyPac(this.speed, column, row, this);
        } else if (square === 3) {
          // The ghost should be 'over' pellet.
          this.map[row][column] = 0;
          // Get one ghost object.
          ghosts.push(new Ghost(this.speed, column, row, this));
        }
      }
    }

    return [ladyPac, ghosts];
  }

  /**
   * Check if object bumped into wall.
   * @summary
   * Check the type of a square, positioned 1 square size in front of the object
   * in the specified direction.
   * If the type of square stationed at that position is 1, that is a wall sqaure
   * and return value should be true.
   * @param {number} xPosition - X coordinate of the object.
   * @param {number} yPosition - Y coordinate of the object.
   * @param {number} direction - Direction where the object is headed.
   * @param {number} squareSize - Size of one side of the square.
   * @return {boolean} If it bumped - true, otherwise false.
   */

  bumpIntoWall(xPosition, yPosition, direction, squareSize) {
    // Check if object is not centered.
    if (!this.positionInMiddleOfSquare(xPosition, yPosition, squareSize)) {
      return false;
    }

    let column = 0;
    let row = 0;

    // If moving up/left the value is subtracted, otherwise added.
    switch (direction) {
      case MoveDirection.up:
        row = (yPosition - squareSize) / squareSize;
        column = xPosition / squareSize;
        break;
      case MoveDirection.down:
        row = (yPosition + squareSize) / squareSize;
        column = xPosition / squareSize;
        break;
      case MoveDirection.left:
        row = yPosition / squareSize;
        column = (xPosition - squareSize) / squareSize;
        break;
      case MoveDirection.right:
        row = yPosition / squareSize;
        column = (xPosition + squareSize) / squareSize;
        break;
    }

    const square = this.map[row][column];

    if (square === 1) {
      return true;
    }

    return false;
  }

  /**
   * Check if pellet is eaten, if it is add score.
   * @summary
   * @param {number} xPosition - X coordinate of the object.
   * @param {number} yPosition - Y coordinate of the object.
   * @param {number} squareSize - Size of one side of the square.
   * @return {boolean} If pellet is eaten return true, otherwise false.
   */

  pelletEaten(xPosition, yPosition, squareSize) {
    if (this.#canBeEaten(xPosition, yPosition, squareSize, 0)) {
      this.addScore(this.pelletScore);

      return true;
    }

    return false;
  }

  /**
   * Check if energized pellet is eaten, if it is add score.
   * @summary
   * @param {number} xPosition - X coordinate of the object.
   * @param {number} yPosition - Y coordinate of the object.
   * @param {number} squareSize - Size of one side of the square.
   * @return {boolean} If energized pellet is eaten return true, otherwise false.
   */

  energizedPelletEaten(xPosition, yPosition, squareSize) {
    if (this.#canBeEaten(xPosition, yPosition, squareSize, 4)) {
      this.addScore(this.energizedPelletScore);

      return true;
    }

    return false;
  }

  /**
   * Remove a life.
   */

  removeLife() {
    this.lifes--;
    this.lifeHTML[this.lifes].classList.add("hidden");

    this.loseLife = true;
  }

  /**
   * Add and display score.
   * @summary
   * @param {number} scoreToAdd - Score that needs to be added.
   */

  addScore(scoreToAdd) {
    this.score += scoreToAdd;
    this.scoreHTML.innerText = this.score;

    // If score went above 7000 add another life, only once.
    if (!this.lifeAdded && this.score > 7000) {
      this.#addLife();
    }
  }

  /**
   * Play sound only if the sound is not muted.
   * @param {object} soundEffect - Object containing a sound to be played.
   */

  playSound(soundEffect) {
    const volumeOn = "fa-volume-high";

    if (this.soundBtn.classList.contains(volumeOn)) {
      soundEffect.currentTime = 0;
      soundEffect.play();
    }
  }

  /**
   * Check if current position is aligned perfectly in middle of square.
   * @param {number} xPosition - X coordinate of the object.
   * @param {number} yPosition - Y coordinate of the object.
   * @param {number} squareSize - Size of one side of the square.
   * @return {boolean}
   */

  positionInMiddleOfSquare(xPosition, yPosition, squareSize) {
    return (
      Number.isInteger(xPosition / squareSize) &&
      Number.isInteger(yPosition / squareSize)
    );
  }

  /**
   * Check if map item can be eaten, if it can, eat item.
   * @summary
   * @param {number} xPosition - X coordinate of the object.
   * @param {number} yPosition - Y coordinate of the object.
   * @param {number} squareSize - Size of one side of the square.
   * @param {number} mapItem - Item from map list, represented by number.
   * @return {boolean} If item can be eaten return true, otherwise false.
   */

  #canBeEaten(xPosition, yPosition, squareSize, mapItem) {
    if (this.positionInMiddleOfSquare(xPosition, yPosition, squareSize)) {
      let column = xPosition / squareSize;
      let row = yPosition / squareSize;

      // Get the position in the map, and if the map item is correct, change it to empty.
      if (this.map[row][column] === mapItem) {
        this.map[row][column] = 5;
        return true;
      }
    }

    return false;
  }

  /**
   * Add life. This method can be called only once.
   */

  #addLife() {
    this.lifeHTML[this.lifes].classList.remove("hidden");
    this.lifes++;
    this.lifeAdded = true;

    this.playSound(this.lifeAddedSound);

    // Flash life.
    setTimeout(this.#flashLife.bind(this), this.lifeTimeout, true);
  }

  /**
   * Flash the newly recieved life.
   * @summary
   * @param {boolean} flag - Helper used for switching heart states.
   */

  #flashLife(flag) {
    if (flag) {
      flag = false;
      this.lifeHTML[this.lifes - 1].classList.add("hidden");
    } else {
      flag = true;
      this.lifeHTML[this.lifes - 1].classList.remove("hidden");
    }

    this.lifeTimer--;
    if (this.lifeTimer) {
      setTimeout(this.#flashLife.bind(this), this.lifeTimeout, flag);
    }
  }

  /**
   * Add image to the square in the map.
   * @summary The function calculates current x and y position of map square, and draws a an image.
   * @param {object} ctx - Canvas context.
   * @param {object} squareImg - Image to be drawn.
   * @param {number} column - Current column in the map.
   * @param {number} row - Current row in the map.
   */

  #createSquareImg(ctx, squareImg, column, row, squareSize) {
    let xPosition = column * squareSize;
    let yPosition = row * squareSize;
    ctx.drawImage(squareImg, xPosition, yPosition, squareSize, squareSize);
  }

  /**
   * Set the image of energized pellet.
   * @return {object} Image for energized pellet.
   */

  #setEnergizedPelletImg() {
    this.energizedPelletTimer--;

    if (this.energizedPelletTimer === 0) {
      this.energizedPelletTimer = this.energizedPelletTimerDef;

      if (this.switchPelletImg === this.pelletImg) {
        this.switchPelletImg = this.energizedPelletImg;
      } else {
        this.switchPelletImg = this.pelletImg;
      }
    }

    return this.switchPelletImg;
  }
}
