// DOM Elements
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

let cash = 50;
let plantId = 0;
const plants = [];

function updateCash(amount) {
    cash += amount;
    cashDisplay.textContent = cash;
}

// Smooth UI opening
function openUI(uiWindow) {
    document.querySelectorAll(".ui-window").forEach(w => w.classList.remove("active"));
    uiWindow.classList.add("active");
}

// Close UI
closeButtons.forEach(btn => btn.addEventListener("click", () => {
    btn.parentElement.classList.remove("active");
}));

// Plant data
const plantTypes = [
    { name: "Strawberry", img: "https://i.imgur.com/JvBb4Fz.png", cost: 20, sellMultiplier: 1.5 },
    { name: "Blueberry Bush", img: "https://i.imgur.com/wkfyJ9a.png", cost: 30, sellMultiplier: 1.8 },
    { name: "Sunflower", img: "https://i.imgur.com/XwhrLHL.png", cost: 10, sellMultiplier: 1.3 }
];

// Plant growth logic
function growPlants() {
    plants.forEach(plant => {
        plant.growthStage = Math.min(4, plant.growthStage + 1);
        updatePlantSize(plant);
    });
}

function updatePlantSize(plant) {
    plant.element.classList.remove("small", "medium", "large", "super-large");
    if (plant.growthStage === 1) plant.element.classList.add("small");
    else if (plant.growthStage === 2) plant.element.classList.add("medium");
    else if (plant.growthStage === 3) plant.element.classList.add("large");
    else if (plant.growthStage === 4) plant.element.classList.add("super-large");
}

// Planting a plant
function plantSeed(plantType) {
    if (cash < plantType.cost) {
        alert("Not enough cash!");
        return;
    }
    updateCash(-plantType.cost);
    const plantElement = document.createElement("img");
    plantElement.src = plantType.img;
    plantElement.className = "plant small";
    plantElement.style.left = Math.random() * 700 + "px";
    plantElement.style.top = Math.random() * 500 + "px";
    plantingArea.appendChild(plantElement);

    const plant = {
        id: ++plantId,
        type: plantType,
        element: plantElement,
        growthStage: 1
    };
    plants.push(plant);

    plantElement.onclick = () => harvestPlant(plant.id);
}

// Harvest and sell plants
function harvestPlant(id) {
    const plantIndex = plants.findIndex(p => p.id === id);
    if (plantIndex === -1) return;

    const plant = plants[plantIndex];
    const sizeMultiplier = [1, 1.5, 3, 15][plant.growthStage - 1] || 1;
    const sellPrice = Math.round(plant.type.cost * plant.type.sellMultiplier * sizeMultiplier);
    updateCash(sellPrice);

    plantingArea.removeChild(plant.element);
    plants.splice(plantIndex, 1);
    alert(`Sold for $${sellPrice}`);
}

// Display shop items
function renderShop() {
    const shopItems = document.getElementById("shopItems");
    shopItems.innerHTML = "";
    plantTypes.forEach(plant => {
        const item = document.createElement("div");
        item.className = "item";
        item.innerHTML = `
            <div>${plant.name} - $${plant.cost}</div>
            <img src="${plant.img}" alt="${plant.name}">
        `;
        item.onclick = () => plantSeed(plant);
        shopItems.appendChild(item);
    });
}

// Inventory
function renderInventory() {
    const inventoryItems = document.getElementById("inventoryItems");
    inventoryItems.innerHTML = "Your garden is thriving!";
}

// Tasks
function renderTasks() {
    const tasksList = document.getElementById("tasksList");
    tasksList.innerHTML = `
        <div>Grow 10 plants - Reward: $100</div>
        <div>Sell 5 large plants - Reward: $150</div>
    `;
}

// Achievements
function renderAchievements() {
    const achievementsList = document.getElementById("achievementsList");
    achievementsList.innerHTML = `
        <div>First Plant Planted!</div>
        <div>Earned $1000!</div>
    `;
}

// Button event handlers
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
    alert("Selling plants is automatic upon clicking them!");
};

// Game loop
setInterval(growPlants, 10000); // Plants grow every 10 seconds

// Initialize
updateCash(0);
renderShop();
