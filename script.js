const garden = document.getElementById('garden');
const menu = document.getElementById('menu');
const cashDisplay = document.getElementById('cashDisplay');
const titleDisplay = document.getElementById('titleDisplay');
const weatherIcon = document.getElementById('weatherIcon');
const dayTime = document.getElementById('dayTime');

const shopBtn = document.getElementById('shopBtn');
const inventoryBtn = document.getElementById('inventoryBtn');
const tasksBtn = document.getElementById('tasksBtn');
const achievementsBtn = document.getElementById('achievementsBtn');
const sellBtn = document.getElementById('sellBtn');

let cash = 50;
let titleLevel = 0;
let titles = ['Beginner Gardener', 'Skilled Farmer', 'Master Gardener'];
let plants = [];
let inventory = {};
let marketMultiplier = 1;
let weather = 'day'; // day, night, rain, snow
let dayPhase = 0; // increments for day-night cycle
let decorations = [];
let gardenPlots = 5;
let planterBox = 'wood'; // only wood for now
let growthIntervals = [];

const plantTypes = {
  strawberry: {
    name: 'Strawberry',
    img: 'https://i.imgur.com/JvBb4Fz.png',
    cost: 10,
    growthRate: 0.01,
    sellMultiplier: 1.5,
    maxSize: 3,
    bigSize: 2,
    superBigSize: 2.8
  },
  blueberry: {
    name: 'Blueberry Bush',
    img: 'https://i.imgur.com/wkfyJ9a.png',
    cost: 20,
    growthRate: 0.008,
    sellMultiplier: 1.7,
    maxSize: 2.5,
    bigSize: 1.8,
    superBigSize: 2.4
  },
  sunflower: {
    name: 'Sunflower',
    img: 'https://i.imgur.com/XwhrLHL.png',
    cost: 15,
    growthRate: 0.009,
    sellMultiplier: 1.6,
    maxSize: 3.2,
    bigSize: 2.1,
    superBigSize: 2.9
  }
};

function updateCash(amount) {
  cash += amount;
  if (cash < 0) cash = 0;
  cashDisplay.textContent = `💰 Cash: $${cash.toFixed(2)}`;
  updateTitle();
}

function updateTitle() {
  if (cash >= 500) titleLevel = 2;
  else if (cash >= 200) titleLevel = 1;
  else titleLevel = 0;
  titleDisplay.textContent = `🏅 Title: ${titles[titleLevel]}`;
}

function changeWeather() {
  const weathers = ['day', 'night', 'rain', 'snow'];
  dayPhase++;
  if(dayPhase >= weathers.length) dayPhase = 0;
  weather = weathers[dayPhase];
  const icons = {
    day: 'https://i.imgur.com/YBjeiNS.png',
    night: 'https://i.imgur.com/1xkedqc.png',
    rain: 'https://i.imgur.com/6ezFfyu.png',
    snow: 'https://i.imgur.com/ZL41Mpb.png'
  };
  weatherIcon.src = icons[weather];
  dayTime.textContent = weather.charAt(0).toUpperCase() + weather.slice(1);
}

function createPlant(typeKey, x, y) {
  const type = plantTypes[typeKey];
  if (!type) return;
  if (cash < type.cost) {
    alert('Not enough cash!');
    return;
  }
  updateCash(-type.cost);

  const plant = {
    id: Date.now(),
    type: typeKey,
    size: 0.2,
    x,
    y,
    plantedAt: Date.now(),
    watered: false,
    fertilized: false
  };

  plants.push(plant);
  inventory[typeKey] = (inventory[typeKey] || 0) + 1;
  renderGarden();
}

function renderGarden() {
  garden.innerHTML = '';
  for (const plant of plants) {
    const plantEl = document.createElement('img');
    plantEl.src = plantTypes[plant.type].img;
    plantEl.className = 'plant';
    plantEl.style.left = `${plant.x}px`;
    plantEl.style.bottom = `${plant.y}px`;
    plantEl.style.transform = `scale(${plant.size})`;
    plantEl.title = `${plantTypes[plant.type].name} (${(plant.size * 100).toFixed(0)}%)`;
    plantEl.onclick = () => harvestPlant(plant.id);
    garden.appendChild(plantEl);
  }
}

function growPlants() {
  for (const plant of plants) {
    const baseGrowth = plantTypes[plant.type].growthRate;

    let growthMultiplier = 1;
    if (weather === 'rain') growthMultiplier = 1.5;
    else if (weather === 'snow') growthMultiplier = 0.7;
    else if (weather === 'night') growthMultiplier = 0.6;

    if (plant.watered) growthMultiplier += 0.3;
    if (plant.fertilized) growthMultiplier += 0.5;

    plant.size += baseGrowth * growthMultiplier;

    const maxSize = plantTypes[plant.type].maxSize;

    if (plant.size > maxSize) plant.size = maxSize;
  }
  renderGarden();
}

function harvestPlant(id) {
  const index = plants.findIndex(p => p.id === id);
  if (index === -1) return;
  const plant = plants[index];
  let multiplier = 1.5; // base multiplier

  if (plant.size >= plantTypes[plant.type].superBigSize) multiplier = 15;
  else if (plant.size >= plantTypes[plant.type].bigSize) multiplier = 3;

  const basePrice = plantTypes[plant.type].cost;
  const sellPrice = basePrice * multiplier;
  updateCash(sellPrice);

  plants.splice(index, 1);
  renderGarden();
}

function openMenu(type) {
  menu.innerHTML = '';
  menu.classList.add('open');

  if (type === 'shop') {
    menu.innerHTML = `<h2>Shop</h2>`;
    for (const key in plantTypes) {
      const pt = plantTypes[key];
      const btn = document.createElement('button');
      btn.className = 'button';
      btn.textContent = `${pt.name} - $${pt.cost.toFixed(2)}`;
      btn.onclick = () => {
        createPlant(key, Math.random() * (garden.clientWidth - 50), 20);
      };
      menu.appendChild(btn);
    }
  } else if (type === 'inventory') {
    menu.innerHTML = `<h2>Inventory</h2>`;
    for (const key in inventory) {
      if (inventory[key] > 0) {
        const div = document.createElement('div');
        div.className = 'inventory-item';
        div.innerHTML = `<img src="${plantTypes[key].img}" alt="${key}" /> <span>${plantTypes[key].name} x${inventory[key]}</span>`;
        menu.appendChild(div);
      }
    }
    if (Object.keys(inventory).length === 0) menu.innerHTML += '<p>No plants in inventory.</p>';
  } else if (type === 'tasks') {
    menu.innerHTML = `<h2>Tasks</h2><p>Water your plants regularly! Harvest big plants for more money!</p>`;
  } else if (type === 'achievements') {
    menu.innerHTML = `<h2>Achievements</h2><p>Coming soon!</p>`;
  } else if (type === 'sell') {
    menu.innerHTML = `<h2>Sell Plants</h2><p>Click plants in the garden to harvest and sell.</p>`;
  }

  // Add close button
  const closeBtn = document.createElement('button');
  closeBtn.className = 'button';
  closeBtn.textContent = 'Close';
  closeBtn.onclick = () => {
    menu.classList.remove('open');
  };
  menu.appendChild(closeBtn);
}

// Event Listeners for buttons
shopBtn.onclick = () => openMenu('shop');
inventoryBtn.onclick = () => openMenu('inventory');
tasksBtn.onclick = () => openMenu('tasks');
achievementsBtn.onclick = () => openMenu('achievements');
sellBtn.onclick = () => openMenu('sell');

setInterval(() => {
  growPlants();
}, 3000); // growth every 3 seconds

setInterval(() => {
  changeWeather();
}, 30000); // weather change every 30 seconds

// Initial setup
renderGarden();
updateCash(0);
