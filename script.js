document.addEventListener('DOMContentLoaded', () => {
  const garden = document.getElementById('garden');
  const menu = document.getElementById('menu');
  const shopBtn = document.getElementById('shopBtn');
  const sellBtn = document.getElementById('sellBtn');
  const cashDisplay = document.getElementById('cashDisplay');

  let cash = 50.00;
  let plantedItems = [];

  const shopItems = [
    { name: 'Blueberry Bush', img: 'https://i.imgur.com/wkfyJ9a.png', price: 25 },
    { name: 'Tree', img: 'https://i.imgur.com/Gv7EYn5.png', price: 50 },
    { name: 'Bush', img: 'https://i.imgur.com/tbXugY5.png', price: 15 },
    { name: 'Sunflower', img: 'https://i.imgur.com/XwhrLHL.png', price: 10 },
    { name: 'Strawberry', img: 'https://i.imgur.com/JvBb4Fz.png', price: 20 }
  ];

  function updateCashDisplay() {
    cashDisplay.textContent = `💰 Cash: $${cash.toFixed(2)}`;
  }

  function showShop() {
    menu.innerHTML = '<h2>Shop</h2>';
    shopItems.forEach(item => {
      const itemDiv = document.createElement('div');
      itemDiv.classList.add('shop-item');
      itemDiv.innerHTML = `
        <img src="${item.img}" alt="${item.name}" width="64" height="64">
        <span>${item.name} - $${item.price}</span>
      `;
      itemDiv.onclick = () => buyPlant(item);
      menu.appendChild(itemDiv);
    });
    menu.classList.add('open');
  }

  function buyPlant(item) {
    if (cash >= item.price) {
      cash -= item.price;
      updateCashDisplay();
      plantItem(item);
    } else {
      alert("Not enough cash!");
    }
  }

  function plantItem(item) {
    const plant = document.createElement('img');
    plant.src = item.img;
    plant.classList.add('garden-item');
    plant.style.left = `${Math.random() * 700}px`;
    plant.style.top = `${Math.random() * 500}px`;
    garden.appendChild(plant);

    let size = 1;
    let growth = 0.05;

    const grow = setInterval(() => {
      size += growth;
      if (size > 2) growth = 0.02;
      if (size > 3) growth = 0;
      plant.style.transform = `scale(${size})`;

      if (size >= 3.5) {
        clearInterval(grow);
      }
    }, 1000);

    plantedItems.push({ element: plant, item, size });
  }

  function sellPlant() {
    if (plantedItems.length > 0) {
      const soldItem = plantedItems.pop();
      const sellPrice = soldItem.item.price * (1.5 + Math.random());
      cash += sellPrice;
      updateCashDisplay();
      soldItem.element.remove();
      alert(`Sold for $${sellPrice.toFixed(2)}`);
    } else {
      alert("No plants to sell!");
    }
  }

  shopBtn.addEventListener('click', showShop);
  sellBtn.addEventListener('click', sellPlant);
  updateCashDisplay();
});
