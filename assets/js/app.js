import { PLAYER } from "./constants.js";
import Leaderboard from "./leaderboard.js";

class App {
  constructor() {
    this.score = 1500;
    this.playerName = localStorage.getItem(PLAYER);

    /* HTML array event listeners */
    this.playBtns = document.getElementsByClassName("play");
    this.switchPlayerBtns = document.getElementsByClassName("switch-player");

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

    // Button event listeners
    for (let i = 0; i < this.playBtns.length; i++) {
      this.playBtns[i].addEventListener("click", this.#playEvent);
    }
    for (let i = 0; i < this.switchPlayerBtns.length; i++) {
      this.switchPlayerBtns[i].addEventListener(
        "click",
        this.#switchPlayerEvent
      );
    }

    /* REMOVE ACCESS TO LEADERBOARD - FOR DEVELOPMENT
    this.leaderboard.storeCurrentScore();
    this.leaderboard.displayScore();
    this.leaderboard.displayCurrentScore();
    */
  }

  /**
   * Event listener for play and play again button. Starts the game.
   */

  #playEvent = (event) => {
    this.#closeCurrentModal();
    // start the game
  };

  /**
   * Event listener to switch player. Displays enter player screen.
   */

  #switchPlayerEvent = (event) => {
    this.#closeCurrentModal();
    this.#enterPlayer();
  };

  /**
   * Event listener for enter player - continue button.
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
      this.#closeCurrentModal();
      this.#confirmPlayer();
    }
  };

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
   * Display Confirm Player screen.
   */

  #confirmPlayer() {
    const confirmPlayerHTML = document.getElementById("confirm-player");

    confirmPlayerHTML.classList.remove("hide");

    this.#displayPlayerName();
  }

  /**
   * Close currently open modal.
   */

  #closeCurrentModal() {
    const modals = document.getElementsByTagName("section");

    for (let i = 0; i < modals.length; i++) {
      // Hide current modal
      if (!modals[i].classList.contains("hide")) {
        modals[i].classList.add("hide");
      }
    }
  }

  /**
   * Check if the Name a Player added is okay.
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
   * Display Player name on the confirm player screen.
   */

  #displayPlayerName() {
    const playerName = document.getElementById("display-player-name");
    playerName.innerText = localStorage.getItem(PLAYER);
  }

  /**
   * Displays the Error message.
   */

  #displayPlayerValidation(isError) {
    document.getElementById("validation-instructions").classList.add("hide");
    document.getElementById(isError).classList.remove("hide");
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
   * Save Player to local storage.
   */

  #addPlayerToLocalStorage() {
    this.playerName = document
      .getElementById("player-input")
      .value.trim()
      .toUpperCase();

    localStorage.setItem(PLAYER, this.playerName);
  }
}

new App();
