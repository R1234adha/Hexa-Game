const hexagons = document.querySelectorAll(".hexagon");
const turnText = document.getElementById("turnText");

let currentPlayer = 1;
let activePlayers = [1, 2, 3];

//below new code
let gameCode = "";
let playerNames = {
  1: "",
  2: "",
  3: ""
};
//above new code

const playerClasses = {
  1: "player1",
  2: "player2",
  3: "player3"
};

const playerSymbols = {
  1: { symbol: "LB", color: "#96bbe3" }, // Light Blue
  2: { symbol: "LG", color: "#b8e6c2" }, // Light Green
  3: { symbol: "LO", color: "#ebd8a2" }  // Light Yellow
};

const playerHexes = {
  1: [],
  2: [],
  3: []
};

//below new code

document.getElementById("generateLinkBtn").addEventListener("click", () => {
  gameCode = generateUniqueCode();
  document.getElementById("gameCodeDisplay").textContent = `Game Code: ${gameCode}`;
  document.getElementById("playerInputs").style.display = "block";
});

document.getElementById("startGameBtn").addEventListener("click", () => {
  playerNames[1] = document.getElementById("player1Name").value.trim() || "P1";
  playerNames[2] = document.getElementById("player2Name").value.trim() || "P2";
  playerNames[3] = document.getElementById("player3Name").value.trim() || "P3";

  // Update playerSymbols with first 2 letters
  playerSymbols[1].symbol = playerNames[1].substring(0, 2).toUpperCase();
  playerSymbols[2].symbol = playerNames[2].substring(0, 2).toUpperCase();
  playerSymbols[3].symbol = playerNames[3].substring(0, 2).toUpperCase();

  // Hide setup, show game
  document.getElementById("setupPage").style.display = "none";
  document.getElementById("gamePage").style.display = "block";

  updateTurnText();
});

function generateUniqueCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

//above new code

updateTurnText();

hexagons.forEach((hex, index) => {
  hex.setAttribute("data-index", index);

  hex.addEventListener("click", () => {
    if (hex.classList.contains("taken")) return;
    if (!activePlayers.includes(currentPlayer)) return;

    if (!hasAvailableAdjacentHex(currentPlayer)) {
      alert(`Player ${currentPlayer} (${playerSymbols[currentPlayer].symbol}) is out of the game!`);
      activePlayers = activePlayers.filter(p => p !== currentPlayer);
      checkForWinner();
      nextTurn();
      return;
    }

    const index = parseInt(hex.getAttribute("data-index"));
    if (playerHexes[currentPlayer].length === 0 || isAdjacentToPlayer(index, currentPlayer)) {
      claimHex(hex, index);
    } else {
      alert("You must select a hex adjacent to one you already own.");
    }
  });
});

function claimHex(hex, index) {
  hex.classList.add("taken", playerClasses[currentPlayer]);
  hex.textContent = playerSymbols[currentPlayer].symbol;
  hex.style.backgroundColor = playerSymbols[currentPlayer].color;
  playerHexes[currentPlayer].push(index);
  nextTurn();
}

function nextTurn() {
  if (activePlayers.length === 1) return;

  let nextIndex = (activePlayers.indexOf(currentPlayer) + 1) % activePlayers.length;
  let nextPlayer = activePlayers[nextIndex];

  while (!hasAvailableAdjacentHex(nextPlayer)) {
    alert(`Player ${nextPlayer} (${playerSymbols[nextPlayer].symbol}) is out of the game!`);
    activePlayers = activePlayers.filter(p => p !== nextPlayer);

    if (activePlayers.length === 1) {
      checkForWinner();
      return;
    }

    nextIndex = (activePlayers.indexOf(currentPlayer) + 1) % activePlayers.length;
    nextPlayer = activePlayers[nextIndex];
  }

  currentPlayer = nextPlayer;
  updateTurnText();
}

function checkForWinner() {
  if (activePlayers.length === 1) {
    const winner = activePlayers[0];
    const player = playerSymbols[winner];
    //alert(`🏆 Player ${winner} (${player.symbol}) wins the game!`);

    document.getElementById("winnerMessage").innerHTML =
      `🏆 <span style="color: ${player.color}; font-weight: bold;">Player ${winner} (${player.symbol})</span> wins the game!`;

    document.getElementById("gameOverScreen").style.display = "block";
    turnText.style.display = "none";

    // Disable hex grid interaction
    document.getElementById("hexGrid").classList.add("disabled-grid");

    
    // // 🔴 Hide controls
    // document.getElementById("controls").style.display = "none";
  }
}

function restartGame() {
  currentPlayer = 1;
  activePlayers = [1, 2, 3];

  playerHexes[1] = [];
  playerHexes[2] = [];
  playerHexes[3] = [];

  hexagons.forEach(hex => {
    hex.classList.remove("taken", "player1", "player2", "player3");
    hex.textContent = "";
    hex.style.backgroundColor = "";
  });

  document.getElementById("gameOverScreen").style.display = "none";
  turnText.style.display = "block";

  // Enable hex grid interaction
  document.getElementById("hexGrid").classList.remove("disabled-grid");

  //  // 🟢 Show controls again
  // document.getElementById("controls").style.display = "block";

  updateTurnText();
}

function updateTurnText() {
  const player = playerSymbols[currentPlayer];
  turnText.innerHTML = `Current Turn: <span style="color: ${player.color}; font-weight: bold;">Player ${currentPlayer} (${player.symbol})</span>`;
}

function isAdjacentToPlayer(index, player) {
  return playerHexes[player].some(i => getAdjacentIndexes(i).includes(index));
}

function hasAvailableAdjacentHex(player) {
  if (playerHexes[player].length === 0) return true;
  return playerHexes[player].some(index => {
    return getAdjacentIndexes(index).some(n => !hexagons[n].classList.contains("taken"));
  });
}

function getAdjacentIndexes(index) {
  const rowMap = [3, 4, 5, 6, 5, 4, 3];
  const rowStartIndexes = [];
  let count = 0;

  for (let r = 0; r < rowMap.length; r++) {
    rowStartIndexes.push(count);
    count += rowMap[r];
  }

  let row = 0;
  while (row < rowMap.length && index >= rowStartIndexes[row] + rowMap[row]) {
    row++;
  }

  const col = index - rowStartIndexes[row];
  const adjacents = [];

  const getIndex = (r, c) => {
    if (r < 0 || r >= rowMap.length || c < 0 || c >= rowMap[r]) return null;
    return rowStartIndexes[r] + c;
  };

    const evenRow = row % 2 === 0;

   // 6 directions: [dr, dc_even, dc_odd]
  const directions = [
    [-1, 0, -1],  // top-left
    [-1, 1, 0],   // top-right
    [0, -1, -1],  // left
    [0, 1, 1],    // right
    [1, 0, -1],   // bottom-left
    [1, 1, 0]     // bottom-right
  ];

 for (const [dr, dcEven, dcOdd] of directions) {
    const r = row + dr;
    const c = col + (evenRow ? dcEven : dcOdd);
    const adjIndex = getIndex(r, c);
    if (adjIndex !== null) {
      adjacents.push(adjIndex);
    }
  }

  return adjacents;
}
