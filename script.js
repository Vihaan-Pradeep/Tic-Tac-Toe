const WINS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
  [0, 4, 8], [2, 4, 6]             // diagonals
];

let board = Array(9).fill(null);
let currentPlayer = 1; // 1 or 2
let gameOver = false;
let mode = 1; // 1 = one player, 2 = two player

const cells     = document.querySelectorAll('.cell');
const statusEl  = document.getElementById('status');
const boardEl   = document.getElementById('board');
const overlay   = document.getElementById('overlay');
const overlayTx = document.getElementById('overlay-text');
const replayBtn = document.getElementById('replay-btn');
const btnOne    = document.getElementById('btn-one');
const btnTwo    = document.getElementById('btn-two');

function setStatus(text, player) {
  statusEl.textContent = text;
  statusEl.className = 'status' + (player ? ` p${player}` : '');
}

function resetGame() {
  board = Array(9).fill(null);
  currentPlayer = 1;
  gameOver = false;

  cells.forEach(cell => {
    cell.textContent = '';
    cell.removeAttribute('data-symbol');
    cell.classList.remove('win-cell');
    cell.disabled = false;
  });

  boardEl.classList.remove('ended');
  overlay.classList.add('hidden');
  setStatus("Player 1's turn", 1);
}

function checkWinner() {
  for (const combo of WINS) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], combo };
    }
  }
  if (board.every(cell => cell !== null)) return { winner: 'tie', combo: [] };
  return null;
}

function endGame(result) {
  gameOver = true;
  boardEl.classList.add('ended');

  if (result.winner === 'tie') {
    overlayTx.textContent = "It's a tie";
    setStatus("It's a tie");
  } else {
    result.combo.forEach(i => cells[i].classList.add('win-cell'));
    const name = result.winner === 'X' ? 'Player 1' : (mode === 1 ? 'Computer' : 'Player 2');
    overlayTx.textContent = `${name} wins`;
    setStatus(`${name} wins`);
  }

  overlay.classList.remove('hidden');
}
function computerMove() {
  const empty = board
    .map((val, i) => val === null ? i : null)
    .filter(i => i !== null);

  const index = empty[Math.floor(Math.random() * empty.length)];

  board[index] = 'O';
  cells[index].textContent = 'O';
  cells[index].setAttribute('data-symbol', 'O');
  cells[index].disabled = true;

  const result = checkWinner();
  if (result) { endGame(result); return; }

  currentPlayer = 1;
  setStatus("Player 1's turn", 1);
}
function handleClick(e) {
  const cell = e.currentTarget;
  const index = parseInt(cell.dataset.index);

  if (gameOver || board[index]) return;

  const symbol = currentPlayer === 1 ? 'X' : 'O';
  board[index] = symbol;
  cell.textContent = symbol;
  cell.setAttribute('data-symbol', symbol);
  cell.disabled = true;

  const result = checkWinner();
  if (result) {
    endGame(result);
    return;
  }

  if (mode === 1) {
    computerMove();
  } else {
    currentPlayer = 2;
    setStatus("Player 2's turn", 2);
  }
}

cells.forEach(cell => cell.addEventListener('click', handleClick));
replayBtn.addEventListener('click', resetGame);

btnOne.addEventListener('click', () => {
  if (mode === 1) return;
  mode = 1;
  btnOne.classList.add('active');
  btnTwo.classList.remove('active');
  resetGame();
});

btnTwo.addEventListener('click', () => {
  if (mode === 2) return;
  mode = 2;
  btnTwo.classList.add('active');
  btnOne.classList.remove('active');
  resetGame();
});

// init
setStatus("Player 1's turn", 1);
