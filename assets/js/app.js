import Leaderboard from "./leaderboard.js";

class App {
  constructor() {
    this.score = 1500;
    this.playerName = "wicca";

    this.leaderboard = new Leaderboard(this.score, this.playerName);

    this.init();
  }

  init() {
    this.leaderboard.storeCurrentScore();
    this.leaderboard.displayScore();
    this.leaderboard.displayCurrentScore();
  }
}

new App();
