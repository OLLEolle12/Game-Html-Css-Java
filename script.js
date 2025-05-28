// Image URLs for pets and decorations
const images = {
  cat: 'https://i.imgur.com/K7WcMYX.png',
  dog: 'https://i.imgur.com/kRsIeN5.png',
  alien: 'https://i.imgur.com/84eq0kQ.png',
  bunny: 'https://i.imgur.com/FHNUj5P.png',
  dragon: 'https://i.imgur.com/e4aasge.png',
  plant: 'https://i.imgur.com/SjONT1r.png',
  bowl: 'https://i.imgur.com/Qc2f6fw.png'
};

let stats = {
  hunger: 50,
  happiness: 50,
  energy: 50
};
let coins = 150;
let selectedPet = 'cat';
let draggedElement = null;
let offsetX = 0;
let offsetY = 0;

const petArea = document.getElementById('pet-area');
const petMenu = document.getElementById('pet-menu');
const coinsCount = document.getElementById('coins-count');
const shopToggle = document.getElementById('shop-toggle');
const shopPanel = document.getElementById('shop-panel');

function updateUI() {
  coinsCount.textContent = coins;
}

function createPet(type, left = null, top = null, id = null) {
  const pet = document.createElement('img');
  pet.src = images[type];
  pet.className = 'pet';
  pet.draggable = false;
  pet.dataset.type = 'pet';
  pet.dataset.petType = type;
  pet.id = id || `pet-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  // Set position, random if not specified
  if (left === null || top === null) {
    left = Math.random() * 70 + 10;
    top = Math.random() * 60 + 10;
  }
  pet.style.left = left + '%';
  pet.style.top = top + '%';
  pet.dataset.left = left;
  pet.dataset.top = top;

  petArea.appendChild(pet);
  setupDragging();

  selectedPet = type;
  selectedId = pet.id;
  showPetMenuAt(pet);
  saveGame();
  updateUI();
}

function createDecoration(type, left = null, top = null, id = null) {
  const dec = document.createElement('img');
  dec.src = images[type];
  dec.className = 'decoration';
  dec.draggable = false;
  dec.dataset.type = 'decoration';
  dec.dataset.decorationType = type;
  dec.id = id || `decoration-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  if (left === null || top === null) {
    left = Math.random() * 70 + 10;
    top = Math.random() * 60 + 10;
  }
  dec.style.left = left + '%';
  dec.style.top = top + '%';
  dec.dataset.left = left;
  dec.dataset.top = top;

  petArea.appendChild(dec);
  setupDragging();
  saveGame();
  updateUI();
}

function feedPet() {
  if (!selectedId) return;
  const el = document.getElementById(selectedId);
  if (!el || el.dataset.type !== 'pet') return;
  stats.hunger = Math.max(0, stats.hunger - 20);
  stats.happiness = Math.min(100, stats.happiness + 10);
  coins += 5;
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
  coins += 10;
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
    let oldName = document.getElementById(`${el.id}-name`);
    if (oldName) oldName.remove();
    let nameLabel = document.createElement('div');
    nameLabel.id = `${el.id}-name`;
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
  selectedId = el.id;
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
  let cost = 50;
  if (type === 'bowl') cost = 30;
  if (coins >= cost) {
    coins -= cost;
    createDecoration(type);
    updateUI();
    saveGame();
  } else {
    alert('Not enough coins!');
  }
}

// Drag and drop logic

let selectedId = null;

function setupDragging() {
  // Only add event listeners once
  if (setupDragging.done) return;
  setupDragging.done = true;

  petArea.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('pet') || e.target.classList.contains('decoration')) {
      draggedElement = e.target;
      selectedId = draggedElement.id;
      offsetX = e.clientX - draggedElement.getBoundingClientRect().left;
      offsetY = e.clientY - draggedElement.getBoundingClientRect().top;
      draggedElement.style.cursor = 'grabbing';
      showPetMenuAt(draggedElement);
      e.stopPropagation();
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

    x = Math.max(0, Math.min(rect.width - draggedElement.offsetWidth, x));
    y = Math.max(0, Math.min(rect.height - draggedElement.offsetHeight, y));

    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;

    draggedElement.style.left = xPercent + '%';
    draggedElement.style.top = yPercent + '%';

    draggedElement.dataset.left = xPercent;
    draggedElement.dataset.top = yPercent;

    // Move name label with pet
    let nameLabel = document.getElementById(`${draggedElement.id}-name`);
    if (nameLabel) {
      nameLabel.style.left = draggedElement.style.left;
      let topNum = parseFloat(draggedElement.style.top);
      nameLabel.style.top = (topNum - 8) + '%';
    }
  });
}

function toggleShop() {
  if (shopPanel.style.left === '0px') {
    shopPanel.style.left = '-300px';
  } else {
    shopPanel.style.left = '0px';
  }
}

shopToggle.addEventListener('click', () => {
  toggleShop();
});

function saveGame() {
  const pets = [];
  const decorations = [];
  document.querySelectorAll('.pet').forEach(p => {
    pets.push({
      id: p.id,
      type: p.dataset.petType,
      left: p.dataset.left,
      top: p.dataset.top
    });
  });
  document.querySelectorAll('.decoration').forEach(d => {
    decorations.push({
      id: d.id,
      type: d.dataset.decorationType,
      left: d.dataset.left,
      top: d.dataset.top
    });
  });
  const data = {
    pets, decorations, stats, coins
  };
  localStorage.setItem('petGameSave', JSON.stringify(data));
}

function loadGame() {
  const data = JSON.parse(localStorage.getItem('petGameSave'));
  if (!data) return;
  stats = data.stats || stats;
  coins = data.coins || coins;
  petArea.innerHTML = '';
  data.pets.forEach(p => createPet(p.type, p.left, p.top, p.id));
  data.decorations.forEach(d => createDecoration(d.type, d.left, d.top, d.id));
  updateUI();
}

window.onload = () => {
  loadGame();
  updateUI();
};
