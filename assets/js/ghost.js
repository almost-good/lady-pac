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
 *     #getImages()
 */

export default class Ghost {
  constructor(speed, column, row, gameMap) {
    this.speed = speed;

    this.column = column;
    this.row = row;
    this.gameMap = gameMap;

    this.#getImages();
  }

  /**
   * Create Ghost and all it's content and functionalities.
   * @param {object} ctx - Canvas context.
   * @param {number} squareSize - Size of one side of the square.
   */

  create(ctx, squareSize) {
    this.xPosition = this.column * squareSize;
    this.yPosition = this.row * squareSize;

    ctx.drawImage(
      this.ghostImg,
      this.xPosition,
      this.yPosition,
      squareSize,
      squareSize
    );
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
}
