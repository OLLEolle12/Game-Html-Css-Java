// Initial stats & coins
let stats = {
  hunger: 50,
  happiness: 50,
  energy: 50
};

let coins = 150;
let selectedPet = 'cat';

let pets = {
  cat: 'https://i.imgur.com/eJwANIJ.png',
  dog: 'https://i.imgur.com/kRsIeN5.png',
  alien: 'https://i.imgur.com/84eq0kQ.png',
  bunny: 'https://i.imgur.com/FHNUj5P.png',
  dragon: 'https://i.imgur.com/3i0XYcC.png'
};

let decorations = {
  plant: 'https://i.imgur.com/Fl1UnQU.png'
};

const petArea = document.getElementById("pet-area");
const hungerBar = document.getElementById("hunger");
const happinessBar = document.getElementById("happiness");
const energyBar = document.getElementById("energy");
const petMenu = document.getElementById("pet-menu");
const coinsCount = document.getElementById("coins-count");

let draggedElement = null;
let offsetX = 0;
let offsetY = 0;

window.onload = function () {
  loadGame();
  updateUI();
  setupDragging();
};

function updateUI() {
  hungerBar.value = stats.hunger;
  happinessBar.value = stats.happiness;
  energyBar.value = stats.energy;
  coinsCount.textContent = coins;
}

function createPet(type, posX = null, posY = null, id = null) {
  const img = document.createElement('img');
  img.src = pets[type];
  img.classList.add('pet');
  img.draggable = false; // We'll handle dragging manually
  img.dataset.type = 'pet';
  img.dataset.petType = type;
  img.id = id || `pet-${Date.now()}`;
  setPosition(img, posX, posY);
  img.onclick = function (e) {
    e.stopPropagation();
    selectedPet = type;
    selectedId = img.id;
    showPetMenuAt(img);
  };
  petArea.appendChild(img);
  return img;
}

function createDecoration(type, posX = null, posY = null, id = null) {
  const img = document.createElement('img');
  img.src = decorations[type];
  img.classList.add('decoration');
  img.draggable = false;
  img.dataset.type = 'decoration';
  img.dataset.decorationType = type;
  img.id = id || `decoration-${Date.now()}`;
  setPosition(img, posX, posY);
  img.onclick = function (e) {
    e.stopPropagation();
    selectedPet = null; // no pet selected here
    selectedId = img.id;
    showPetMenuAt(img);
  };
  petArea.appendChild(img);
  return img;
}

function setPosition(element, x, y) {
  if (x === null) {
    x = Math.random() * 80;
  }
  if (y === null) {
    y = Math.random() * 50;
  }
  element.style.left = x + '%';
  element.style.top = y + '%';
  element.dataset.left = x;
  element.dataset.top = y;
}

function feedPet() {
  if (!selectedId) return;
  const el = document.getElementById(selectedId);
  if (!el || el.dataset.type !== 'pet') return;
  stats.hunger = Math.max(0, stats.hunger - 20);
  stats.happiness = Math.min(100, stats.happiness + 10);
  coins += 5;  // Earn coins for caring
  animatePet(el);
  updateUI();
  saveGame();
}

function playWithPet() {
  if (!selectedId) return;
  const el = document.getElementById(selectedId);
  if (!el || el.dataset.type !== 'pet') return;
  stats.happiness = Math.min(100, stats.happiness + 15);
  stats.energy = Math.max(0, stats.energy - 10);
  coins += 10;  // Earn more coins for playing
  animatePet(el);
  updateUI();
  saveGame();
}

function putToSleep() {
  if (!selectedId) return;
  const el = document.getElementById(selectedId);
  if (!el || el.dataset.type !== 'pet') return;
  stats.energy = Math.min(100, stats.energy + 30);
  stats.hunger = Math.min(100, stats.hunger + 10);
  animatePet(el);
  updateUI();
  saveGame();
}

function animatePet(el) {
  el.classList.add("animate");
  setTimeout(() => el.classList.remove("animate"), 300);
}

function setPetName() {
  const name = document.getElementById("petName").value.trim();
  if (name && selectedId) {
    let el = document.getElementById(selectedId);
    if (!el) return;
    // Remove old name tag if exists
    let oldName = document.getElementById(`${el.id}-name`);
    if (oldName) oldName.remove();
    // Create new name label
    let nameLabel = document.createElement('div');
    nameLabel.id = `${el.id}-name`;
    nameLabel.textContent = name;
    nameLabel.style.position = 'absolute';
    nameLabel.style.left = el.style.left;
    // Place name slightly above the pet image
    let topNum = parseFloat(el.style.top);
    nameLabel.style.top = (topNum - 8) + '%';
    nameLabel.style.color = '#6d4c41';
    nameLabel.style.fontWeight = 'bold';
    nameLabel.style.pointerEvents = 'none'; // So clicks go through
    nameLabel.style.userSelect = 'none';
    petArea.appendChild(nameLabel);
    saveGame();
  }
}

function changePet(type) {
  selectedPet = type;
  createPet(type);
  hidePetMenu();
  saveGame();
}

function showPetMenu() {
  petMenu.classList.remove("hidden");
}

function showPetMenuAt(el) {
  showPetMenu();
  // Optionally position menu near pet:
  // For simplicity, fixed bottom center for now
}

function hidePetMenu() {
  petMenu.classList.add("hidden");
  selectedId = null;
}

function buyPet(type) {
  if (coins >= 100) {
    coins -= 100;
    createPet(type);
    updateUI();
    saveGame();
  } else {
    alert('Not enough coins!');
  }
}

function buyDecoration(type) {
  if (coins >= 50) {
    coins -= 50;
    createDecoration(type);
    updateUI();
    saveGame();
  } else {
    alert('Not enough coins!');
  }
}

// Drag and Drop Logic

let selectedId = null;

function setupDragging() {
  petArea.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('pet') || e.target.classList.contains('decoration')) {
      draggedElement = e.target;
      selectedId = draggedElement.id;
      offsetX = e.clientX - draggedElement.getBoundingClientRect().left;
      offsetY = e.clientY - draggedElement.getBoundingClientRect().top;
      draggedElement.style.cursor = 'grabbing';
      showPetMenuAt(draggedElement);
    }
  });

  window.addEventListener('mouseup', (e) => {
    if (draggedElement) {
      draggedElement.style.cursor = 'grab';
      saveGame();
    }
    draggedElement = null;
  });

  window.addEventListener('mousemove', (e) => {
    if (!draggedElement) return;
    const rect = petArea.getBoundingClientRect();
    let x = e.clientX - rect.left - offsetX;
    let y = e.clientY - rect.top - offsetY;

    // Clamp so pet stays inside petArea
    x = Math.max(0, Math.min(rect.width - draggedElement.offsetWidth, x));
    y = Math.max(0, Math.min(rect.height - draggedElement.offsetHeight, y));

    // Convert px to percentage for responsive positioning
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;

    draggedElement.style.left = xPercent + '%';
    draggedElement.style.top = yPercent + '%';

    draggedElement.dataset.left = xPercent;
    draggedElement.dataset.top = yPercent;
  });
}

// Save and load from localStorage

function saveGame() {
  let gameState = {
    stats,
    coins,
    pets: [],
    decorations: [],
    petNames: {}
  };

  // Save pets
  petArea.querySelectorAll('.pet').forEach(pet => {
    gameState.pets.push({
      id: pet.id,
      type: pet.dataset.petType,
      left: pet.dataset.left,
      top: pet.dataset.top
    });
  });

  // Save decorations
  petArea.querySelectorAll('.decoration').forEach(dec => {
    gameState.decorations.push({
      id: dec.id,
      type: dec.dataset.decorationType,
      left: dec.dataset.left,
      top: dec.dataset.top
    });
  });

  // Save pet names
  petArea.querySelectorAll('div[id$="-name"]').forEach(nameDiv => {
    const petId = nameDiv.id.replace('-name', '');
    gameState.petNames[petId] = nameDiv.textContent;
  });

  localStorage.setItem('virtualPetGame', JSON.stringify(gameState));
}

function loadGame() {
  const saved = localStorage.getItem('virtualPetGame');
  if (!saved) {
    createPet(selectedPet);
    return;
  }

  const gameState = JSON.parse(saved);
  stats = gameState.stats;
  coins = gameState.coins;

  petArea.innerHTML = '';

  // Load pets
  gameState.pets.forEach(p => {
    createPet(p.type, parseFloat(p.left), parseFloat(p.top), p.id);
  });

  // Load decorations
  gameState.decorations.forEach(d => {
    createDecoration(d.type, parseFloat(d.left), parseFloat(d.top), d.id);
  });

  // Load pet names
  Object.entries(gameState.petNames).forEach(([petId, name]) => {
    let el = document.getElementById(petId);
    if (el) {
      let nameLabel = document.createElement('div');
      nameLabel.id = `${petId}-name`;
      nameLabel.textContent = name;
      nameLabel.style.position = 'absolute';
      nameLabel.style.left = el.style.left;
      let topNum = parseFloat(el.style.top);
      nameLabel.style.top = (topNum - 8) + '%';
      nameLabel.style.color = '#6d4c41';
      nameLabel.style.fontWeight = 'bold';
      nameLabel.style.pointerEvents = 'none';
      nameLabel.style.userSelect = 'none';
      petArea.appendChild(nameLabel);
    }
  });
}
