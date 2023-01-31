import { SCORES, PLAYER } from "./constants.js";
import Leaderboard from "./leaderboard.js";

class App {
  constructor() {
    this.score = 1500;
    this.playerName = localStorage.getItem(PLAYER);

    this.init();
  }

  init() {
    // Enter player is ran automatically only the first time, when local storage is empty
    if (!this.playerName) {
      this.#enterPlayer();
    }

    /* REMOVE ACCESS TO LEADERBOARD - FOR DEVELOPMENT
    this.leaderboard.storeCurrentScore();
    this.leaderboard.displayScore();
    this.leaderboard.displayCurrentScore();
    */
  }

  /** 
  * Display Enter Player screen.
  */

  #enterPlayer() {
    const enterPlayerHTML = document.getElementById("enter-player");

    enterPlayerHTML.classList.remove("hide");

    // Listen for Continue button click.
    document
      .getElementById("continue-submit")
      .addEventListener("click", this.#enterPlayerContinueBtn);
  }

  #enterPlayerContinueBtn = (event) => {};
}

new App();
