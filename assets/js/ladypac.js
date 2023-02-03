/**
* Lady Pac object.
* 
* Conatins all information about Lady Pac.
*
* Public methods:
*
*     create(ctx, squareSize)
*
* Private methods:
*
*     #getImages()
*/

export default class LadyPac {
  constructor(column, row, gameMap) {
    this.column = column;
    this.row = row;
    this.gameMap = gameMap;
    
    this.#getImages()
  }

  /**
   * Create Lady Pac and all it's content.
   * @param {object} ctx - Canvas context.
   * @param {number} squareSize - Size of one side of the square.
   */

  create(ctx, squareSize) {
    this.xPosition = this.column * squareSize;
    this.yPosition = this.row * squareSize;

    ctx.drawImage(this.ladyPacImgs[this.ladyPacImgIndex], this.xPosition, this.yPosition, squareSize, squareSize)
  }

  /**
   * Get all images and allow for their access.
   */

  #getImages() {
    const img1 = new Image();
    img1.src = "./assets/img/game/ladypac-open-half.png"

    this.ladyPacImgs = [img1]

    this.ladyPacImgIndex = 0
  }
}
