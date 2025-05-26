// script.js - Casino Slot Logic

const symbols = [
  'Cherry', 'Lemon', 'StrawBerry', 'Grape', 'Apple',
  'Banana', 'Watermelon', 'Bell', 'HorseShoe', 'Clover',
  'Diamond', '7', 'Bar'
];

const symbolImages = {
  Cherry: 'https://i.imgur.com/WLHb6TA.png',
  Lemon: 'https://i.imgur.com/lovSpjQ.png',
  StrawBerry: 'https://i.imgur.com/IPVhR6k.png',
  Grape: 'https://i.imgur.com/BnEjjIk.png',
  Apple: 'https://i.imgur.com/HaxcHAt.png',
  Banana: 'https://i.imgur.com/i4IqK9n.png',
  Watermelon: 'https://i.imgur.com/jKJ260m.png',
  Bell: 'https://i.imgur.com/Xfqal0K.png',
  HorseShoe: 'https://i.imgur.com/PwFcwj1.png',
  Clover: 'https://i.imgur.com/QHtBDPf.png',
  Diamond: 'https://i.imgur.com/SGg68qy.png',
  '7': 'https://i.imgur.com/1uRKpwU.png',
  Bar: 'https://i.imgur.com/YrPdQ4k.png'
};

let balance = 100;

const balanceDisplay = document.getElementById('balance');
const spinButton = document.getElementById('spinButton');
const resultDisplay = document.getElementById('result');
const betInput = document.getElementById('betInput');
const bigWinOverlay = document.querySelector('.big-win-overlay');
const reels = document.querySelectorAll('.reel');

function updateBalanceDisplay() {
  balanceDisplay.textContent = `Balance: $${balance.toFixed(2)}`;
}

function getRandomSymbol() {
  return symbols[Math.floor(Math.random() * symbols.length)];
}

function createSymbolImage(symbol) {
  const img = document.createElement('img');
  img.src = symbolImages[symbol];
  img.alt = symbol;
  img.classList.add('spin');
  return img;
}

function spinReel(reel, delay = 0) {
  return new Promise((resolve) => {
    let spinCount = 15 + Math.floor(Math.random() * 10);
    let i = 0;
    const interval = setInterval(() => {
      const symbol = getRandomSymbol();
      reel.innerHTML = '';
      reel.appendChild(createSymbolImage(symbol));
      i++;
      if (i >= spinCount) {
        clearInterval(interval);
        resolve(symbol);
      }
    }, 100 + delay);
  });
}

function showBigWin() {
  bigWinOverlay.style.display = 'flex';
  setTimeout(() => {
    bigWinOverlay.style.display = 'none';
  }, 5000);
}

spinButton.addEventListener('click', async () => {
  const bet = parseFloat(betInput.value);
  if (isNaN(bet) || bet <= 0 || bet > balance) {
    resultDisplay.textContent = 'Invalid Bet!';
    return;
  }

  resultDisplay.textContent = '';
  balance -= bet;
  updateBalanceDisplay();

  const results = await Promise.all(
    Array.from(reels).map((reel, index) => spinReel(reel, index * 100))
  );

  const counts = {};
  results.forEach(sym => counts[sym] = (counts[sym] || 0) + 1);

  let win = 0;
  if (results.every((sym) => sym === '7')) {
    win = bet * 50;
    showBigWin();
  } else if (Object.values(counts).some(count => count >= 3)) {
    win = bet * 3;
  }

  balance += win;
  updateBalanceDisplay();
  resultDisplay.textContent = win > 0 ? `You won $${win.toFixed(2)}!` : 'No win. Try again!';
});

updateBalanceDisplay();
