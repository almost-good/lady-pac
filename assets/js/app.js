import { PLAYER, SCORES } from "./constants.js";
import Game from "./game.js";
import Leaderboard from "./leaderboard.js";

/**
 * App class which represents the main JS file.
 *
 * Public methods:
 *
 *     init()
 *     winLoseScreen(gameResult)
 *
 * Event listener methods:
 *
 *     #playEvent()
 *     #continuePlayEvent()
 *     #switchPlayerEvent()
 *     #enterPlayerContinueBtn()
 *     #enterHelpEvent()
 *     #leaveHelpEvent()
 *     #enterLeaderboardEvent()
 *     #toggleSoundEvent()
 *
 * Private methods:
 *
 *     #enterPlayer()
 *     #confirmPlayer()
 *     #closeCurrentModal()
 *     #checkPlayerNameInput()
 *     #displayHighScore()
 *     #displayPlayerName()
 *     #displayPlayerValidation(isError)
 *     #refreshPlayerValidation()
 *     #restoreLifes()
 *     #displayWinResult(modal)
 *     #displayLoseResult(modal)
 *     #toggleSound(removeSetting, addSetting)
 *     #addPlayerToLocalStorage()
 */

class App {
  constructor() {
    this.finalScore = 0;
    this.currentScore = 0;

    // Get the player from local storage.
    this.playerName = localStorage.getItem(PLAYER);

    // HTML btns by classes.
    this.playBtns = document.getElementsByClassName("play");
    this.continuePlayBtns = document.getElementsByClassName("play-again");
    this.switchPlayerBtns = document.getElementsByClassName("switch-player");

    // HTML btns by ID's.
    this.helpBtn = document.getElementById("help-btn");
    this.helpOkayBtn = document.getElementById("help-okay-btn");
    this.soundBtn = document.getElementById("sound");

    // Event listener for leaderboard.
    document
      .getElementById("leaderboard-btn")
      .addEventListener("click", this.#enterLeaderboardEvent);

    // Button event listeners.
    for (let i = 0; i < this.playBtns.length; i++) {
      this.playBtns[i].addEventListener("click", this.#playEvent);
    }

    for (let i = 0; i < this.continuePlayBtns.length; i++) {
      this.continuePlayBtns[i].addEventListener(
        "click",
        this.#continuePlayEvent
      );
    }

    for (let i = 0; i < this.switchPlayerBtns.length; i++) {
      this.switchPlayerBtns[i].addEventListener(
        "click",
        this.#switchPlayerEvent
      );
    }

    this.helpBtn.addEventListener("click", this.#enterHelpEvent);
    this.helpOkayBtn.addEventListener("click", this.#leaveHelpEvent);
    this.soundBtn.addEventListener("click", this.#toggleSoundEvent);

    // Create Game object and allow for view of the game area.
    this.game = new Game(this, this.currentScore);
    this.game.game();
  }

  init() {
    // Enter player screen is ran automatically only the first time, when local storage is still empty.
    // Otherwise always ran confirm player screen.
    if (!this.playerName) {
      this.#enterPlayer();
    } else {
      this.#confirmPlayer();
    }
  }

  /**
   * Screen that activates when the game is won or lost and displays the text accordingly.
   * The result of the game is saved in local storage, if it qualifies.
   */

  winLoseScreen(gameResult) {
    const winLoseHTML = document.getElementById("win-lose");

    winLoseHTML.classList.remove("hide");

    // Save final score.
    this.finalScore = parseInt(
      document.getElementById("current-score").innerText
    );

    // Create new leaderboard.
    this.leaderboard = new Leaderboard(this.finalScore, this.playerName);

    if (gameResult === "win") {
      this.#displayWinResult(winLoseHTML);
    } else if (gameResult === "lose") {
      this.#displayLoseResult(winLoseHTML);

      // If game is lost store the results.
      this.leaderboard.storeCurrentScore();
    }
  }

  /**
   * Event listener for play button. Starts the new game.
   */

  #playEvent = (event) => {
    this.#closeCurrentModal();

    // Clear any traces from previous instance of game.
    this.game.clear();

    this.#restoreLifes();

    // Restore current score.
    this.currentScore = 0;
    document.getElementById("current-score").innerText = this.currentScore;

    // Display high score
    this.#displayHighScore();

    this.game = new Game(this, this.currentScore);
    this.game.game();
  };

  /**
   * Event listener for continuing the play. Continues the game where left off.
   */

  #continuePlayEvent = (event) => {
    this.#closeCurrentModal();

    // Clear any traces from previous instance of game.
    this.game.clear();

    // Set the current score.
    this.currentScore = parseInt(
      document.getElementById("current-score").innerText
    );

    // Create new game.
    this.game = new Game(this, this.currentScore);
    this.game.game();
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
   * Event listener for help screen. Display help content.
   */

  #enterHelpEvent = (event) => {
    const helpHTML = document.getElementById("help");

    this.#closeCurrentModal();

    helpHTML.classList.remove("hide");
  };

  /**
   * Event listener for help screen. Closes help content.
   */

  #leaveHelpEvent = (event) => {
    this.#closeCurrentModal();
  };

  /**
   * Event listener for leaderboard screen. Display leaderboard content.
   */

  #enterLeaderboardEvent = (event) => {
    const leaderboardHTML = document.getElementById("leaderboard");

    this.#closeCurrentModal();

    leaderboardHTML.classList.remove("hide");

    this.leaderboard.displayScore();
    this.leaderboard.displayCurrentScore();
  };

  /**
   * Toggle between active and muted sound setting.
   */

  #toggleSoundEvent = (event) => {
    const volumeOff = "fa-volume-xmark";
    const volumeOn = "fa-volume-high";

    // Get the current volume setting and change it accordingly.
    if (this.soundBtn.classList.contains(volumeOff)) {
      this.#toggleSound(volumeOff, volumeOn);
    } else {
      this.#toggleSound(volumeOn, volumeOff);
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
   * Check if the Name which Player added is okay.
   * * @return {string} Returns name of the error or empty string.
   */

  #checkPlayerNameInput() {
    const playerInput = document
      .getElementById("player-input")
      .value.trim()
      .toUpperCase();
    const format = /[^a-zA-Z0-9- ]/;

    if (playerInput.length > 10 || playerInput.length < 3) {
      return "error-length";
    } else if (playerInput.match(format)) {
      return "error-char";
    }

    return "";
  }

  /**
   * Display top high score.
   */

  #displayHighScore() {
    const highScoreTopHTML = document.getElementById("highscore-top");

    if (JSON.parse(localStorage.getItem(SCORES))) {
      highScoreTopHTML.innerText = JSON.parse(
        localStorage.getItem(SCORES)
      )[0].score;
    }
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
   * Restore lifes needed for completely new game.
   */

  #restoreLifes() {
    this.lifesHTML = document.getElementById("lifes");
    this.lifeHTML = this.lifesHTML.getElementsByTagName("li");

    for (let i = 0; i < this.lifeHTML.length - 1; i++) {
      this.lifeHTML[i].classList.remove("hidden");
    }
  }

  /**
   * Display the win text message.
   * @param {object} modal - Win / Lose screen.
   */

  #displayWinResult(modal) {
    modal.querySelector("h2").innerText = "You won the game!";
    modal.querySelector("h2").classList.add("win");
    modal.querySelector("h3").innerText = "...can you do better?";

    modal.querySelector(".play-again").classList.remove("hide");
    modal.querySelector(".play").classList.add("hide");

    this.#leaderboardBtnSettings(".play-again", ".play");
  }

  /**
   * Displays the lose text message and store the game.
   * @param {object} modal - Win / Lose screen.
   */

  #displayLoseResult(modal) {
    modal.querySelector("h2").innerText = "You got eaten!";
    modal.querySelector("h2").classList.add("lose");
    modal.querySelector("h3").innerText = "...like a Pellet!";

    modal.querySelector(".play").classList.remove("hide");
    modal.querySelector(".play-again").classList.add("hide");

    this.#leaderboardBtnSettings(".play", ".play-again");
  }

  /**
   * Controls which leaderboard btns should be displayed..
   * @param {string} optionOne - Btn setting, .play/.play-again.
   * @param {string} optionTwo - Btn setting, .play/.play-again.
   */

  #leaderboardBtnSettings(optionOne, optionTwo) {
    const leaderboardBtns = document.getElementById("leaderboard-btns");
    leaderboardBtns.querySelector(optionOne).classList.remove("hide");
    leaderboardBtns.querySelector(optionTwo).classList.add("hide");
  }

  /**
   * Toggle sound settings from muted to active and other way around.
   * @param {string} removeSetting - Currently active setting.
   * @param {string} addSetting - Setting that will replace removed setting.
   */

  #toggleSound(removeSetting, addSetting) {
    this.soundBtn.classList.remove(removeSetting);
    this.soundBtn.classList.add(addSetting);
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

// APP

let game = new App();
game.init();