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
  let cash = 50.00;  // Start with 50 bucks
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
      const div = document.createElement('div');
      div.classList.add('shop-item-container');

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

      const priceTag = document.createElement('div');
      priceTag.className = 'shop-item-price';
      priceTag.textContent = `$${item.price}`;

      div.appendChild(img);
      div.appendChild(priceTag);
      container.appendChild(div);
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
    let y = e.clientY - rect.top - 24;

    if (cash < selectedShopItem.price) {
      alert('Not enough cash!');
      return;
    }

    cash -= selectedShopItem.price;
    updateCashDisplay();

    const item = document.createElement('img');
    item.src = selectedShopItem.img;
    item.className = 'garden-item';
    item.style.left = `${x}px`;
    item.style.top = `${y}px`;
    item.title = selectedShopItem.name + " (growing)";
    item.style.transform = 'scale(0.4)';

    // Plant data
    const plantData = {
      element: item,
      name: selectedShopItem.name,
      growthRate: selectedShopItem.growthRate,
      growth: 0,
      price: selectedShopItem.price,
      selected: false
    };

    // Select plant on click
    item.addEventListener('click', (evt) => {
      evt.stopPropagation();
      if (selectedGardenItem) selectedGardenItem.element.classList.remove('selected');
      selectedGardenItem = plantData;
      plantData.element.classList.add('selected');
    });

    plantedItems.push(plantData);
    garden.appendChild(item);
  });

  // Deselect garden item when clicking outside
  garden.addEventListener('click', () => {
    if (selectedGardenItem) {
      selectedGardenItem.element.classList.remove('selected');
      selectedGardenItem = null;
    }
  });

  // Sell selected plant
  sellBtn.addEventListener('click', () => {
    if (!selectedGardenItem) {
      alert('Select a plant in the garden to sell!');
      return;
    }

    // Calculate sell price: 70% of original * growth progress (max 1)
    const growthMultiplier = Math.min(selectedGardenItem.growth, 1);
    const sellPrice = selectedGardenItem.price * 0.7 * growthMultiplier;

    if (sellPrice < 0.01) {
      alert("Plant hasn't grown enough to sell!");
      return;
    }

    cash += sellPrice;
    updateCashDisplay();

    // Remove from garden and plantedItems array
    selectedGardenItem.element.remove();
    plantedItems = plantedItems.filter(p => p !== selectedGardenItem);
    selectedGardenItem = null;
  });

  // Update growth and scale every 100ms
  setInterval(() => {
    plantedItems.forEach(plant => {
      if (plant.growth < 1) {
        plant.growth += plant.growthRate;
        if (plant.growth > 1) plant.growth = 1;
      }
      // Scale plant from 0.4 to 1.0 based on growth progress
      const scale = 0.4 + 0.6 * plant.growth;
      plant.element.style.transform = `scale(${scale.toFixed(2)})`;
      plant.element.title = `${plant.name} (Growth: ${(plant.growth*100).toFixed(0)}%)`;
    });
  }, 100);

  // Button events
  shopBtn.onclick = () => {
    if (menu.classList.contains('open')) closeMenu();
    else showShop();
  };
  inventoryBtn.onclick = () => {
    if (menu.classList.contains('open')) closeMenu();
    else showInventory();
  };
  tasksBtn.onclick = () => {
    if (menu.classList.contains('open')) closeMenu();
    else showTasks();
  };
  achievementsBtn.onclick = () => {
    if (menu.classList.contains('open')) closeMenu();
    else showAchievements();
  };

  updateCashDisplay();
});
