import mapList from "./map-list.js";
import { MoveDirection } from "./constants.js";
import LadyPac from "./ladypac.js";

/**
 * GameMap class used to create the map and it's content.
 *
 * Public methods:
 *
 *     create(ctx, squareSize)
 *     setSquareSize()
 *     setSpeed()
 *     setCanvasSize(canvas, squareSize)
 *     bumpIntoWall()
 *     getLadyPac()
 *     bumpIntoWall(xPosition, yPosition, direction, squareSize)
 *     positionInMiddleOfSquare(xPosition, yPosition, squareSize)
 *
 * Private methods:
 *
 *     #createSquareImg(ctx, squareImg, column, row, squareSize)
 */

export default class GameMap {
  constructor() {
    this.speed = this.setSpeed()
    
    // Images
    this.wallImg = new Image();
    this.wallImg.src = "./assets/img/game/wall.png";

    this.pelletImg = new Image();
    this.pelletImg.src = "./assets/img/game/pellet.png";

    // Current map
    // TO DO - map will be connected with player lvl, for now there is only one lvl
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
   * Set the speed of moving objects.
   * @summary The speed is changed dynamically, depending on browser width.
   * @return {number} Speed.
   */

  setSpeed() {
    let browserWidth = window.innerWidth;

    if (browserWidth <= 700) {
      return 2;
    }

    return 4;
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
   * Get the initial Lady Pac position and create new Lady Pac object.
   */

  getLadyPac() {
    for (let row = 0; row < this.map.length; row++) {
      for (let column = 0; column < this.map[0].length; column++) {
        let square = this.map[row][column];

        if (square === 2) {
          return new LadyPac(this.speed, column, row, this);
        }
      }
    }
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
   * Check if current position is aligned perfectly in middle of square.
   *
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
}
