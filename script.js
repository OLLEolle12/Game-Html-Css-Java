const garden = document.getElementById('garden');
const menu = document.getElementById('menu');
const menuContent = document.getElementById('menuContent');
const cashDisplay = document.getElementById('cashDisplay');
const titleDisplay = document.getElementById('titleDisplay');
const weatherIcon = document.getElementById('weatherIcon');
const dayTime = document.getElementById('dayTime');

const shopBtn = document.getElementById('shopBtn');
const inventoryBtn = document.getElementById('inventoryBtn');
const tasksBtn = document.getElementById('tasksBtn');
const achievementsBtn = document.getElementById('achievementsBtn');
const sellBtn = document.getElementById('sellBtn');
const closeMenuBtn = document.getElementById('closeMenu');

let cash = 50; // start cash
let title = 'Beginner Gardener';

let weather = 'day'; // day, night, rain, snow
const weatherIcons = {
  day: 'https://i.imgur.com/YBjeiNS.png',
  night: 'https://i.imgur.com/1xkedqc.png',
  rain: 'https://i.imgur.com/6ezFfyu.png',
  snow: 'https://i.imgur.com/ZL41Mpb.png'
};

const plantTypes = {
  blueberry: {
    name: 'Blueberry Bush',
    cost: 15,
    img: 'https://i.imgur.com/wkfyJ9a.png',
    growthRate: 0.015,
    maxSize: 1,
    bigSize: 0.7,
    superBigSize: 0.9,
    sellMultiplier: 1.5
  },
  tree: {
    name: 'Tree',
    cost: 30,
    img: 'https://i.imgur.com/Gv7EYn5.png',
    growthRate: 0.007,
    maxSize: 1,
    bigSize: 0.8,
    superBigSize: 0.95,
    sellMultiplier: 1.7
  },
  bush: {
    name: 'Bush',
    cost: 10,
    img: 'https://i.imgur.com/tbXugY5.png',
    growthRate: 0.02,
    maxSize: 1,
    bigSize: 0.65,
    superBigSize: 0.85,
    sellMultiplier: 1.4
  },
  sunflower: {
    name: 'Sunflower',
    cost: 7,
    img: 'https://i.imgur.com/XwhrLHL.png',
    growthRate: 0.03,
    maxSize: 1,
    bigSize: 0.7,
    superBigSize: 0.9,
    sellMultiplier: 1.3
  },
  strawberry: {
    name: 'Strawberry Plant',
    cost: 20,
    img: 'https://i.imgur.com/JvBb4Fz.png',
    growthRate: 0.012,
    maxSize: 1,
    bigSize: 0.7,
    superBigSize: 0.9,
    sellMultiplier: 1.6
  }
};

let plants = [];
let inventory = {};

function updateCash(amount) {
  cash += amount;
  if (cash < 0) cash = 0;
  cashDisplay.textContent = `💰 Cash: $${cash.toFixed(2)}`;
  updateTitle();
}

function updateTitle() {
  if (cash >= 1000) title = 'Master Gardener';
  else if (cash >= 500) title = 'Green Thumb';
  else if (cash >= 200) title = 'Novice Planter';
  else if (cash >= 100) title = 'Growing Enthusiast';
  else title = 'Beginner Gardener';
  titleDisplay.textContent = `🏅 Title: ${title}`;
}

function changeWeather() {
  const options = ['day', 'night', 'rain', 'snow'];
  weather = options[Math.floor(Math.random() * options.length)];
  weatherIcon.src = weatherIcons[weather];
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
    size: 0.15,
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

  // Calculate multiplier based on size
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
  menuContent.innerHTML = '';
  menu.classList.add('open');

  if (type === 'shop') {
    menuContent.innerHTML = `<h2>Shop</h2>`;
    for (const key in plantTypes) {
      const pt = plantTypes[key];
      const btn = document.createElement('button');
      btn.className = 'button';
      btn.innerHTML = `<img src="${pt.img}" alt="${pt.name}" style="width:40px; height:40px; vertical-align:middle; margin-right:10px; filter: drop-shadow(1px 1px 1px #0007);"> ${pt.name} - $${pt.cost.toFixed(2)}`;
      btn.onclick = () => {
        const x = Math.random() * (garden.clientWidth - 60);
        createPlant(key, x, 20);
      };
      menuContent.appendChild(btn);
    }
  } else if (type === 'inventory') {
    menuContent.innerHTML = `<h2>Inventory</h2>`;
    let hasItems = false;
    for (const key in inventory) {
      if (inventory[key] > 0) {
        hasItems = true;
        const div = document.createElement('div');
        div.className = 'inventory-item';
        div.innerHTML = `<img src="${plantTypes[key].img}" alt="${key}" /> <span>${plantTypes[key].name} x${inventory[key]}</span>`;
        menuContent.appendChild(div);
      }
    }
    if (!hasItems) {
      menuContent.innerHTML += '<p>No plants in inventory.</p>';
    }
  } else if (type === 'tasks') {
    menuContent.innerHTML = `
      <h2>Tasks</h2>
      <ul>
        <li>Water your plants regularly.</li>
        <li>Fertilize for faster growth.</li>
        <li>Harvest big plants for more cash.</li>
        <li>Expand your garden soon!</li>
      </ul>
    `;
  } else if (type === 'achievements') {
    menuContent.innerHTML = `<h2>Achievements</h2><p>Coming soon!</p>`;
  } else if (type === 'sell') {
    menuContent.innerHTML = `<h2>Sell Plants</h2><p>Click plants in the garden to harvest and sell them for profit.</p>`;
  }

}

function closeMenu() {
  menu.classList.remove('open');
}

// Button event listeners
shopBtn.onclick = () => openMenu('shop');
inventoryBtn.onclick = () => openMenu('inventory');
tasksBtn.onclick = () => openMenu('tasks');
achievementsBtn.onclick = () => openMenu('achievements');
sellBtn.onclick = () => openMenu('sell');
closeMenuBtn.onclick = closeMenu;

// Periodic growth and weather change
setInterval(() => growPlants(), 3000);
setInterval(() => changeWeather(), 30000);

// Initial setup
renderGarden();
updateCash(0);
changeWeather();

