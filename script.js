document.addEventListener("DOMContentLoaded", function () {
    const eventNameInput = document.getElementById("eventName");
    const playerNameInput = document.getElementById("playerName");
    const addPlayerButton = document.getElementById("addPlayer");
    const playerSelect = document.getElementById("playerSelect");
    const eventTableBody = document.querySelector("#eventTable tbody");
    const teamTableBody = document.querySelector("#teamTable tbody");
    const playerStatsTableBody = document.querySelector("#playerStatsTable tbody");
    const exportCSVButton = document.getElementById("exportCSV");
    const eventInputTableBody = document.querySelector("#eventInputTable tbody");
    const clearAllButton = document.getElementById("clearAll");
    const undoButton = document.getElementById("undoButton");

    let players = [];
    let events = [];

    function updatePlayerList() {
        if (playerSelect) {
            playerSelect.innerHTML = "<option value=''>Select Player</option>";
        }
        players.forEach((player) => {
            const option = document.createElement("option");
            option.value = player;
            option.textContent = player;
            if (playerSelect) {
                playerSelect.appendChild(option);
            }
        });
        updateEventInputTable();
    }

    function updateEventInputTable() {
        if (eventInputTableBody) {
            eventInputTableBody.innerHTML = "";
            players.forEach((player) => {
                const row = eventInputTableBody.insertRow();
                row.insertCell().textContent = player;
                const eventTypes = ["pass", "turnover", "assist", "goal", "break", "drop"];
                eventTypes.forEach((eventType) => {
                    const button = document.createElement("button");
                    button.textContent = eventType.charAt(0).toUpperCase() + eventType.slice(1);
                    button.addEventListener("click", () => {
                        recordEvent(player, eventType);
                    });
                    row.insertCell().appendChild(button);
                });
            });
        }
    }

    function recordEvent(player, eventType) {
        if (player) {
            const timestamp = new Date().toLocaleTimeString();
            events.push({ timestamp, player, eventType });
            updateEventTable();
            updatePlayerStatsTable();
            saveData();
        }
    }

    function updateEventTable() {
        if (eventTableBody) {
            eventTableBody.innerHTML = "";
            events.forEach((event) => {
                const row = eventTableBody.insertRow();
                row.insertCell().textContent = event.timestamp;
                row.insertCell().textContent = event.player;
                row.insertCell().textContent = event.eventType;
            });
        }
    }

    function updateTeamTable(date) {
        if (teamTableBody) {
            teamTableBody.innerHTML = "";
            const row = teamTableBody.insertRow();
            row.insertCell().textContent = eventNameInput.value;
            const now = new Date();
            const timestamp = date + " " + now.toLocaleTimeString();
            row.insertCell().textContent = timestamp;
        }
    }

    function updatePlayerStatsTable() {
        if (playerStatsTableBody) {
            playerStatsTableBody.innerHTML = "";
            players.forEach((player) => {
                const row = playerStatsTableBody.insertRow();
                row.insertCell().textContent = player;
                const stats = {
                    pass: 0,
                    turnover: 0,
                    assist: 0,
                    goal: 0,
                    break: 0,
                    drop: 0,
                };
                events.forEach((event) => {
                    if (event.player === player) {
                        stats[event.eventType]++;
                    }
                });
                row.insertCell().textContent = stats.pass;
                row.insertCell().textContent = stats.turnover;
                row.insertCell().textContent = stats.assist;
                row.insertCell().textContent = stats.goal;
                row.insertCell().textContent = stats.break;
                row.insertCell().textContent = stats.drop;
            });
        }
    }

function loadData() {
    const storedData = JSON.parse(localStorage.getItem("ultimateStats")) || {};
    if (eventNameInput) {
        eventNameInput.value = storedData.eventName || "";
    }
    players = storedData.players || []; // Load players
    events = storedData.events || [];   // Load events
    const today = new Date().toISOString().split('T')[0];
    updatePlayerList();
    updateEventTable();
    updateTeamTable(today);
    updatePlayerStatsTable();
}

    function saveData() {
        const data = {
            eventName: eventNameInput.value,
            players: players,
            events: events,
        };
        localStorage.setItem("ultimateStats", JSON.stringify(data));
        const today = new Date().toISOString().split('T')[0];
        updateTeamTable(today);
    }

    addPlayerButton.addEventListener("click", function () {
        const playerName = playerNameInput.value.trim();
        if (playerName && !players.includes(playerName)) {
            players.push(playerName);
            playerNameInput.value = "";
            updatePlayerList();
            saveData();
        }
    });

    playerNameInput.addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            addPlayerButton.click();
        }
    });

    function exportToCSV() {
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Event Name," + eventNameInput.value + "\n";
        const today = new Date().toISOString().split('T')[0];
        const now = new Date();
        const timestamp = today + " " + now.toLocaleTimeString();
        csvContent += "Date," + timestamp + "\n\n";
        csvContent += "Player,Passes,Turnovers,Assists,Goals,Breaks,Drops\n";
        players.forEach((player) => {
            const stats = {pass: 0,turnover: 0,assist: 0,goal: 0,break: 0,drop: 0};
            events.forEach((event) => {if (event.player === player) {stats[event.eventType]++;}});
            csvContent += player + "," + stats.pass + "," + stats.turnover + "," + stats.assist + "," + stats.goal + "," + stats.break + "," + stats.drop + "\n";
        });
        csvContent += "\nTime,Player,Event\n";
        events.forEach((event) => {csvContent += event.timestamp + "," + event.player + "," + event.eventType + "\n";});
        return csvContent;
    }

    exportCSVButton.addEventListener("click", function () {
        const csv = exportToCSV();
        const encodedUri = encodeURI(csv);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "ultimate_stats.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    clearAllButton.addEventListener("click", function () {
        eventNameInput.value = "";
        players = [];
        events = [];
        localStorage.removeItem("ultimateStats");
        updatePlayerList();
        updateEventTable();
        const today = new Date().toISOString().split('T')[0];
        updateTeamTable(today);
        updatePlayerStatsTable();
    });

    eventNameInput.addEventListener('input', function(){
        const today = new Date().toISOString().split('T')[0];
        updateTeamTable(today);
    });

    undoButton.addEventListener("click", function () {
        if (events.length > 0) {
            events.pop();
            updateEventTable();
            updatePlayerStatsTable();
            saveData();
        }
    });

    loadData();
    saveData();
});
