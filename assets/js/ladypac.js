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
* Private methods:
*
*     #getImages()
*/

export default class LadyPac {
  constructor(column, row, gameMap) {
    this.column = column;
    this.row = row;
    this.gameMap = gameMap;
    
    // Moving directions
    this.moveDirection = null
    this.checkMoveDirection = null

    document.addEventListener('keydown', this.#checkKeyPressedEvent)

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
   * Check which key was pressed.
   */

  #checkKeyPressedEvent = (event) => {
    // Up key.
    if(event.keyCode === 38) {
      console.log('up')
    }
    // Down key.
    if(event.keyCode === 40) {
      console.log('down')
    }
    // Left key.
    if(event.keyCode === 37) {
      console.log('left')
    }
    // Right key.
    if(event.keyCode === 39) {
      console.log('right')
    }
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
