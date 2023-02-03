import mapList from "./map-list.js";

export default class GameMap {
  constructor() {
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
   * Create map and all it's context.
   * @param {object} ctx - Canvas context. The map is drawn inside ctx.
   */

  create(ctx) {
    // Loop over map and get the correct img.
    for (let row = 0; row < this.map.length; row++) {
      for (let column = 0; column < this.map[0].length; column++) {
        let square = this.map[row][column];
        let squareImg;
        if (square === 0) {
          squareImg = this.pelletImg;
        } else if (square === 1) {
          squareImg = this.wallImg;
        }
        this.#createSquareImg(ctx, squareImg, column, row);
      }
    }
  }

  /**
   * Set the size of one square in map.
   * @summary The square size is changed dynamically, depending on browser width.
   */

  setSquareSize() {
    let browserWidth = window.innerWidth;

    if (browserWidth >= 700) {
      this.squareSize = 40;
    } else if (browserWidth >= 360) {
      this.squareSize = 26;
    } else {
      this.squareSize = 20;
    }
  }

  /**
   * Set the size of canvas.
   * @param {object} canvas - Canvas element from HTML. The game area.
   */

  setCanvasSize(canvas) {
    canvas.width = this.map[0].length * this.squareSize;
    canvas.height = this.map.length * this.squareSize;
  }

  /**
   * Add image to the square in the map.
   * @summary The function calculates current x and y position of map square, and draws a an image.
   * @param {object} ctx - Canvas context.
   * @param {object} squareImg - Image to be drawn.
   * @param {number} column - Current column in the map.
   * @param {number} row - Current row in the map.
   */

  #createSquareImg(ctx, squareImg, column, row) {
    let xPosition = column * this.squareSize;
    let yPosition = row * this.squareSize;
    ctx.drawImage(
      squareImg,
      xPosition,
      yPosition,
      this.squareSize,
      this.squareSize
    );
  }
}
