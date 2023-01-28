import Leaderboard from "./leaderboard.js";

class App {
  constructor() {
    this.leaderboard = new Leaderboard()
    this.init()
  }

  init() {
    this.leaderboard.init()
  }
}

new App()