// api/scrape.js
const cheerio = require("cheerio");

module.exports = async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "Missing URL parameter." });
  }

  try {
    // Fetch the HTML content from the target URL.
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch URL." });
    }
    const html = await response.text();

    // Load the HTML with Cheerio.
    const $ = cheerio.load(html);

    // Find the div with id "zone_1".
    const zoneDiv = $("#zone_1");
    if (!zoneDiv.length) {
      return res.status(404).json({ error: 'Div with id "zone_1" not found.' });
    }

    // Find all spans with class "popover-bootstrap" within the zone.
    let players = [];
    zoneDiv.find("span.popover-bootstrap").each((i, elem) => {
      const name = $(elem).text().trim();
      if (name) {
        players.push(name);
      }
    });

    // Remove duplicate names.
    players = [...new Set(players)];

    res.status(200).json({ players });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
