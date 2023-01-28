import { SCORES, PLAYER } from "./constants.js";

export default class Leaderboard {
  constructor(score, playerName) {
    this.currentPlayerScore = {
      player: playerName,
      score: score,
    };
  }

  init() {
    // Add current player to local storage
    localStorage.setItem(PLAYER, this.currentPlayerScore.player);
    console.log("test");
  }
}
