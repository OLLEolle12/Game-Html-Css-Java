document.addEventListener('DOMContentLoaded', () => {
  const garden = document.getElementById('garden');
  const cashDisplay = document.getElementById('cashDisplay');
  const titleDisplay = document.getElementById('titleDisplay');
  const weatherIcon = document.getElementById('weatherIcon');
  const dayTime = document.getElementById('dayTime');

  let cash = 50;
  let level = 1;
  let weather = 'day';
  let titles = ['Beginner Gardener', 'Skilled Farmer', 'Master Gardener'];

  function updateCash(amount) {
    cash += amount;
    cashDisplay.textContent = `💰 Cash: $${cash.toFixed(2)}`;
  }

  function updateTitle() {
    if (cash > 500) level = 3;
    else if (cash > 200) level = 2;
    titleDisplay.textContent = `🏅 Title: ${titles[level - 1]}`;
  }

  function changeWeather() {
    const weathers = ['day', 'night', 'rain', 'snow'];
    weather = weathers[Math.floor(Math.random() * weathers.length)];
    const weatherIcons = {
      day: "https://i.imgur.com/YBjeiNS.png",
      night: "https://i.imgur.com/1xkedqc.png",
      rain: "https://i.imgur.com/6ezFfyu.png",
      snow: "https://i.imgur.com/ZL41Mpb.png"
    };
    weatherIcon.src = weatherIcons[weather];
    dayTime.textContent = weather.charAt(0).toUpperCase() + weather.slice(1);
  }

  function plant(seed) {
    const plant = document.createElement('img');
    plant.src = seed;
    plant.classList.add('garden-item');
    plant.style.left = `${Math.random() * 700}px`;
    plant.style.top = `${Math.random() * 500}px`;
    garden.appendChild(plant);

    let size = 1;
    setInterval(() => {
      if (weather === 'rain') size += 0.03;
      else size += 0.01;
      plant.style.transform = `scale(${size})`;
    }, 1000);
  }

  setInterval(changeWeather, 15000);
  updateCash(0);
  updateTitle();
});
