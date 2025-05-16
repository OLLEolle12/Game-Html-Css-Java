document.addEventListener('DOMContentLoaded', () => {
    const garden = document.getElementById('garden');
    const menu = document.getElementById('menu');
    const shopBtn = document.getElementById('shopBtn');

    let selectedItem = null;

    const shopItems = [
        { name: 'Red Flower', src: 'assets/flowers/red_flower.png' },
        { name: 'Bush', src: 'assets/bushes/bush1.png' },
        { name: 'Fountain', src: 'assets/fountains/fountain1.png' }
    ];

    shopBtn.addEventListener('click', () => {
        menu.innerHTML = '<h2>Shop</h2>';
        shopItems.forEach(item => {
            const img = document.createElement('img');
            img.src = item.src;
            img.alt = item.name;
            img.classList.add('shop-item');
            img.addEventListener('click', () => {
                selectedItem = item;
            });
            menu.appendChild(img);
        });
        menu.classList.add('open');
    });

    garden.addEventListener('click', (e) => {
        if (selectedItem) {
            const img = document.createElement('img');
            img.src = selectedItem.src;
            img.classList.add('garden-item');
            img.style.left = e.clientX + 'px';
            img.style.top = e.clientY + 'px';
            garden.appendChild(img);
        }
    });
});
