import { PLAYER } from "./constants.js";
import Leaderboard from "./leaderboard.js";

class App {
  constructor() {
    this.score = 1500;
    this.playerName = localStorage.getItem(PLAYER);

    this.init();
  }

  init() {
    // Enter player is ran automatically only the first time, when local storage is empty
    // Otherwise always ran confirm player screen.
    if (!this.playerName) {
      this.#enterPlayer();
    } else {
      this.#confirmPlayer();
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

  /**
   * Enter Player Continue button event listener.
   */

  #enterPlayerContinueBtn = (event) => {
    event.preventDefault();

    // Prevents displaying multiple errors at once.
    this.#refreshPlayerValidation();

    let isError = this.#checkPlayerNameInput();
    if (isError) {
      this.#displayPlayerValidation(isError);
    } else {
      this.#addPlayerToLocalStorage();
      // add player to local storage
      //continue on to the next screen
    }
  };

  /**
   * Check if the Name a Player inputted is okay.
   * @summary Checks if the character count is more than more than 10 and less than 3.
   * Checks if the player entered special characters which are not allowed.
   * @return {string} Error name, or empty string if there is no error.
   */

  #checkPlayerNameInput() {
    const playerInput = document
      .getElementById("player-input")
      .value.trim()
      .toUpperCase();
    const format = /[^a-zA-Z0-9- ]+$/;

    if (playerInput.length > 10 || playerInput.length < 3) {
      return "error-length";
    } else if (playerInput.match(format)) {
      return "error-char";
    }

    return "";
  }

  /**
   * Refresh Player validation to original values.
   */

  #refreshPlayerValidation() {
    document.getElementById("validation-instructions").classList.remove("hide");
    document.getElementById("error-length").classList.add("hide");
    document.getElementById("error-char").classList.add("hide");
  }

  /**
   * Displays the Error message.
   */

  #displayPlayerValidation(isError) {
    document.getElementById("validation-instructions").classList.add("hide");
    document.getElementById(isError).classList.remove("hide");
  }

  /**
   * Save Player to local storage.
   */

  #addPlayerToLocalStorage() {
    this.playerName = document
      .getElementById("player-input")
      .value.trim()
      .toUpperCase();

    localStorage.setItem(PLAYER, this.playerName);
  }

  /**
   * Display Confirm Player screen.
   */

  #confirmPlayer() {
    const confirmPlayerHTML = document.getElementById("confirm-player");

    confirmPlayerHTML.classList.remove("hide");

    this.#displayPlayerName();
    // event listener for start
    // event listener for switch player
  }

  /**
   * Display Player name on the confirm player screen.
   */

  #displayPlayerName() {
    const playerName = document.getElementById("display-player-name");
    playerName.innerText = localStorage.getItem(PLAYER);
  }
}

new App();
