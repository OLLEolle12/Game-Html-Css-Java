let reputation = 0;
let posts = 0;
let money = 100;

document.getElementById("character").addEventListener("click", interactWithCharacter);
document.getElementById("pc").addEventListener("click", postDoxx);

function interactWithCharacter() {
    logMessage("🕺 Character: Taking a break!");
}

function postDoxx() {
    const success = Math.random() > 0.3; // 70% chance of success

    if (success) {
        const repGain = Math.floor(Math.random() * 20) + 10;
        reputation += repGain;
        posts++;
        logMessage(`✅ Successful Post: Gained ${repGain} reputation!`);
    } else {
        const repLoss = Math.floor(Math.random() * 15) + 5;
        reputation = Math.max(0, reputation - repLoss);
        logMessage(`❌ Failed Post: Lost ${repLoss} reputation!`);
    }

    updateStats();
}

function earnMoney() {
    const earnings = Math.floor(Math.random() * 30) + 20;
    money += earnings;
    logMessage(`💼 Earned $${earnings} through freelance work!`);
    updateStats();
}

function decorateRoom() {
    const colors = ["#333", "#444", "#555", "#666", "#3b3b3b", "#222"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    document.querySelector(".room").style.backgroundColor = randomColor;
    logMessage("🪑 Changed room decoration!");
}

function updateStats() {
    document.getElementById("reputation").textContent = reputation;
    document.getElementById("posts").textContent = posts;
    document.getElementById("money").textContent = money;
}

function logMessage(message) {
    const log = document.getElementById("log");
    const entry = document.createElement("div");
    entry.classList.add("log-entry");
    entry.textContent = message;
    log.prepend(entry);

    // Limit log to 10 messages
    if (log.childElementCount > 10) {
        log.removeChild(log.lastChild);
    }
}
