document.addEventListener("DOMContentLoaded", function () {
  // --- DOM Elements ---
  const eventNameInput = document.getElementById("eventName");
  const playerNameInput = document.getElementById("playerName");
  const addPlayerButton = document.getElementById("addPlayer");
  const eventTableBody = document.querySelector("#eventTable tbody");
  const teamTableBody = document.querySelector("#teamTable tbody");
  const playerStatsTableBody = document.querySelector("#playerStatsTable tbody");
  const exportCSVButton = document.getElementById("exportCSV");
  const eventInputTableBody = document.querySelector("#eventInputTable tbody");
  const clearAllButton = document.getElementById("clearAll");
  const undoButton = document.getElementById("undoButton");
  const scrapePlayersButton = document.getElementById("scrapePlayers");
  const scrapingWizard = document.getElementById("scrapingWizard");
  const nimenhuutoUrl = document.getElementById("nimenhuutoUrl");
  const startScrapingButton = document.getElementById("startScraping");
  const scrapingResult = document.getElementById("scrapingResult");

  // --- Data Storage ---
  let players = [];
  let events = [];

  // --- Helper Functions ---
  function updatePlayerList() {
    // Update a select dropdown if exists (optional)
    const playerSelect = document.getElementById("playerSelect");
    if (playerSelect) {
      playerSelect.innerHTML = "<option value=''>Select Player</option>";
      players.forEach((player) => {
        const option = document.createElement("option");
        option.value = player;
        option.textContent = player;
        playerSelect.appendChild(option);
      });
    }
    updateEventInputTable();
  }

  // Update event input table:
  // - The first cell includes an inner container with a remove button and player name.
  // - Each event cell contains an inner container with a button and a stat count.
  function updateEventInputTable() {
    eventInputTableBody.innerHTML = "";
    players.forEach((player) => {
      const row = eventInputTableBody.insertRow();

      // Name cell
      const nameCell = row.insertCell();
      const nameContainer = document.createElement("div");
      nameContainer.className = "name-container";
      const removeBtn = document.createElement("button");
      removeBtn.textContent = "×";
      removeBtn.classList.add("remove-btn");
      removeBtn.addEventListener("click", () => {
        removePlayer(player);
      });
      nameContainer.appendChild(removeBtn);
      const nameSpan = document.createElement("span");
      nameSpan.textContent = " " + player; // add space after button
      nameContainer.appendChild(nameSpan);
      nameCell.appendChild(nameContainer);

      // Event cells: one for each event type
      const eventTypes = ["pass", "turnover", "assist", "goal", "break", "drop"];
      eventTypes.forEach((eventType) => {
        const cell = row.insertCell();
        const eventContainer = document.createElement("div");
        eventContainer.className = "event-cell-container";
        const btn = document.createElement("button");
        btn.textContent = eventType.charAt(0).toUpperCase() + eventType.slice(1);
        btn.addEventListener("click", () => {
          recordEvent(player, eventType);
        });
        eventContainer.appendChild(btn);
        // Create a span that displays the count of this event for the player
        const statSpan = document.createElement("span");
        const count = events.filter(ev => ev.player === player && ev.eventType === eventType).length;
        statSpan.textContent = ` ${count}`;
        eventContainer.appendChild(statSpan);
        cell.appendChild(eventContainer);
      });
    });
  }

  function recordEvent(player, eventType) {
    if (player) {
      const timestamp = new Date().toLocaleTimeString();
      events.push({ timestamp, player, eventType });
      updateEventTable();
      updatePlayerStatsTable();
      saveData();
      updateEventInputTable(); // Refresh counts
    }
  }

  function updateEventTable() {
    eventTableBody.innerHTML = "";
    events.forEach((event) => {
      const row = eventTableBody.insertRow();
      row.insertCell().textContent = event.timestamp;
      row.insertCell().textContent = event.player;
      row.insertCell().textContent = event.eventType;
    });
  }

  function updateTeamTable(date) {
    teamTableBody.innerHTML = "";
    const row = teamTableBody.insertRow();
    row.insertCell().textContent = eventNameInput.value;
    const now = new Date();
    const timestamp = date + " " + now.toLocaleTimeString();
    row.insertCell().textContent = timestamp;
  }

  function updatePlayerStatsTable() {
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

  function removePlayer(player) {
    // Remove player and associated events.
    players = players.filter(p => p !== player);
    events = events.filter(event => event.player !== player);
    updatePlayerList();
    updateEventTable();
    updatePlayerStatsTable();
    saveData();
  }

  function loadData() {
    const storedData = JSON.parse(localStorage.getItem("ultimateStats")) || {};
    eventNameInput.value = storedData.eventName || "";
    players = storedData.players || [];
    events = storedData.events || [];
    const today = new Date().toISOString().split("T")[0];
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
    const today = new Date().toISOString().split("T")[0];
    updateTeamTable(today);
  }

  function exportToCSV() {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Event Name," + eventNameInput.value + "\n";
    const today = new Date().toISOString().split("T")[0];
    const now = new Date();
    const timestamp = today + " " + now.toLocaleTimeString();
    csvContent += "Date," + timestamp + "\n\n";
    csvContent += "Player,Passes,Turnovers,Assists,Goals,Breaks,Drops\n";
    players.forEach((player) => {
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
      csvContent += player + "," + stats.pass + "," + stats.turnover + "," + stats.assist + "," + stats.goal + "," + stats.break + "," + stats.drop + "\n";
    });
    csvContent += "\nTime,Player,Event\n";
    events.forEach((event) => {
      csvContent += event.timestamp + "," + event.player + "," + event.eventType + "\n";
    });
    return csvContent;
  }

  // --- API call for server-side scraping ---
  async function fetchPlayersFromServer(url) {
    try {
      const response = await fetch(`/api/scrape?url=${encodeURIComponent(url)}`);
      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return { error: error.message };
    }
  }

  // --- Event Listeners ---
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
    const today = new Date().toISOString().split("T")[0];
    updateTeamTable(today);
    updatePlayerStatsTable();
  });

  undoButton.addEventListener("click", function () {
    if (events.length > 0) {
      events.pop();
      updateEventTable();
      updatePlayerStatsTable();
      saveData();
      updateEventInputTable();
    }
  });

  scrapePlayersButton.addEventListener("click", function () {
    scrapingWizard.style.display = "block";
  });

  startScrapingButton.addEventListener("click", async function () {
    const url = nimenhuutoUrl.value.trim();
    if (!url) {
      scrapingResult.textContent = "Please enter a valid URL.";
      return;
    }
    scrapingResult.textContent = "Scraping...";
    const result = await fetchPlayersFromServer(url);
    if (result.players) {
      scrapingResult.textContent = "Players scraped: " + result.players.join(", ");
      result.players.forEach(player => {
        if (!players.includes(player)) {
          players.push(player);
        }
      });
      updatePlayerList();
      saveData();
    } else {
      scrapingResult.textContent = "Scraping failed: " + result.error;
    }
  });

  // --- Initialize ---
  loadData();
  saveData();
});
