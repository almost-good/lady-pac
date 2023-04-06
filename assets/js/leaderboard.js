import { SCORES } from "./constants.js";

/**
 * Leaderboard class which represents Leaderboard section in HTML.
 *
 * Manipulates leaderboard object.
 * Stores scores and player names in local storage.
 *
 * Public methods:
 *
 *     displayScore()
 *     displayCurrentScore()
 *     storeCurrentScore()
 *
 * Private methods:
 *
 *     #formatScoreIntoHTML(score)
 *     #highlightCurrentScore(flag, leaderboard, score)
 *     #leaderboardPosition(leaderboardStorage)
 *     #currentNameIsHigher(name1, name2)
 *     #addToLocalStorage(leaderboardStorage)
 */

export default class Leaderboard {
  constructor(score, playerName) {
    this.currentPlayerScore = {
      player: playerName,
      score: score,
    };
  }

  /**
   * Adds highscore list to HTML document.
   */

  displayScore() {
    const leaderboard = document.getElementById("highscore-list");
    const leaderboardStorage = JSON.parse(localStorage.getItem(SCORES));

    leaderboard.innerHTML = "";
    // Flag for highlighting only one result
    let flag = false;

    // Display every score
    for (let i = 0; i < leaderboardStorage.length; i++) {
      let score = this.#formatScoreIntoHTML(leaderboardStorage[i]);

      leaderboard.innerHTML += score;

      if (!flag) {
        flag = this.#highlightCurrentScore(
          flag,
          leaderboard,
          leaderboardStorage[i]
        );
      }
    }
  }

  /**
   * Adds current score to HTML document.
   */

  displayCurrentScore() {
    const currentScore = document.getElementById("display-current-score");

    currentScore.innerHTML = `Your score: <span>${this.currentPlayerScore.score}</span>`;
  }

  /**
   * Store current score of the player in the leaderboard, if applicable.
   * @summary The leaderboard only stores top 10 scores achieved.
   */

  storeCurrentScore() {
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
   * Format score into HTML form.
   * @param {object} score - Object which contains player name and score.
   * @return {string} HTML ready list item.
   */

  #formatScoreIntoHTML(score) {
    score = `
      <li>
        ${score.player} 
        <span>${score.score}</span>
      </li>`;

    return score;
  }

  /**
   * Add class that will highlight only current score on leaderboard.
   * @param {boolean} flag - Boolean when activated makes sure this function is not ran anymore.
   * @param {object} leaderboard - Leaderboard HTML element.
   * @param {object} score - Leaderboard storage from local Storage.
   * @return {boolean} When activated this function will not be ran anymore.
   */

  #highlightCurrentScore(flag, leaderboard, score) {
    if (
      !flag &&
      score.score == this.currentPlayerScore.score &&
      score.player == this.currentPlayerScore.player
    ) {
      leaderboard.lastChild.className = "highlight-score";
      return true;
    }

    return false;
  }

  /**
   * Find position of where current score should be placed in the leaderboard.
   * @param {[]} leaderboardStorage
   * - Array of player names and their scores.
   * @return {number} Position of the current player score.
   */

  #leaderboardPosition(leaderboardStorage) {
    // Find adequate position in the leaderboard
    for (let i = leaderboardStorage.length - 1; i >= 0; i--) {
      if (this.currentPlayerScore.score <= leaderboardStorage[i].score) {
        // If both scores are equal, check who holds higher position alphabetically
        if (
          this.currentPlayerScore.score === leaderboardStorage[i].score &&
          this.#currentNameIsHigher(
            this.currentPlayerScore.player,
            leaderboardStorage[i].player
          )
        ) {
          continue;
        } else {
          return i + 1;
        }
      }
    }

    return 0;
  }

  /**
   * Check if the first name should be alphabetically placed before second name.
   * @param {string} name1
   * - Value that is being compared.
   * @param {string} name2
   * - Value against which the first value is being compared to.
   * @return {boolean} True if the name1 value should be placed in front of name2.
   */

  #currentNameIsHigher(name1, name2) {
    let length =
      name1.length > name2.length ? name1.length - 1 : name2.length - 1;

    // Check each letter
    for (let i = 0; i <= length; i++) {
      if (name1[i] === undefined || name1[i] < name2[i]) {
        return true;
      }

      if (name2[i] === undefined) {
        return false;
      }
    }

    return false;
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