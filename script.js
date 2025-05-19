const cashDisplay = document.getElementById('cashDisplay');
const titleDisplay = document.getElementById('titleDisplay');
const plantingArea = document.getElementById('planting-area');

const uiWindows = document.getElementById('uiWindows');
const shopWindow = document.getElementById('shop');
const inventoryWindow = document.getElementById('inventory');
const tasksWindow = document.getElementById('tasks');
const achievementsWindow = document.getElementById('achievements');
const sellWindow = document.getElementById('sell');

const shopBtn = document.getElementById('shopBtn');
const inventoryBtn = document.getElementById('inventoryBtn');
const tasksBtn = document.getElementById('tasksBtn');
const achievementsBtn = document.getElementById('achievementsBtn');
const sellBtn = document.getElementById('sellBtn');

const closeButtons = document.querySelectorAll('.close-btn');

let cash = 50.00;
let title = 'Beginner Gardener';
let inventory = [];
let plants = [];

function updateCash(amount) {
  cash += amount;
  if (cash < 0) cash = 0;
  cashDisplay.textContent = `💰 Cash: $${cash.toFixed(2)}`;
  updateTitle();
}

function updateTitle() {
  if (cash >= 500) title = "Master Gardener 🏅";
  else if (cash >= 250) title = "Expert Gardener 🌿";
  else if (cash >= 100) title = "Skilled Gardener 🌱";
  else title = "Beginner Gardener";
  titleDisplay.textContent = `🏅 ${title}`;
}

function openUI(windowToOpen) {
  [...uiWindows.children].forEach(win => {
    if (win === windowToOpen) {
      win.style.display = 'block';
      uiWindows.classList.add('active');
    } else {
      win.style.display = 'none';
    }
  });
}

function closeUI() {
  uiWindows.classList.remove('active');
  [...uiWindows.children].forEach(win => win.style.display = 'none');
}

// Plant data
const plantTypes = [
  {id:'blueberry', name:'Blueberry Bush', cost:10, img:'https://i.imgur.com/wkfyJ9a.png', growTime: 60, sellMultiplier: 1.5},
  {id:'tree', name:'Tree', cost:20, img:'https://i.imgur.com/Gv7EYn5.png', growTime: 120, sellMultiplier: 3},
  {id:'bush', name:'Bush', cost:15, img:'https://i.imgur.com/tbXugY5.png', growTime: 90, sellMultiplier: 2},
  {id:'sunflower', name:'Sunflower', cost:8, img:'https://i.imgur.com/XwhrLHL.png', growTime: 45, sellMultiplier: 1.5},
  {id:'strawberry', name:'Strawberry Plant', cost:12, img:'https://i.imgur.com/JvBb4Fz.png', growTime: 80, sellMultiplier: 2},
];

// Render shop items
function renderShop() {
  const shopItems = document.getElementById('shopItems');
  shopItems.innerHTML = '';
  plantTypes.forEach(p => {
    const item = document.createElement('div');
    item.className = 'item';
    item.innerHTML = `
      <img src="${p.img}" alt="${p.name}" />
      <div>${p.name}</div>
      <div style="font-size:9px;color:#cdf5b3;">$${p.cost.toFixed(2)}</div>
    `;
    item.onclick = () => {
      if(cash >= p.cost) {
        updateCash(-p.cost);
        addPlant(p);
        alert(`You bought a ${p.name}!`);
      } else {
        alert("Not enough cash!");
      }
    };
    shopItems.appendChild(item);
  });
}

// Add plant to garden
function addPlant(plantType) {
  const plant = {
    id: plantType.id + '_' + Date.now(),
    type: plantType,
    size: 0.2, // start small
    plantedAt: Date.now(),
    growthStage: 0, // 0 to 4 stages
    x: Math.random() * (plantingArea.clientWidth - 48),
    y: Math.random() * (plantingArea.clientHeight - 48),
    element: null
  };
  plants.push(plant);
  renderPlant(plant);
}

function renderPlant(plant) {
  const div = document.createElement('div');
  div.className = 'plant small';
  div.style.position = 'absolute';
  div.style.left = plant.x + 'px';
  div.style.top = plant.y + 'px';
  div.style.zIndex = 10;
  div.style.cursor = 'pointer';
  div.style.width = '48px';
  div.style.height = '48px';
  div.style.backgroundImage = `url(${plant.type.img})`;
  div.style.backgroundSize = 'contain';
  div.style.backgroundRepeat = 'no-repeat';
  div.title = `${plant.type.name}`;
  div.onclick = () => harvestPlant(plant.id);
  plantingArea.appendChild(div);
  plant.element = div;
}

// Growth update loop (every 5 seconds)
function growPlants() {
  const now = Date.now();
  plants.forEach(plant => {
    const elapsed = (now - plant.plantedAt) / 1000; // seconds
    let stage = Math.min(4, Math.floor(elapsed / (plant.type.growTime / 4)));

    if(stage > plant.growthStage) {
      plant.growthStage = stage;
      updatePlantVisual(plant);
    }
  });
}

function updatePlantVisual(plant) {
  if (!plant.element) return;
  plant.element.classList.remove('small', 'medium', 'large', 'super-large');

  if (plant.growthStage === 0) plant.element.classList.add('small');
  else if (plant.growthStage === 1) plant.element.classList.add('medium');
  else if (plant.growthStage === 2 || plant.growthStage === 3) plant.element.classList.add('large');
  else if (plant.growthStage === 4) plant.element.classList.add('super-large');
}

// Harvest plant (sell)
function harvestPlant(id) {
  const plantIndex = plants.findIndex(p => p.id === id);
  if(plantIndex === -1) return;

  const plant = plants[plantIndex];
  if(plant.growthStage < 4) {
    alert('This plant is not fully grown yet!');
    return;
  }
  // Sell price = cost * multiplier * size factor
  // size factor:
  // 0.5 for medium, 1 for large, 1.5 for super large (match growth stage)
  let sizeFactor = 1;
  switch(plant.growthStage) {
    case 1: sizeFactor = 0.5; break;
    case 2: case 3: sizeFactor = 1; break;
    case 4: sizeFactor = 1.5; break;
    default: sizeFactor = 0.3; break;
  }
  const sellPrice = plant.type.cost * plant.type.sellMultiplier * sizeFactor;

  updateCash(sellPrice);
  alert(`You sold your ${plant.type.name} for $${sellPrice.toFixed(2)}!`);
  plantingArea.removeChild(plant.element);
  plants.splice(plantIndex, 1);
  renderSellList();
}

// Sell UI
function renderSellList() {
  const sellList = document.getElementById('sellList');
  sellList.innerHTML = '';
  if(plants.length === 0) {
    sellList.textContent = 'No plants to sell.';
    return;
  }
  plants.forEach(plant => {
    const item = document.createElement('div');
    item.className = 'item';
    item.style.cursor = 'pointer';
    item.innerHTML = `
      <img src="${plant.type.img}" alt="${plant.type.name}" />
      <div>${plant.type.name}</div>
      <div>Stage: ${plant.growthStage}</div>
    `;
    item.onclick = () => harvestPlant(plant.id);
    sellList.appendChild(item);
  });
}

// Inventory UI placeholder
function renderInventory() {
  const inventoryItems = document.getElementById('inventoryItems');
  inventoryItems.innerHTML = '<div>No items yet.</div>';
}

// Tasks UI placeholder
function renderTasks() {
  const tasksList = document.getElementById('tasksList');
  tasksList.innerHTML = '<div>Tasks coming soon!</div>';
}

// Achievements UI placeholder
function renderAchievements() {
  const achievementsList = document.getElementById('achievementsList');
  achievementsList.innerHTML = '<div>Achievements coming soon!</div>';
}

// Button handlers
shopBtn.onclick = () => {
  renderShop();
  openUI(shopWindow);
};
inventoryBtn.onclick = () => {
  renderInventory();
  openUI(inventoryWindow);
};
tasksBtn.onclick = () => {
  renderTasks();
  openUI(tasksWindow);
};
achievementsBtn.onclick = () => {
  renderAchievements();
  openUI(achievementsWindow);
};
sellBtn.onclick = () => {
  renderSellList();
  openUI(sellWindow);
};

// Close buttons
closeButtons.forEach(btn => btn.onclick = closeUI);

// Game loop
setInterval(growPlants, 5000);

// Initial display
updateCash(0);
renderShop();
