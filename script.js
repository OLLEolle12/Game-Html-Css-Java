// State
let reputation = 0;
let posts = 0;
let money = 100;
let hackerName = '';
let deploySite = 'Doxbin.com';

// Load progress
function loadProgress() {
    const saved = JSON.parse(localStorage.getItem('hackerSim'));
    if (saved) {
        reputation = saved.reputation;
        posts = saved.posts;
        money = saved.money;
        hackerName = saved.hackerName;
        deploySite = saved.deploySite;
        document.getElementById('hackerName').value = hackerName;
        document.getElementById('deploySite').value = deploySite;
    }
    updateStats();
}

function saveProgress() {
    localStorage.setItem('hackerSim', JSON.stringify({
        reputation, posts, money, hackerName, deploySite
    }));
}

// UI updates
function updateStats() {
    document.getElementById("reputation").textContent = reputation;
    document.getElementById("posts").textContent = posts;
    document.getElementById("money").textContent = money;
}

// Logging
function logMessage(msg) {
    const log = document.getElementById("log");
    const entry = document.createElement("div");
    entry.classList.add("log-entry");
    entry.textContent = msg;
    log.prepend(entry);
    if (log.childElementCount > 10) log.removeChild(log.lastChild);
}

// Interactions
document.getElementById("character").addEventListener("click", () => {
    logMessage("🕺 Character: Stretching breaks the focus but feels good.");
});

function postDoxx() {
    const success = Math.random() > 0.3;
    if (success) {
        const gain = Math.floor(Math.random() * 20) + 10;
        reputation += gain;
        posts++;
        logMessage(`✅ Posted fake doxx. Reputation +${gain}.`);
    } else {
        const loss = Math.floor(Math.random() * 15) + 5;
        reputation = Math.max(0, reputation - loss);
        logMessage(`❌ Post got reported. Reputation -${loss}.`);
    }
    saveProgress();
    updateStats();
}

function earnMoney() {
    const earn = Math.floor(Math.random() * 30) + 20;
    money += earn;
    logMessage(`💼 Freelance job done. Earned $${earn}.`);
    saveProgress();
    updateStats();
}

function decorateRoom() {
    const colors = ["#333","#444","#555","#666","#3b3b3b","#222"];
    const col = colors[Math.floor(Math.random() * colors.length)];
    document.querySelector(".room").style.backgroundColor = col;
    logMessage("🪑 Room redecorated.");
    saveProgress();
}

// Deployment
function deploy() {
    hackerName = document.getElementById('hackerName').value.trim() || 'Anon';
    deploySite = document.getElementById('deploySite').value;
    logMessage(`🚀 ${hackerName} deployed to ${deploySite}!`);
    saveProgress();
}

// SHOP
function buyItem(item) {
    const shop = {
        chair: { cost: 50, effect: () => reputation += 20, msg: "🪑 Bought new chair. Reputation +20." },
        poster: { cost: 30, effect: () => decorateRoom(), msg: "🖼️ Bought poster and redecorated!" },
        desk: { cost: 100, effect: () => money += 50, msg: "🖥️ Upgraded desk. Got $50 bonus!" }
    };
    const it = shop[item];
    if (money >= it.cost) {
        money -= it.cost;
        it.effect();
        logMessage(it.msg);
        saveProgress();
        updateStats();
    } else {
        logMessage("❌ Not enough money to buy that.");
    }
}

// Init
loadProgress();
