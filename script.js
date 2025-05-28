// --- Global variables ---
const petArea = document.getElementById('pet-area');
const shopToggle = document.getElementById('shop-toggle');
const shopPanel = document.getElementById('shop-panel');
const shopExit = document.getElementById('shop-exit');
const shopItemsContainer = document.getElementById('shop-items');
const petMenu = document.getElementById('pet-menu');
const feedBtn = document.getElementById('feed-btn');
const playBtn = document.getElementById('play-btn');
const sleepBtn = document.getElementById('sleep-btn');
const renameBtn = document.getElementById('rename-btn');
const petNameInput = document.getElementById('petName');
const coinsCount = document.getElementById('coins-count');
const tutorialModal = document.getElementById('tutorial-modal');
const tutorialCloseBtn = document.getElementById('tutorial-close');
const questPanel = document.getElementById('quest-panel');
const questText = document.getElementById('quest-text');
const questClaimBtn = document.getElementById('quest-claim');
const musicToggle = document.getElementById('music-toggle');
const backgroundMusic = document.getElementById('background-music');

let coins = 100; // Starting coins
let stats = {}; // Stats keyed by pet id
let pets = [];
let decorations = [];

let currentPetId = null; // Which pet is selected for menu actions

// Quests example
const quests = [
  {
    id: 1,
    description: "Feed a pet 3 times",
    target: 3,
    progress: 0,
    reward: 50,
    completed: false
  },
  {
    id: 2,
    description: "Play with a pet 2 times",
    target: 2,
    progress: 0,
    reward: 30,
    completed: false
  }
];

let activeQuest = quests[0];

// --- Images URLs for shop items ---
const petData = {
  cat: { name: "Cat", img: "https://i.imgur.com/eJwANIJ.png", cost: 50 },
  dog: { name: "Dog", img: "https://i.imgur.com/kRsIeN5.png", cost: 70 },
  bunny: { name: "Bunny", img: "https://i.imgur.com/FHNUj5P.png", cost: 40 },
  alien: { name: "Alien", img: "https://i.imgur.com/84eq0kQ.png", cost: 80 },
  dragon: { name: "Dragon", img: "https://i.imgur.com/e4aasge.png", cost: 150 }
};

const decorationData = {
  plant: { name: "Plant", img: "https://i.imgur.com/SjONT1r.png", cost: 25 },
  bowl: { name: "Food Bowl", img: "https://i.imgur.com/Qc2f6fw.png", cost: 20 }
};

// --- Functions ---
function updateCoinsDisplay() {
  coinsCount.textContent = coins;
}

function createPet(type, leftPercent = 20, topPercent = 60, id = null) {
  if (!id) id = `pet-${Date.now()}`;

  const petInfo = petData[type];
  if (!petInfo) return;

  const pet = document.createElement('img');
  pet.src = petInfo.img;
  pet.classList.add('pet');
  pet.style.left = `${leftPercent}%`;
  pet.style.top = `${topPercent}%`;
  pet.dataset.petType = type;
  pet.id = id;
  pet.draggable = false;

  petArea.appendChild(pet);

  // Name label
  let nameLabel = document.createElement('div');
  nameLabel.className = 'pet-name-label';
  nameLabel.id = `${id}-name`;
  nameLabel.textContent = petInfo.name;
  nameLabel.style.left = pet.style.left;
  nameLabel.style.top = (topPercent - 8) + '%';
  petArea.appendChild(nameLabel);

  pets.push(pet);

  // Initialize stats for pet
  stats[id] = {
    hunger: 100,
    happiness: 100,
    energy: 100,
    name: petInfo.name,
  };

  pet.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent petArea click
    currentPetId = id;
    showPetMenu(pet);
  });

  enableDrag(pet, nameLabel);

  updateUI();
}

function createDecoration(type, leftPercent = 40, topPercent = 70, id = null) {
  if (!id) id = `decoration-${Date.now()}`;

  const decInfo = decorationData[type];
  if (!decInfo) return;

  const dec = document.createElement('img');
  dec.src = decInfo.img;
  dec.classList.add('decoration');
  dec.style.left = `${leftPercent}%`;
  dec.style.top = `${topPercent}%`;
  dec.dataset.decorationType = type;
  dec.id = id;
  dec.draggable = false;

  petArea.appendChild(dec);
  decorations.push(dec);

  enableDrag(dec);

  updateUI();
}

function enableDrag(element, nameLabel = null) {
  let isDragging = false;
  let startX, startY, startLeft, startTop;

  element.style.cursor = 'grab';

  element.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;

    startLeft = parseFloat(element.style.left);
    startTop = parseFloat(element.style.top);

    element.style.cursor = 'grabbing';
    e.preventDefault();
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      element.style.cursor = 'grab';
    }
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    let dx = e.clientX - startX;
    let dy = e.clientY - startY;

    const petAreaRect = petArea.getBoundingClientRect();

    let newLeftPx = (startLeft / 100) * petAreaRect.width + dx;
    let newTopPx = (startTop / 100) * petAreaRect.height + dy;

    newLeftPx = Math.max(0, Math.min(newLeftPx, petAreaRect.width - element.width));
    newTopPx = Math.max(0, Math.min(newTopPx, petAreaRect.height - element.height));

    let newLeftPercent = (newLeftPx / petAreaRect.width) * 100;
    let newTopPercent = (newTopPx / petAreaRect.height) * 100;

    element.style.left = `${newLeftPercent}%`;
    element.style.top = `${newTopPercent}%`;

    if (nameLabel) {
      nameLabel.style.left = `${newLeftPercent}%`;
      nameLabel.style.top = `${newTopPercent - 8}%`;
    }
  });
}

function updateUI() {
  updateCoinsDisplay();
  updateQuestUI();
  saveGame();
}

function showPetMenu(pet) {
  if (!pet) {
    petMenu.classList.add('hidden');
    return;
  }
  petMenu.classList.remove('hidden');
  petNameInput.value = stats[pet.id]?.name || pet.dataset.petType;
}

function hidePetMenu() {
  petMenu.classList.add('hidden');
  currentPetId = null;
}

// --- Pet actions ---
feedBtn.addEventListener('click', () => {
  if (!currentPetId) return;
  const petStats = stats[currentPetId];
  petStats.hunger = Math.min(100, petStats.hunger + 20);
  coins += 10; // reward for feeding
  animatePet(currentPetId, 'feed');
  updateQuestProgress('feed');
  updateUI();
});

playBtn.addEventListener('click', () => {
  if (!currentPetId) return;
  const petStats = stats[currentPetId];
  petStats.happiness = Math.min(100, petStats.happiness + 20);
  animatePet(currentPetId, 'play');
  updateQuestProgress('play');
  updateUI();
});

sleepBtn.addEventListener('click', () => {
  if (!currentPetId) return;
  const petStats = stats[currentPetId];
  petStats.energy = Math.min(100, petStats.energy + 30);
  animatePet(currentPetId, 'sleep');
  updateQuestProgress('sleep');
  updateUI();
});

renameBtn.addEventListener('click', () => {
  if (!currentPetId) return;
  const newName = petNameInput.value.trim();
  if (newName.length > 0) {
    stats[currentPetId].name = newName;
    const label = document.getElementById(`${currentPetId}-name`);
    if (label) label.textContent = newName;
    updateUI();
  }
});

// Animate pet by scaling briefly
function animatePet(id, action) {
  const pet = document.getElementById(id);
  if (!pet) return;
  pet.classList.add('animate');

  setTimeout(() => {
    pet.classList.remove('animate');
  }, 500);
}

// --- Quest system ---
function updateQuestUI() {
  if (!activeQuest) {
    questPanel.style.display = 'none';
    return;
  }
  questPanel.style.display = 'block';
  questText.textContent = `${activeQuest.description} (${activeQuest.progress}/${activeQuest.target})`;
  questClaimBtn.disabled = !activeQuest.completed;
}

function updateQuestProgress(action) {
  if (!activeQuest || activeQuest.completed) return;

  if (
    (action === 'feed' && activeQuest.description.toLowerCase().includes('feed')) ||
    (action === 'play' && activeQuest.description.toLowerCase().includes('play')) ||
    (action === 'sleep' && activeQuest.description.toLowerCase().includes('sleep'))
  ) {
    activeQuest.progress++;
    if (activeQuest.progress >= activeQuest.target) {
      activeQuest.completed = true;
      alert(`Quest complete! You earned ${activeQuest.reward} coins!`);
      coins += activeQuest.reward;
      updateUI();
    }
  }
}

questClaimBtn.addEventListener('click', () => {
  if (activeQuest && activeQuest.completed) {
    // Move to next quest or hide quests
    let currentIndex = quests.findIndex(q => q.id === activeQuest.id);
    if (currentIndex + 1 < quests.length) {
      activeQuest = quests[currentIndex + 1];
    } else {
      activeQuest = null;
    }
    updateUI();
  }
});

// --- Shop toggle & populate ---
shopToggle.addEventListener('click', () => {
  shopPanel.classList.toggle('visible');
});

shopExit.addEventListener('click', () => {
  shopPanel.classList.remove('visible');
});

function populateShop() {
  shopItemsContainer.innerHTML = '';

  for (const [key, petInfo] of Object.entries(petData)) {
    const item = document.createElement('div');
    item.classList.add('shop-item');
    item.title = `${petInfo.name} - ${petInfo.cost} coins`;

    const img = document.createElement('img');
    img.src = petInfo.img;
    img.alt = petInfo.name;
    img.classList.add('shop-pet-img');
    item.appendChild(img);

    const label = document.createElement('div');
    label.textContent = petInfo.name;
    label.style.fontWeight = '700';
    label.style.marginTop = '4px';
    item.appendChild(label);

    item.addEventListener('click', () => {
      if (coins >= petInfo.cost) {
        coins -= petInfo.cost;
        createPet(key);
        updateUI();
      } else {
        alert('Not enough coins!');
      }
    });

    shopItemsContainer.appendChild(item);
  }

  for (const [key, decInfo] of Object.entries(decorationData)) {
    const item = document.createElement('div');
    item.classList.add('shop-item');
    item.title = `${decInfo.name} - ${decInfo.cost} coins`;

    const img = document.createElement('img');
    img.src = decInfo.img;
    img.alt = decInfo.name;
    img.classList.add('shop-dec-img');
    item.appendChild(img);

    const label = document.createElement('div');
    label.textContent = decInfo.name;
    label.style.fontWeight = '700';
    label.style.marginTop = '4px';
    item.appendChild(label);

    item.addEventListener('click', () => {
      if (coins >= decInfo.cost) {
        coins -= decInfo.cost;
        createDecoration(key);
        updateUI();
      } else {
        alert('Not enough coins!');
      }
    });

    shopItemsContainer.appendChild(item);
  }
}

// --- Save/load game ---
function saveGame() {
  const saveData = {
    coins,
    stats,
    pets: pets.map(p => ({
      id: p.id,
      type: p.dataset.petType,
      left: p.style.left,
      top: p.style.top,
      name: stats[p.id].name
    })),
    decorations: decorations.map(d => ({
      id: d.id,
      type: d.dataset.decorationType,
      left: d.style.left,
      top: d.style.top
    })),
    quests
  };
  localStorage.setItem('virtualPetSave', JSON.stringify(saveData));
}

function loadGame() {
  const saved = localStorage.getItem('virtualPetSave');
  if (!saved) return;

  const data = JSON.parse(saved);
  coins = data.coins || 100;
  stats = data.stats || {};
  pets = [];
  decorations = [];

  petArea.innerHTML = ''; // Clear existing pets & decorations

  // Always add floor and walls behind everything
  addBackgroundTextures();

  if (data.pets) {
    data.pets.forEach(petInfo => {
      createPet(petInfo.type, parseFloat(petInfo.left), parseFloat(petInfo.top), petInfo.id);
      if (stats[petInfo.id]) stats[petInfo.id].name = petInfo.name || stats[petInfo.id].name;
      // Update name labels
      const label = document.getElementById(`${petInfo.id}-name`);
      if (label) label.textContent = stats[petInfo.id].name;
    });
  }
  if (data.decorations) {
    data.decorations.forEach(decInfo => {
      createDecoration(decInfo.type, parseFloat(decInfo.left), parseFloat(decInfo.top), decInfo.id);
    });
  }

  if (data.quests) {
    for (const quest of data.quests) {
      const q = quests.find(q => q.id === quest.id);
      if (q) {
        q.progress = quest.progress;
        q.completed = quest.completed;
      }
    }
    activeQuest = quests.find(q => !q.completed) || null;
  }

  updateUI();
}

// --- Background textures ---
function addBackgroundTextures() {
  // Floor
  const floor = document.createElement('div');
  floor.id = 'floor';
  floor.style.position = 'absolute';
  floor.style.width = '100%';
  floor.style.height = '30%';
  floor.style.bottom = '0';
  floor.style.left = '0';
  floor.style.backgroundImage = 'url(https://i.imgur.com/6MStK9r.png)'; // example texture
  floor.style.backgroundSize = 'cover';
  floor.style.zIndex = '1';
  petArea.appendChild(floor);

  // Walls
  const wallLeft = document.createElement('div');
  wallLeft.id = 'wall-left';
  wallLeft.style.position = 'absolute';
  wallLeft.style.width = '15%';
  wallLeft.style.height = '70%';
  wallLeft.style.left = '0';
  wallLeft.style.top = '0';
  wallLeft.style.backgroundImage = 'url(https://i.imgur.com/Ab7u2wV.png)'; // example texture
  wallLeft.style.backgroundSize = 'cover';
  wallLeft.style.zIndex = '1';
  petArea.appendChild(wallLeft);

  const wallRight = document.createElement('div');
  wallRight.id = 'wall-right';
  wallRight.style.position = 'absolute';
  wallRight.style.width = '15%';
  wallRight.style.height = '70%';
  wallRight.style.right = '0';
  wallRight.style.top = '0';
  wallRight.style.backgroundImage = 'url(https://i.imgur.com/Ab7u2wV.png)'; // example texture
  wallRight.style.backgroundSize = 'cover';
  wallRight.style.zIndex = '1';
  petArea.appendChild(wallRight);
}

// --- Tutorial modal ---
tutorialCloseBtn.addEventListener('click', () => {
  tutorialModal.style.display = 'none';
  saveTutorialSeen();
});

function saveTutorialSeen() {
  localStorage.setItem('tutorialSeen', 'true');
}

function checkTutorial() {
  const seen = localStorage.getItem('tutorialSeen');
  if (!seen) {
    tutorialModal.style.display = 'flex';
  }
}

// --- Music toggle ---
musicToggle.addEventListener('click', () => {
  if (backgroundMusic.paused) {
    backgroundMusic.play();
    musicToggle.textContent = 'Music: On';
  } else {
    backgroundMusic.pause();
    musicToggle.textContent = 'Music: Off';
  }
});

// --- Initialize ---
window.addEventListener('load', () => {
  addBackgroundTextures();
  populateShop();
  loadGame();
  checkTutorial();

  // Play music by default
  backgroundMusic.loop = true;
  backgroundMusic.volume = 0.3;
  backgroundMusic.play();
  musicToggle.textContent = 'Music: On';

  // Clicking outside pet menu hides it
  petArea.addEventListener('click', () => {
    hidePetMenu();
  });
});
