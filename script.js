// State
let reputation = 0, posts = 0, money = 100;
const room = document.getElementById('room');
const logEl = document.getElementById('log');

// Sidebar buttons & panel
const panel = document.getElementById('panel');
const panelContent = document.getElementById('panel-content');
document.querySelectorAll('.sidebar button').forEach(btn => {
  btn.addEventListener('click', () => openPanel(btn.id));
});
panel.querySelector('.close').addEventListener('click', closePanel);

// Load & save
function save() {
  localStorage.setItem('hackerSim', JSON.stringify({ reputation, posts, money }));
}
function load() {
  const s = JSON.parse(localStorage.getItem('hackerSim'));
  if (s) ({ reputation, posts, money } = s);
  updateStats();
}
load();

// Update stats display
function updateStats() {
  document.getElementById('reputation').textContent = reputation;
  document.getElementById('posts').textContent = posts;
  document.getElementById('money').textContent = money;
}

// Logging
function log(msg) {
  const e = document.createElement('div');
  e.className = 'entry';
  e.textContent = msg;
  logEl.prepend(e);
  if (logEl.childElementCount > 12) logEl.removeChild(logEl.lastChild);
}

// Panel logic
function openPanel(id) {
  panelContent.innerHTML = '';
  if (id === 'btn-work')        renderWork();
  else if (id === 'btn-post')   renderPost();
  else if (id === 'btn-decorate')renderDecorate();
  else if (id === 'btn-shop')   renderShop();
  panel.classList.add('open');
}
function closePanel() {
  panel.classList.remove('open');
}

// Panel renderers
function renderWork() {
  panelContent.innerHTML = `<h2>💼 Freelance Work</h2>
    <button onclick="doWork()">Earn Money</button>`;
}
function renderPost() {
  panelContent.innerHTML = `<h2>⌨️ Post Fake Doxx</h2>
    <button onclick="doPost()">Post Now</button>`;
}
function renderDecorate() {
  panelContent.innerHTML = `<h2>🎨 Decorate Room</h2>
    <div class="item-list">
      <!-- replace these src's with your own décor images -->
      <img src="https://via.placeholder.com/60?text=Poster" alt="Poster" onclick="addDecoration(this.src)">
      <img src="https://via.placeholder.com/60?text=Plant"  alt="Plant"  onclick="addDecoration(this.src)">
      <img src="https://via.placeholder.com/60?text=Lamp"   alt="Lamp"   onclick="addDecoration(this.src)">
    </div>`;
}
function renderShop() {
  panelContent.innerHTML = `<h2>🛒 Shop</h2>
    <div class="shop-item">
      <span>Chair ($50)</span>
      <button onclick="buy('chair')">Buy</button>
    </div>
    <div class="shop-item">
      <span>Desk ($100)</span>
      <button onclick="buy('desk')">Buy</button>
    </div>`;
}

// Actions
function doWork() {
  const earn = Math.floor(Math.random()*30)+20;
  money += earn; log(`💼 Earned $${earn}`); updateStats(); save();
}
function doPost() {
  const success = Math.random()>0.3;
  if (success) {
    const gain = Math.floor(Math.random()*20)+10;
    reputation+=gain; posts++;
    log(`✅ Posted! +${gain} Rep`);
  } else {
    const loss = Math.floor(Math.random()*15)+5;
    reputation = Math.max(0, reputation-loss);
    log(`❌ Reported! -${loss} Rep`);
  }
  updateStats(); save();
}
function addDecoration(src) {
  const img = document.createElement('img');
  img.src = src;
  img.style.position = 'absolute';
  img.style.width = '40px';
  img.style.top = `${50 + Math.random()*200}px`;
  img.style.left= `${50 + Math.random()*200}px`;
  room.appendChild(img);
  log('🖼️ Placed decoration');
  save();
}
function buy(item) {
  const prices = { chair:50, desk:100 };
  if (money >= prices[item]) {
    money -= prices[item];
    log(`🛒 Bought ${item}`);
    updateStats(); save();
  } else {
    log('❌ Not enough money');
  }
}
// State
let reputation = 0, posts = 0, money = 100;
const room = document.getElementById('room');
const logEl = document.getElementById('log');

// Sidebar buttons & panel
const panel = document.getElementById('panel');
const panelContent = document.getElementById('panel-content');
document.querySelectorAll('.sidebar button').forEach(btn => {
  btn.addEventListener('click', () => openPanel(btn.id));
});
panel.querySelector('.close').addEventListener('click', closePanel);

// Load & save
function save() {
  localStorage.setItem('hackerSim', JSON.stringify({ reputation, posts, money }));
}
function load() {
  const s = JSON.parse(localStorage.getItem('hackerSim'));
  if (s) ({ reputation, posts, money } = s);
  updateStats();
}
load();

// Update stats display
function updateStats() {
  document.getElementById('reputation').textContent = reputation;
  document.getElementById('posts').textContent = posts;
  document.getElementById('money').textContent = money;
}

// Logging
function log(msg) {
  const e = document.createElement('div');
  e.className = 'entry';
  e.textContent = msg;
  logEl.prepend(e);
  if (logEl.childElementCount > 12) logEl.removeChild(logEl.lastChild);
}

// Panel logic
function openPanel(id) {
  panelContent.innerHTML = '';
  if (id === 'btn-work')        renderWork();
  else if (id === 'btn-post')   renderPost();
  else if (id === 'btn-decorate')renderDecorate();
  else if (id === 'btn-shop')   renderShop();
  panel.classList.add('open');
}
function closePanel() {
  panel.classList.remove('open');
}

// Panel renderers
function renderWork() {
  panelContent.innerHTML = `<h2>💼 Freelance Work</h2>
    <button onclick="doWork()">Earn Money</button>`;
}
function renderPost() {
  panelContent.innerHTML = `<h2>⌨️ Post Fake Doxx</h2>
    <button onclick="doPost()">Post Now</button>`;
}
function renderDecorate() {
  panelContent.innerHTML = `<h2>🎨 Decorate Room</h2>
    <div class="item-list">
      <!-- replace these src's with your own décor images -->
      <img src="https://via.placeholder.com/60?text=Poster" alt="Poster" onclick="addDecoration(this.src)">
      <img src="https://via.placeholder.com/60?text=Plant"  alt="Plant"  onclick="addDecoration(this.src)">
      <img src="https://via.placeholder.com/60?text=Lamp"   alt="Lamp"   onclick="addDecoration(this.src)">
    </div>`;
}
function renderShop() {
  panelContent.innerHTML = `<h2>🛒 Shop</h2>
    <div class="shop-item">
      <span>Chair ($50)</span>
      <button onclick="buy('chair')">Buy</button>
    </div>
    <div class="shop-item">
      <span>Desk ($100)</span>
      <button onclick="buy('desk')">Buy</button>
    </div>`;
}

// Actions
function doWork() {
  const earn = Math.floor(Math.random()*30)+20;
  money += earn; log(`💼 Earned $${earn}`); updateStats(); save();
}
function doPost() {
  const success = Math.random()>0.3;
  if (success) {
    const gain = Math.floor(Math.random()*20)+10;
    reputation+=gain; posts++;
    log(`✅ Posted! +${gain} Rep`);
  } else {
    const loss = Math.floor(Math.random()*15)+5;
    reputation = Math.max(0, reputation-loss);
    log(`❌ Reported! -${loss} Rep`);
  }
  updateStats(); save();
}
function addDecoration(src) {
  const img = document.createElement('img');
  img.src = src;
  img.style.position = 'absolute';
  img.style.width = '40px';
  img.style.top = `${50 + Math.random()*200}px`;
  img.style.left= `${50 + Math.random()*200}px`;
  room.appendChild(img);
  log('🖼️ Placed decoration');
  save();
}
function buy(item) {
  const prices = { chair:50, desk:100 };
  if (money >= prices[item]) {
    money -= prices[item];
    log(`🛒 Bought ${item}`);
    updateStats(); save();
  } else {
    log('❌ Not enough money');
  }
}
// State
let reputation = 0, posts = 0, money = 100;
const room = document.getElementById('room');
const logEl = document.getElementById('log');

// Sidebar buttons & panel
const panel = document.getElementById('panel');
const panelContent = document.getElementById('panel-content');
document.querySelectorAll('.sidebar button').forEach(btn => {
  btn.addEventListener('click', () => openPanel(btn.id));
});
panel.querySelector('.close').addEventListener('click', closePanel);

// Load & save
function save() {
  localStorage.setItem('hackerSim', JSON.stringify({ reputation, posts, money }));
}
function load() {
  const s = JSON.parse(localStorage.getItem('hackerSim'));
  if (s) ({ reputation, posts, money } = s);
  updateStats();
}
load();

// Update stats display
function updateStats() {
  document.getElementById('reputation').textContent = reputation;
  document.getElementById('posts').textContent = posts;
  document.getElementById('money').textContent = money;
}

// Logging
function log(msg) {
  const e = document.createElement('div');
  e.className = 'entry';
  e.textContent = msg;
  logEl.prepend(e);
  if (logEl.childElementCount > 12) logEl.removeChild(logEl.lastChild);
}

// Panel logic
function openPanel(id) {
  panelContent.innerHTML = '';
  if (id === 'btn-work')        renderWork();
  else if (id === 'btn-post')   renderPost();
  else if (id === 'btn-decorate')renderDecorate();
  else if (id === 'btn-shop')   renderShop();
  panel.classList.add('open');
}
function closePanel() {
  panel.classList.remove('open');
}

// Panel renderers
function renderWork() {
  panelContent.innerHTML = `<h2>💼 Freelance Work</h2>
    <button onclick="doWork()">Earn Money</button>`;
}
function renderPost() {
  panelContent.innerHTML = `<h2>⌨️ Post Fake Doxx</h2>
    <button onclick="doPost()">Post Now</button>`;
}
function renderDecorate() {
  panelContent.innerHTML = `<h2>🎨 Decorate Room</h2>
    <div class="item-list">
      <!-- replace these src's with your own décor images -->
      <img src="https://via.placeholder.com/60?text=Poster" alt="Poster" onclick="addDecoration(this.src)">
      <img src="https://via.placeholder.com/60?text=Plant"  alt="Plant"  onclick="addDecoration(this.src)">
      <img src="https://via.placeholder.com/60?text=Lamp"   alt="Lamp"   onclick="addDecoration(this.src)">
    </div>`;
}
function renderShop() {
  panelContent.innerHTML = `<h2>🛒 Shop</h2>
    <div class="shop-item">
      <span>Chair ($50)</span>
      <button onclick="buy('chair')">Buy</button>
    </div>
    <div class="shop-item">
      <span>Desk ($100)</span>
      <button onclick="buy('desk')">Buy</button>
    </div>`;
}

// Actions
function doWork() {
  const earn = Math.floor(Math.random()*30)+20;
  money += earn; log(`💼 Earned $${earn}`); updateStats(); save();
}
function doPost() {
  const success = Math.random()>0.3;
  if (success) {
    const gain = Math.floor(Math.random()*20)+10;
    reputation+=gain; posts++;
    log(`✅ Posted! +${gain} Rep`);
  } else {
    const loss = Math.floor(Math.random()*15)+5;
    reputation = Math.max(0, reputation-loss);
    log(`❌ Reported! -${loss} Rep`);
  }
  updateStats(); save();
}
function addDecoration(src) {
  const img = document.createElement('img');
  img.src = src;
  img.style.position = 'absolute';
  img.style.width = '40px';
  img.style.top = `${50 + Math.random()*200}px`;
  img.style.left= `${50 + Math.random()*200}px`;
  room.appendChild(img);
  log('🖼️ Placed decoration');
  save();
}
function buy(item) {
  const prices = { chair:50, desk:100 };
  if (money >= prices[item]) {
    money -= prices[item];
    log(`🛒 Bought ${item}`);
    updateStats(); save();
  } else {
    log('❌ Not enough money');
  }
}
