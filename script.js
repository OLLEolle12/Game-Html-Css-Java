document.addEventListener('DOMContentLoaded', () => {
  const garden = document.getElementById('garden');
  const menu = document.getElementById('menu');
  const shopBtn = document.getElementById('shopBtn');
  const sellBtn = document.getElementById('sellBtn');
  const cashDisplay = document.getElementById('cashDisplay');

  let cash = 50.00;
  let selectedItem = null;
  let plantedItems = [];

  const shopItems = [
    { name: 'Blueberry Bush', img: 'https://i.imgur.com/wkfyJ9a.png', price: 25 },
    { name: 'Tree', img: 'https://i.imgur.com/Gv7EYn5.png', price: 50 },
    { name: 'Bush', img: 'https://i.imgur.com/tbXugY5.png', price: 15 },
    { name: 'Sunflower', img: 'https://i.imgur.com/XwhrLHL.png', price: 10 },
    { name: 'Strawberry', img: 'https://i.imgur.com/JvBb4Fz.png', price: 20 }
  ];

  function updateCash() {
    cashDisplay.textContent = `Cash: $${cash.toFixed(2)}`;
  }

  function createShop() {
    menu.innerHTML = '<h2>Shop</h2>';
    shopItems.forEach(item => {
      const btn = document.createElement('div');
      btn.classList.add('shop-item');
      btn.innerHTML = `
        <img src="${item.img}" alt="${item.name}">
        <p>${item.name} - $${item.price}</p>
      `;
      btn.onclick = () => {
        if (cash >= item.price) {
          cash -= item.price;
          updateCash();
          plantItem(item);
        } else {
          alert("Not enough cash!");
        }
      };
      menu.appendChild(btn);
    });
    menu.classList.add('open');
  }

  function plantItem(item) {
    const plant = document.createElement('img');
    plant.src = item.img;
    plant.classList.add('garden-item');
    plant.style.left = `${Math.random() * 700}px`;
    plant.style.top = `${Math.random() * 500}px`;
    garden.appendChild(plant);
    plantedItems.push({ element: plant, price: item.price });
  }

  sellBtn.addEventListener('click', () => {
    if (plantedItems.length > 0) {
      const soldItem = plantedItems.pop();
      cash += soldItem.price * 0.7;
      updateCash();
      soldItem.element.remove();
    } else {
      alert("No plants to sell!");
    }
  });

  shopBtn.addEventListener('click', createShop);
  updateCash();
});
