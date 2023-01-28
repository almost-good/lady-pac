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

    let scoreTest = [
      { player: "a", score: "2000" },
      { player: "b", score: "1900" },
      { player: "c", score: "1800" },
      { player: "d", score: "1700" },
      { player: "e", score: "1600" },
      { player: "f", score: "1590" },
      { player: "g", score: "1580" },
      { player: "h", score: "1570" },
      { player: "i", score: "1560" },
      { player: "j", score: "1450" },
    ];
    localStorage.setItem(SCORES, JSON.stringify(scoreTest));

    this.#storeCurrentScore();
  }

  /**
   * Store current score of the player in the leaderboard, if applicable.
   * @summary
   * The leaderboard only stores top 10 scores achieved.
   */

  #storeCurrentScore() {
    let leaderboardStorage = JSON.parse(localStorage.getItem(SCORES));

    // Check if leaderbord contains a value.
    if (leaderboardStorage) {
      // Get current player score positon.
      let position = this.#leaderboardPosition(leaderboardStorage);
      leaderboardStorage.splice(position, 0, this.currentPlayerScore);
    } else {
      // Add a value
      leaderboardStorage = [this.currentPlayerScore];
    }

    // Make sure the leaderboard contains only 10 values
    if (leaderboardStorage.length >= 10) {
      leaderboardStorage.pop();
    }

    this.#addToLocalStorage(leaderboardStorage);
  }

  /**
   * Find position of where current score should be placed in the leaderboard.
   * @param {[]} leaderboardStorage
   * - Array of player names and their scores.
   * @return {number} Position of the current player score.
   */

  #leaderboardPosition(leaderboardStorage) {
    for (let i = leaderboardStorage.length - 1; i >= 0; i--) {
      if (this.currentPlayerScore.score < leaderboardStorage[i].score) {
        return i + 1;
      }
    }

    return 0;
  }

  /**
   * Add entire leaderboard to local storage.
   * @param {[]} leaderboardStorage
   * - Contains an array of player names and their scores.
   */

  #addToLocalStorage(leaderboardStorage) {
    localStorage.setItem(SCORES, JSON.stringify(leaderboardStorage));
  }
}
