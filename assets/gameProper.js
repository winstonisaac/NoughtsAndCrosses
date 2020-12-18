let symbolsList = ["✕", "⭘"];
let whoseTurn = 0;
let currentView = 0;
let movesHistory = [
  [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ],
];
let presentState;
let isRewind = false;
var gameCells;

document.querySelector("#reset").onclick = function () {
  //reset button
  document.querySelector("#xoGrid").style.filter =
    "drop-shadow(0px 5px 15px rgba(0,0,0,0.2))";
  document.querySelector("#travelTime").innerHTML = "";
  document.querySelector("#winnerAnnounce").textContent = "";
  whoseTurn = 0;
  currentView = 0;
  movesHistory = [
    [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ],
  ];
  isRewind = false;
  var gameCells = document.querySelectorAll("div.xoCell");
  document.querySelector("#prev").classList.add("disabled");
  document.querySelector("#next").classList.add("disabled");
  document.querySelector("#prev").onclick = () => {};
  document.querySelector("#next").onclick = () => {};
  for (let gameCell of gameCells) {
    gameCell.classList.add("empty");
    gameCell.textContent = "";
  }
  initBoard();
};

function presentButton() {
  document.querySelector("#present").onclick = function () {
    document.querySelector("#xoGrid").style.filter =
      "drop-shadow(0px 5px 15px rgba(0,0,0,0.2))";
    var gameCells = document.querySelectorAll("div.xoCell");
    currentView = 0;
    isRewind = false;
    for (let outerCounter = 0; outerCounter < 3; outerCounter++) {
      for (let innerCounter = 0; innerCounter < 3; innerCounter++) {
        gameCells[outerCounter * 3 + innerCounter].textContent =
          movesHistory[currentView][outerCounter][innerCounter];
      }
    }
    document.querySelector("#travelTime").innerHTML = "";
    document.querySelector("#next").classList.add("disabled");
    document.querySelector("#next").onclick = () => {};
    alert("You have returned to the present.");
    enableTimeTravel();
    return;
  };
}

function enableTimeTravel() {
  document.querySelector("#prev").classList.remove("disabled");
  document.querySelector("#prev").onclick = function () {
    //revert button
    if (!isRewind) alert("Entering time travel mode.");
    isRewind = true;
    currentView++;
    document.querySelector("#xoGrid").style.filter =
      "blur(" +
      currentView / 2 +
      "px) drop-shadow(0px 5px 15px rgba(0,0,0,0.2))";
    var gameCells = document.querySelectorAll("div.xoCell");
    for (let outerCounter = 0; outerCounter < 3; outerCounter++) {
      for (let innerCounter = 0; innerCounter < 3; innerCounter++) {
        gameCells[outerCounter * 3 + innerCounter].textContent =
          movesHistory[currentView][outerCounter][innerCounter];
      }
    }
    document.querySelector("#travelTime").innerHTML =
      " TURN -" + currentView + "<button id = 'present'>&nbsp;▷</button>";
    presentButton();
    buttonCheck();
  };
}

function buttonCheck() {
  //check if it's possible to travel forward/backward
  document.querySelector("#next").classList.remove("disabled");
  if (currentView === whoseTurn) {
    document.querySelector("#prev").classList.add("disabled");
    document.querySelector("#prev").onclick = () => {};
  }
  document.querySelector("#next").onclick = function () {
    //next button, put here because we are sure that previous should be clicked before next can be
    document.querySelector("#xoGrid").style.filter =
      "blur(" +
      currentView / 4 +
      "px) drop-shadow(0px 5px 15px rgba(0,0,0,0.2))";
    isRewind = true;
    currentView--;
    var gameCells = document.querySelectorAll("div.xoCell");
    for (let outerCounter = 0; outerCounter < 3; outerCounter++) {
      for (let innerCounter = 0; innerCounter < 3; innerCounter++) {
        gameCells[outerCounter * 3 + innerCounter].textContent =
          movesHistory[currentView][outerCounter][innerCounter];
      }
    }
    if (!currentView) {
      //check if we are viewing the present and rightfully adjusts UI
      document.querySelector("#travelTime").innerHTML = "";
      document.querySelector("#next").classList.add("disabled");
      document.querySelector("#next").onclick = () => {};
      isRewind = false;
      alert("You have returned to the present.");
      enableTimeTravel();
      return;
    }
    document.querySelector("#travelTime").innerHTML =
      " TURN -" + currentView + "<button id = 'present'>&nbsp;▷</button>";
    presentButton();
    buttonCheck();
  };
}

function initBoard() {
  if (whoseTurn) enableTimeTravel();
  var gameCells = document.querySelectorAll("div.xoCell.empty");
  for (let gameCell of gameCells) {
    if (symbolsList[whoseTurn % 2] === "✕")
      gameCell.style.cursor = "url(assets/crossCursor.cur),progress";
    else gameCell.style.cursor = "url(assets/circleCursor.cur),progress";
    gameCell.onclick = function () {
      if (isRewind) {
        alert(
          "You are going to mess up the timeline! Please return to the present first."
        );
        return;
      }
      gameCell.textContent = symbolsList[whoseTurn % 2];
      whoseTurn++;
      gameCell.classList.remove("empty");
      cleanUp();
    };
  }
}

function cleanUp() {
  var gameCells = document.querySelectorAll("div.xoCell");
  for (let gameCell of gameCells) {
    gameCell.style.cursor = "initial";
    gameCell.onclick = () => {};
  }
  saveHistory();
}

function saveHistory() {
  var gameCells = document.querySelectorAll("div.xoCell");
  presentState = [[], [], []];
  for (let outerCounter = 0; outerCounter < 3; outerCounter++) {
    for (let innerCounter = 0; innerCounter < 3; innerCounter++) {
      presentState[outerCounter][innerCounter] =
        gameCells[outerCounter * 3 + innerCounter].textContent;
    }
  }
  movesHistory.unshift(presentState);
  if (whoseTurn >= 5) {
    if (checkEnd()) return;
  }
  if (whoseTurn === 9) {
    alert("It's a draw!");
    document.querySelector("#winnerAnnounce").textContent = "It's a draw!";
    var gameCells = document.querySelectorAll("div.xoCell");
    for (let gameCell of gameCells) gameCell.onclick = () => {};
    return;
  }
  initBoard();
}

function checkEnd() {
  if (
    (presentState[0][0] === presentState[0][1] &&
      presentState[0][0] === presentState[0][2] &&
      presentState[0][0] != "") ||
    (presentState[0][0] === presentState[1][1] &&
      presentState[0][0] === presentState[2][2] &&
      presentState[0][0] != "") ||
    (presentState[0][0] === presentState[1][0] &&
      presentState[0][0] === presentState[2][0] &&
      presentState[0][0] != "") ||
    (presentState[2][0] === presentState[2][1] &&
      presentState[2][0] === presentState[2][2] &&
      presentState[2][0] != "") ||
    (presentState[2][0] === presentState[1][1] &&
      presentState[2][0] === presentState[0][2] &&
      presentState[2][0] != "") ||
    (presentState[0][2] === presentState[1][2] &&
      presentState[0][2] === presentState[2][2] &&
      presentState[0][2] != "") ||
    (presentState[1][0] === presentState[1][1] &&
      presentState[1][0] === presentState[1][2] &&
      presentState[1][0] != "") ||
    (presentState[0][1] === presentState[1][1] &&
      presentState[0][1] === presentState[2][1] &&
      presentState[0][1] != "")
  ) {
    alert(symbolsList[(whoseTurn - 1) % 2] + " won!");
    document.querySelector("#winnerAnnounce").textContent =
      symbolsList[(whoseTurn - 1) % 2] + " won!";
    var gameCells = document.querySelectorAll("div.xoCell");
    for (let gameCell of gameCells) gameCell.onclick = () => {};
    return true;
  }
  return false;
}
initBoard(); //starts the game, responsible for continuity
