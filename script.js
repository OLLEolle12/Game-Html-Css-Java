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

window.onload = function () {
  createPet(selectedPet);
  updateUI();
};

function updateUI() {
  hungerBar.value = stats.hunger;
  happinessBar.value = stats.happiness;
  energyBar.value = stats.energy;
}

function createPet(type) {
  petArea.innerHTML = '';
  const img = document.createElement('img');
  img.src = pets[type];
  img.classList.add('pet');
  img.style.left = Math.random() * 80 + '%';
  img.style.top = Math.random() * 50 + '%';
  img.onclick = function (e) {
    e.stopPropagation();
    showPetMenu();
  };
  img.id = 'main-pet';
  petArea.appendChild(img);
}

function feedPet() {
  stats.hunger = Math.max(0, stats.hunger - 20);
  stats.happiness = Math.min(100, stats.happiness + 10);
  animatePet();
  updateUI();
}

function playWithPet() {
  stats.happiness = Math.min(100, stats.happiness + 15);
  stats.energy = Math.max(0, stats.energy - 10);
  animatePet();
  updateUI();
}

function putToSleep() {
  stats.energy = Math.min(100, stats.energy + 30);
  stats.hunger = Math.min(100, stats.hunger + 10);
  animatePet();
  updateUI();
}

function animatePet() {
  const pet = document.getElementById("main-pet");
  pet.classList.add("animate");
  setTimeout(() => pet.classList.remove("animate"), 300);
}

function setPetName() {
  const name = document.getElementById("petName").value.trim();
  if (name) {
    // Show pet name near the pet, create if needed
    let nameLabel = document.getElementById('pet-name');
    if (!nameLabel) {
      nameLabel = document.createElement('div');
      nameLabel.id = 'pet-name';
      nameLabel.style.fontSize = '1.2rem';
      nameLabel.style.color = '#6d4c41';
      nameLabel.style.marginTop = '0.5rem';
      petArea.appendChild(nameLabel);
    }
    nameLabel.textContent = name;
  }
}

function changePet(type) {
  selectedPet = type;
  createPet(type);
  hidePetMenu();
}

function showPetMenu() {
  petMenu.classList.remove("hidden");
}

function hidePetMenu() {
  petMenu.classList.add("hidden");
}

function buyPet(type) {
  if (coins >= 100) {
    coins -= 100;
    const img = document.createElement('img');
    img.src = pets[type];
    img.classList.add('pet');
    img.style.left = Math.random() * 80 + '%';
    img.style.top = Math.random() * 50 + '%';
    img.onclick = function (e) {
      e.stopPropagation();
      showPetMenu();
    };
    petArea.appendChild(img);
  } else {
    alert('Not enough coins!');
  }
}

function buyDecoration(type) {
  if (coins >= 50) {
    coins -= 50;
    const img = document.createElement('img');
    img.src = decorations[type];
    img.classList.add('pet');
    img.style.left = Math.random() * 80 + '%';
    img.style.top = Math.random() * 50 + '%';
    img.onclick = function (e) {
      e.stopPropagation();
      showPetMenu();
    };
    petArea.appendChild(img);
  } else {
    alert('Not enough coins!');
  }
}
