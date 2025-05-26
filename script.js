// script.js - Slot Machine Logic

const symbols = [
  'https://i.imgur.com/WLHb6TA.png', // Cherry
  'https://i.imgur.com/lovSpjQ.png', // Lemon
  'https://i.imgur.com/IPVhR6k.png', // Strawberry
  'https://i.imgur.com/BnEjjIk.png', // Grape
  'https://i.imgur.com/HaxcHAt.png', // Apple
  'https://i.imgur.com/i4IqK9n.png', // Banana
  'https://i.imgur.com/jKJ260m.png', // Watermelon
  'https://i.imgur.com/Xfqal0K.png', // Bell
  'https://i.imgur.com/PwFcwj1.png', // Horse Shoe
  'https://i.imgur.com/QHtBDPf.png', // Clover
  'https://i.imgur.com/SGg68qy.png', // Diamond
  'https://i.imgur.com/Xc5qcpV.png', // 777
  'https://i.imgur.com/1uRKpwU.png', // 7
  'https://i.imgur.com/YrPdQ4k.png'  // Bar
];

const reels = document.querySelectorAll('.reel-column');
const spinButton = document.getElementById('spin-button');
const resultDiv = document.getElementById('result');
let balance = 100;
let betAmount = 10;

function updateBalanceUI() {
  document.getElementById('balance').textContent = `Balance: $${balance}`;
}

function showBigWin() {
  const overlay = document.createElement('div');
  overlay.className = 'big-win-overlay';
  overlay.style.display = 'flex';
  overlay.innerHTML = `
    <img class="big-win-image" src="https://i.imgur.com/NyYN8XU.png" alt="Big Win">
    <div class="big-win-text">JACKPOT! YOU WON!</div>
  `;
  document.body.appendChild(overlay);
  setTimeout(() => overlay.remove(), 4000);
}

function spinReels() {
  if (balance < betAmount) {
    resultDiv.textContent = "Not enough balance!";
    return;
  }

  resultDiv.textContent = "";
  balance -= betAmount;
  updateBalanceUI();

  const results = [];
  reels.forEach((column) => {
    const children = column.querySelectorAll('.reel');
    children.forEach(reel => {
      const img = reel.querySelector('img');
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];
      img.classList.remove('spin');
      void img.offsetWidth;
      img.src = symbol;
      img.classList.add('spin');
      results.push(symbol);
    });
  });

  setTimeout(() => checkWin(results), 1000);
}

function checkWin(results) {
  const middleRowIndexes = [1, 4, 7, 10, 13];
  const middleRow = middleRowIndexes.map(i => results[i]);
  const [first, ...rest] = middleRow;
  const isWin = rest.every(symbol => symbol === first);

  if (isWin) {
    if (first === 'https://i.imgur.com/Xc5qcpV.png') {
      resultDiv.textContent = "🎉 JACKPOT! 777!";
      showBigWin();
      balance += betAmount * 100;
    } else {
      resultDiv.textContent = "🎉 You won!";
      balance += betAmount * 10;
    }
  } else {
    resultDiv.textContent = "Try again!";
  }
  updateBalanceUI();
}

function setupUI() {
  const controlSection = document.querySelector('.controls');
  const balanceLabel = document.createElement('div');
  balanceLabel.id = 'balance';
  balanceLabel.className = 'balance';
  controlSection.insertBefore(balanceLabel, spinButton);

  const betSelector = document.createElement('select');
  betSelector.className = 'bet-selector';
  [10, 20, 50].forEach(amount => {
    const option = document.createElement('option');
    option.value = amount;
    option.textContent = `Bet $${amount}`;
    betSelector.appendChild(option);
  });
  betSelector.addEventListener('change', (e) => {
    betAmount = parseInt(e.target.value);
  });
  controlSection.insertBefore(betSelector, spinButton);

  updateBalanceUI();
}

spinButton.addEventListener('click', spinReels);
document.addEventListener('DOMContentLoaded', setupUI);
