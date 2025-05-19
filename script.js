// ========================
// PIXEL FARM: script.js
// ========================

// --- DOM ELEMENTS ---
const cashDisplay = document.getElementById("cash");
const plantingArea = document.getElementById("plantingArea");

const shopBtn = document.getElementById("shopBtn");
const inventoryBtn = document.getElementById("inventoryBtn");
const tasksBtn = document.getElementById("tasksBtn");
const achievementsBtn = document.getElementById("achievementsBtn");
const sellBtn = document.getElementById("sellBtn");

const closeButtons = document.querySelectorAll(".close-btn");
const shopWindow = document.getElementById("shopWindow");
const inventoryWindow = document.getElementById("inventoryWindow");
const tasksWindow = document.getElementById("tasksWindow");
const achievementsWindow = document.getElementById("achievementsWindow");
const sellWindow = document.getElementById("sellWindow");

// --- GAME STATE ---
let cash = 50.00;
let plantIdCounter = 0;
let plants = [];

// Placeholder for advanced features:
let wateringCount = 0;
let fertilizerCount = 0;
let plotCount = 5;
let decorations = [];
let planterType = "wood"; // only wood implemented

// --- PLANT DEFINITIONS ---
const plantTypes = [
  { id: "strawberry",  name: "Strawberry",      img: "https://i.imgur.com/JvBb4Fz.png", cost: 20, sellMult: 1.5, growTime: 24000 },
  { id: "blueberry",  name: "Blueberry Bush", img: "https://i.imgur.com/wkfyJ9a.png", cost: 30, sellMult: 1.8, growTime: 36000 },
  { id: "sunflower",  name: "Sunflower",      img: "https://i.imgur.com/XwhrLHL.png", cost: 10, sellMult: 1.3, growTime: 18000 }
];

// --- UTILITY FUNCTIONS ---
function updateCash(amount=0) {
  cash = Math.max(0, cash + amount);
  cashDisplay.textContent = cash.toFixed(2);
}

function openUI(windowEl) {
  document.querySelectorAll(".ui-window").forEach(w => w.classList.remove("active"));
  windowEl.classList.add("active");
}
closeButtons.forEach(btn => btn.addEventListener("click", () => btn.parentElement.classList.remove("active")));

// --- PLANTING & GROWTH ---
function plantSeed(type) {
  if (cash < type.cost) { alert("Not enough cash!"); return; }
  updateCash(-type.cost);

  const id = ++plantIdCounter;
  const x = Math.random() * (plantingArea.clientWidth - 48);
  const y = Math.random() * (plantingArea.clientHeight - 48);
  const el = document.createElement("img");
  el.src = type.img;
  el.className = "plant small";
  el.style.left = `${x}px`;
  el.style.top  = `${y}px`;
  plantingArea.appendChild(el);

  const plant = {
    id, type, el, growth: 0,
    plantedAt: Date.now(),
    watered: false, fertilized: false
  };
  plants.push(plant);
  el.onclick = () => harvestPlant(id);

  // automatic growth
  const interval = setInterval(() => {
    if (plant.growth < 4) {
      plant.growth++;
      updatePlantSize(plant);
    } else clearInterval(interval);
  }, type.growTime / 4);
}

function updatePlantSize(plant) {
  plant.el.classList.remove("small", "medium", "large", "super-large");
  if (plant.growth < 1)            plant.el.classList.add("small");
  else if (plant.growth < 2)       plant.el.classList.add("medium");
  else if (plant.growth < 3)       plant.el.classList.add("large");
  else /* growth >=4 */            plant.el.classList.add("super-large");
}

// --- HARVEST & SELL ---
function harvestPlant(id) {
  const idx = plants.findIndex(p => p.id === id);
  if (idx === -1) return;
  const p = plants[idx];
  if (p.growth < 1) { alert("Too small to sell!"); return; }

  // determine multiplier
  let sizeMult = 1;
  if (p.growth >= 4) sizeMult = 15;
  else if (p.growth >= 2) sizeMult = 3;
  const price = Math.round(p.type.cost * p.type.sellMult * sizeMult);
  updateCash(price);

  plantingArea.removeChild(p.el);
  plants.splice(idx, 1);
}

// --- UI RENDERING ---
function renderShop() {
  const container = document.getElementById("shopItems");
  container.innerHTML = "";
  plantTypes.forEach(pt => {
    const d = document.createElement("div");
    d.className = "item";
    d.innerHTML = `<div>${pt.name} - $${pt.cost}</div><img src="${pt.img}">`;
    d.onclick = () => plantSeed(pt);
    container.appendChild(d);
  });
}

function renderInventory() {
  const c = document.getElementById("inventoryItems");
  c.innerHTML = `
    <div>Watering Cans: ${wateringCount}</div>
    <div>Fertilizer Bags: ${fertilizerCount}</div>
    <div>Plots: ${plotCount}</div>
    <div>Planter Box: ${planterType}</div>
  `;
}

function renderTasks() {
  document.getElementById("tasksList").innerHTML = `
    <div>Plant 5 seeds</div>
    <div>Harvest 3 large plants</div>
    <div>Earn $100</div>
  `;
}

function renderAchievements() {
  document.getElementById("achievementsList").innerHTML = `
    <div>First Plant Planted!</div>
    <div>Earn $1000</div>
  `;
}

function renderSellList() {
  const c = document.getElementById("sellList");
  c.innerHTML = "";
  plants.forEach(p => {
    const d = document.createElement("div");
    d.className = "item";
    d.innerHTML = `<div>${p.type.name} (Stage ${p.growth})</div><img src="${p.type.img}">`;
    d.onclick = () => harvestPlant(p.id);
    c.appendChild(d);
  });
  if (!plants.length) c.innerText = "No plants to sell.";
}

// --- BUTTON EVENTS ---
shopBtn.onclick         = () => { renderShop();         openUI(shopWindow); };
inventoryBtn.onclick    = () => { renderInventory();    openUI(inventoryWindow); };
tasksBtn.onclick        = () => { renderTasks();        openUI(tasksWindow); };
achievementsBtn.onclick = () => { renderAchievements(); openUI(achievementsWindow); };
sellBtn.onclick         = () => { renderSellList();     openUI(sellWindow); };

// --- INITIALIZE ---
updateCash(0);
renderShop();
