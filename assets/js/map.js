import mapList from "./map-list.js"

export default class GameMap {
  constructor(squareSize) {
    this.squareSize = squareSize
  }

  create() {
    console.log(this.squareSize)
  }
}