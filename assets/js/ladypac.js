/**
* Lady Pac object.
* 
* Conatins all information about Lady Pac.
*
*/

export default class LadyPac {
  constructor(xPosition, yPosition, squareSize, gameMap) {
    this.xPosition = xPosition;
    this.yPosition = yPosition;
    this.squareSize = squareSize;
    this.gameMap = gameMap;
  }
}
