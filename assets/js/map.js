import mapList from "./map-list.js";

export default class GameMap {
  constructor(squareSize) {
    this.squareSize = squareSize;

    // Images
    this.wall = new Image();
    this.wall.src = "../img/game/wall.png";

    this.pellet = new Image();
    this.pellet.src = "../img/game/pellet.png";

    // Current map
    // TO DO - map will be connected with player lvl, for now there is only one lvl
    this.map = mapList;
  }

  create() {
    console.log(this.squareSize);
  }

  /** 
  * Set the size of canvas.
  * @param {object} canvas - Canvas element from HTML. The game area.
  */

  setCanvasSize(canvas) {
    canvas.width = this.map[0].length * this.squareSize;
    canvas.height = this.map.length * this.squareSize;
  }
}
