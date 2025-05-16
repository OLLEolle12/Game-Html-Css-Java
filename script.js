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

    // Pixel art placeholders (48x48 px), replace with your own images or base64 strings
    const pixelArt = {
        tree: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAABT0lEQVRoge3XsQkEQRiG4UcfZJhAZCXpCk7hOxrYEzV6QknA+9lM0JEXpBBLtLfE3E2IyGHD6PM8AgAIQkLzdAh94/3IMaPytws7I+BB9w2AGG0MYcE+hBp0DMcA6yArPAxlS2Ay5xnz60BaMAY8AztgG3YT/MCe4DLGA57BWswq40PIm7xjC3AOJACWCGXBngG6AzqMcAhhzDr2/7MBx1D1rA1IOfu1AFNjG4MJ5ZAGODnH5ylchdwHaNOqADqGgwcIc0fYNeQEwwDWBz5D52grzAzxmQAFAAAKgA9QU4NgL7l9rLcQdu0eOipI6BqXnX0GwghQ1+xCHyk4mYBCgAAAABJRU5ErkJggg==",
        bush: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAABTUlEQVRoge3WsQkEQRDG4d+TAEQIio4m9zZKlpDjoWyzCkYm6Izw3Ijj0E+JLvw/tchxlAIOyD0vAe0/3KMah9H9ysbOz/gvcoO3a4swAJyGP0G4wEEqwihhxn9Bhg2AZtAxhwT6EGnQMxwDrICs8DGVLYDLnGfPrQFoQhjADPwEO2AbdhP8wJ7gMsYDnsFazCrjQ8ibhPGMLcA4kAJYIZcGeAboDOoxwCGHMOvb/swHHUPWsDUg5+7UAW2MbggnlkAY4OcfnKVyF3Ado06oAOoKDBwhzR9g15ATDANYHPkPnqCvMDPGZAAUAAAqAD1BTg2AvuX2stxB27R46KkjgGpedfQbCCFDX7EIfKTiZgEKAQAAAAElFTkSuQmCC",
        flower: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAABTklEQVRoge3WsQkEQRDG4d+TBEQGio7i+zCkYm6EywwI+jAx0U+JLrw/vchxlAIMyD0vAe0/3KMbh9H9ysbOz/gvcoO3a4swAJyGP0G4wEEqwihhxn9Bhg2AZtAxhwT6EGnQMxwDrICs8DGVLYDLnGfPrQFoQhjADPwEO2AbdhP8wJ7gMsYDnsFazCrjQ8ibhPGMLcA4kAJYIZcGeAboDOoxwCGHMOvb/swHHUPWsDUg5+7UAW2MbggnlkAY4OcfnKVyF3Ado06oAOoKDBwhzR9g15ATDANYHPkPnqCvMDPGZAAUAAAqAD1BTg2AvuX2stxB27R46KkjgGpedfQbCCFDX7EIfKTiZgEKAQAAAAElFTkSuQmCC",
        grass: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAABPklEQVRoge3WsQkEQRDG4d+TBEQGio7i+zCkYm6EywwI+jAx0U+JLrw/vchxlAIMyD0vAe0/3KMbh9H9ysbOz/gvcoO3a4swAJyGP0G4wEEqwihhxn9Bhg2AZtAxhwT6EGnQMxwDrICs8DGVLYDLnGfPrQFoQhjADPwEO2AbdhP8wJ7gMsYDnsFazCrjQ8ibhPGMLcA4kAJYIZcGeAboDOoxwCGHMOvb/swHHUPWsDUg5+7UAW2MbggnlkAY4OcfnKVyF3Ado06oAOoKDBwhzR9g15ATDANYHPkPnqCvMDPGZAAUAAAqAD1BTg2AvuX2stxB27R46KkjgGpedfQbCCFDX7EIfKTiZgEKAQAAAAElFTkSuQmCC"
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
