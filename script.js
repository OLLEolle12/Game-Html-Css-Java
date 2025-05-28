let stats = {
  hunger: 50,
  happiness: 50,
  energy: 50
};

const hungerBar = document.getElementById("hunger");
const happinessBar = document.getElementById("happiness");
const energyBar = document.getElementById("energy");
const petImg = document.getElementById("pet-img");

// Load saved stats if they exist
window.onload = function () {
  const savedStats = localStorage.getItem("petStats");
  if (savedStats) {
    stats = JSON.parse(savedStats);
  }
  updateUI();
};

function updateUI() {
  hungerBar.value = stats.hunger;
  happinessBar.value = stats.happiness;
  energyBar.value = stats.energy;
  localStorage.setItem("petStats", JSON.stringify(stats));
}

function animatePet() {
  petImg.classList.add("animate");
  setTimeout(() => {
    petImg.classList.remove("animate");
  }, 300);
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
