const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const DATABASE_PATH = path.join(__dirname, "../database.json");

// Utility functions
function readDatabase() {
  if (!fs.existsSync(DATABASE_PATH)) return [];
  const data = fs.readFileSync(DATABASE_PATH, "utf-8");
  return data ? JSON.parse(data) : [];
}

function writeDatabase(data) {
  fs.writeFileSync(DATABASE_PATH, JSON.stringify(data, null, 2));
}

// Routes
router.post("/register", (req, res) => {
  const { name, email, eventName, date } = req.body;

  if (!name || !email || !eventName || !date) {
    return res.status(400).json({ error: "All fields (name, email, eventName, date) are required." });
  }

  const database = readDatabase();
  const ticketNumber = `TICKET-${Date.now()}`;
  const newRegistration = { ticketNumber, name, email, eventName, date };

  database.push(newRegistration);
  writeDatabase(database);

  res.json(newRegistration);
});

router.get("/registrations", (req, res) => {
  const database = readDatabase();
  res.json(database);
});

router.get("/registrations/byname/:name", (req, res) => {
  const { name } = req.params;
  const database = readDatabase();
  const results = database.filter((entry) => entry.name === name);
  if (results.length === 0) {
    return res.status(404).json({ error: `No registrations found for name: ${name}.` });
  }
  res.json(results);
});

router.get("/registrations/event/:eventName", (req, res) => {
  const { eventName } = req.params;
  const database = readDatabase();
  const results = database.filter((entry) => entry.eventName === eventName);
  if (results.length === 0) {
    return res.status(404).json({ error: `No registrations found for event: ${eventName}.` });
  }
  res.json(results);
});

router.delete("/registrations/cancel/:ticketNumber", (req, res) => {
  const { ticketNumber } = req.params;
  let database = readDatabase();
  const initialLength = database.length;
  database = database.filter((entry) => entry.ticketNumber !== ticketNumber);

  if (database.length === initialLength) {
    return res.status(404).json({ error: `No ticket found with number: ${ticketNumber}.` });
  }

  writeDatabase(database);
  res.json({ message: `Ticket ${ticketNumber} has been canceled.` });
});

module.exports = router;


