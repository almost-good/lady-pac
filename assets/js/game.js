export default class Game {
  constructor() {
    this.canvas = document.getElementById('game-canvas')
    this.ctx = this.canvas.getContext('2d')
  }

  game() {
    this.#runGame()

    setInterval(this.#runGame, 1000)
  }

  #runGame() {
    console.log('run')
  }
}