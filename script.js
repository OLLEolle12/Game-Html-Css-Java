document.addEventListener('DOMContentLoaded', () => {
  const garden = document.getElementById('garden');
  const menu = document.getElementById('menu');
  const shopBtn = document.getElementById('shopBtn');
  const inventoryBtn = document.getElementById('inventoryBtn');
  const tasksBtn = document.getElementById('tasksBtn');
  const achievementsBtn = document.getElementById('achievementsBtn');
  const sellBtn = document.getElementById('sellBtn');
  const cashDisplay = document.getElementById('cashDisplay');

  let selectedShopItem = null;
  let selectedGardenItem = null;
  let cash = 0;
  let plantedItems = [];

  // Pixel art images (your links)
  const pixelArt = {
    blueberryBush: "https://i.imgur.com/wkfyJ9a.png",
    tree: "https://i.imgur.com/Gv7EYn5.png",
    bush: "https://i.imgur.com/tbXugY5.png",
    sunflower: "https://i.imgur.com/XwhrLHL.png",
    strawberry: "https://i.imgur.com/JvBb4Fz.png",
    shopIcon: "https://i.imgur.com/NzXI6Hm.png",
    inventoryIcon: "https://i.imgur.com/PbUmbg4.png",
    tasksIcon: "https://i.imgur.com/gZG6Agg.png",
    achievementsIcon: "https://i.imgur.com/dVtJQ1Z.png",
    sellIcon: "https://i.imgur.com/0HpwASu.png"
  };

  // Shop items with price and growth speed (lower is faster growth)
  const shopItems = [
    { name: 'Blueberry Bush', img: pixelArt.blueberryBush, price: 50, growthRate: 0.015 },
    { name: 'Tree', img: pixelArt.tree, price: 100, growthRate: 0.005 },
    { name: 'Bush', img: pixelArt.bush, price: 30, growthRate: 0.02 },
    { name: 'Sunflower', img: pixelArt.sunflower, price: 20, growthRate: 0.025 },
    { name: 'Strawberry', img: pixelArt.strawberry, price: 40, growthRate: 0.018 }
  ];

  // Update cash display
  function updateCashDisplay() {
    cashDisplay.textContent = `Cash: $${cash.toFixed(2)}`;
  }

  // Show shop menu
  function showShop() {
    menu.innerHTML = '<h2>Shop</h2><div id="shopItemsContainer"></div>';
    const container = document.getElementById('shopItemsContainer');
    shopItems.forEach((item, i) => {
      const img = document.createElement('img');
      img.src = item.img;
      img.alt = item.name;
      img.title = `${item.name} - $${item.price}`;
      img.classList.add('shop-item');
      img.onclick = () => {
        selectedShopItem = item;
        document.querySelectorAll('.shop-item').forEach(el => el.classList.remove('selected'));
        img.classList.add('selected');
      };
      container.appendChild(img);
    });
    menu.classList.add('open');
  }

  // Show simple inventory message (can expand later)
  function showInventory() {
    menu.innerHTML = '<h2>Inventory</h2><p>No items yet.</p>';
    menu.classList.add('open');
  }

  // Show simple tasks list (can expand)
  function showTasks() {
    menu.innerHTML = '<h2>Tasks</h2><ul><li>Plant some fruits or flowers</li><li>Sell your grown plants</li><li>Earn $500</li></ul>';
    menu.classList.add('open');
  }

  // Show simple achievements list
  function showAchievements() {
    menu.innerHTML = '<h2>Achievements</h2><p>No achievements yet.</p>';
    menu.classList.add('open');
  }

  // Close menu
  function closeMenu() {
    menu.classList.remove('open');
    menu.innerHTML = '';
    selectedShopItem = null;
    document.querySelectorAll('.shop-item').forEach(el => el.classList.remove('selected'));
  }

  // Plant new item in garden
  garden.addEventListener('click', (e) => {
    if (!selectedShopItem) return;

    const rect = garden.getBoundingClientRect();
    let x = e.clientX - rect.left - 24; // center image 48/2=24
    let y = e.clientY - rect.top - 48;  // plant bottom aligns with click

    // Clamp position inside garden
    x = Math.max(12, Math.min(x, garden.clientWidth - 60));
    y = Math.max(12, Math.min(y, garden.clientHeight - 60));

    // Check if enough cash
    if (cash < selectedShopItem.price) {
      alert('Not enough cash!');
      return;
    }
    cash -= selectedShopItem.price;
    updateCashDisplay();

    const img = document.createElement('img');
    img.src = selectedShopItem.img;
    img.alt = selectedShopItem.name;
    img.title = selectedShopItem.name;
    img.classList.add('garden-item');
    img.style.left = x + 'px';
    img.style.top = y + 'px';
    img.style.width = '24px';  // start small (half size)
    img.style.height = '48px';
    img.style.transformOrigin = 'bottom center';

    // Custom data attributes
    const plant = {
      element: img,
      type: selectedShopItem.name,
      plantedAt: Date.now(),
      price: selectedShopItem.price,
      growthRate: selectedShopItem.growthRate,
      size: 0.5, // starts small
      x, y
    };
    plantedItems.push(plant);

    // Select plant on click
    img.addEventListener('click', (evt) => {
      evt.stopPropagation();
      if (selectedGardenItem) {
        selectedGardenItem.element.classList.remove('selected');
      }
      selectedGardenItem = plant;
      plant.element.classList.add('selected');
    });

    garden.appendChild(img);
    closeMenu();
  });

  // Sell selected plant for money based on growth and time
  sellBtn.addEventListener('click', () => {
    if (!selectedGardenItem) {
      alert('Select a plant to sell!');
      return;
    }
    const plant = selectedGardenItem;
    const now = Date.now();
    const elapsedHours = (now - plant.plantedAt) / (1000 * 60 * 60);
    const growthMultiplier = Math.min(2, 0.5 + elapsedHours * 0.2); // max 2x price growth over time
    const sellPrice = plant.price * growthMultiplier;

    cash += sellPrice;
    updateCashDisplay();

    garden.removeChild(plant.element);
    plantedItems = plantedItems.filter(p => p !== plant);
    selectedGardenItem = null;
  });

  // Animate growth every 100ms
  function growPlants() {
    plantedItems.forEach(plant => {
      if (plant.size < 1.5) {
        plant.size += plant.growthRate;
        plant.element.style.width = 24 * plant.size + 'px';
        plant.element.style.height = 48 * plant.size + 'px';
      }
    });
    requestAnimationFrame(growPlants);
  }
  growPlants();

  // Buttons handlers
  shopBtn.addEventListener('click', () => {
    showShop();
  });
  inventoryBtn.addEventListener('click', () => {
    showInventory();
  });
  tasksBtn.addEventListener('click', () => {
    showTasks();
  });
  achievementsBtn.addEventListener('click', () => {
    showAchievements();
  });

  // Close menu clicking outside
  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) &&
        !shopBtn.contains(e.target) &&
        !inventoryBtn.contains(e.target) &&
        !tasksBtn.contains(e.target) &&
        !achievementsBtn.contains(e.target) &&
        !sellBtn.contains(e.target)) {
      closeMenu();
      if(selectedGardenItem) {
        selectedGardenItem.element.classList.remove('selected');
        selectedGardenItem = null;
      }
    }
  });

  updateCashDisplay();
});
