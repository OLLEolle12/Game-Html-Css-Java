document.addEventListener('DOMContentLoaded', () => {
  const garden = document.getElementById('garden');
  const menu = document.getElementById('menu');
  const shopBtn = document.getElementById('shopBtn');
  const inventoryBtn = document.getElementById('inventoryBtn');
  const tasksBtn = document.getElementById('tasksBtn');
  const achievementsBtn = document.getElementById('achievementsBtn');

  let selectedItem = null;
  let inventory = [];
  let plantedItems = [];

  // Put your pixel art image URLs here
  const pixelArt = {
    tree: "https://i.imgur.com/VY3x0Zn.png",    // pixel tree
    bush: "https://i.imgur.com/jqlUo5D.png",    // pixel bush
    flower: "https://i.imgur.com/MXvWur3.png",  // pixel flower
    grass: "https://i.imgur.com/9Wf6F7B.png"    // pixel grass
  };

  const shopItems = [
    { name: 'Tree', img: pixelArt.tree },
    { name: 'Bush', img: pixelArt.bush },
    { name: 'Flower', img: pixelArt.flower },
    { name: 'Grass Patch', img: pixelArt.grass }
  ];

  function showShop() {
    menu.innerHTML = '<h2>Shop</h2>';
    shopItems.forEach((item, i) => {
      const img = document.createElement('img');
      img.src = item.img;
      img.alt = item.name;
      img.title = item.name;
      img.classList.add('shop-item');
      img.onclick = () => {
        selectedItem = item;
        document.querySelectorAll('.shop-item').forEach(el => el.classList.remove('selected'));
        img.classList.add('selected');
      };
      menu.appendChild(img);
    });
    menu.classList.add('open');
  }

  function closeMenu() {
    menu.classList.remove('open');
    menu.innerHTML = '';
    selectedItem = null;
    document.querySelectorAll('.shop-item').forEach(el => el.classList.remove('selected'));
  }

  garden.addEventListener('click', (e) => {
    if (!selectedItem) return;

    const rect = garden.getBoundingClientRect();
    let x = e.clientX - rect.left - 24; // center image
    let y = e.clientY - rect.top - 24;

    // Clamp to garden area
    x = Math.max(0, Math.min(x, garden.clientWidth - 48));
    y = Math.max(0, Math.min(y, garden.clientHeight - 48));

    const img = document.createElement('img');
    img.src = selectedItem.img;
    img.alt = selectedItem.name;
    img.title = selectedItem.name;
    img.classList.add('garden-item');
    img.style.left = x + 'px';
    img.style.top = y + 'px';

    // Right click removes the item
    img.addEventListener('contextmenu', (evt) => {
      evt.preventDefault();
      garden.removeChild(img);
    });

    garden.appendChild(img);

    plantedItems.push({
      type: selectedItem.name,
      x, y,
      img: selectedItem.img
    });
  });

  shopBtn.addEventListener('click', () => {
    showShop();
  });

  inventoryBtn.addEventListener('click', () => {
    menu.innerHTML = '<h2>Inventory</h2><p>No items yet.</p>';
    menu.classList.add('open');
  });

  tasksBtn.addEventListener('click', () => {
    menu.innerHTML = '<h2>Tasks</h2><ul><li>Plant a tree</li><li>Decorate with bushes</li></ul>';
    menu.classList.add('open');
  });

  achievementsBtn.addEventListener('click', () => {
    menu.innerHTML = '<h2>Achievements</h2><p>No achievements yet.</p>';
    menu.classList.add('open');
  });

  // Close menu when clicking outside it
  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) &&
        !shopBtn.contains(e.target) &&
        !inventoryBtn.contains(e.target) &&
        !tasksBtn.contains(e.target) &&
        !achievementsBtn.contains(e.target)) {
      closeMenu();
    }
  });
});
