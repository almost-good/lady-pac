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

    // check if local storage is empty
    if (!localStorage.getItem(SCORES)) {
      this.#storeInitialCurrentScore();
    }
  }

  /**
   * Store the first score ever achieved in local storage.
   */
  #storeInitialCurrentScore() {
    let leaderboardStorage = [this.currentPlayerScore];

    localStorage.setItem(SCORES, JSON.stringify(leaderboardStorage));
  }
}
