const express = require('express');
const fs = require('fs');
const router = express.Router();

const DATABASE_PATH = './database.json';

// Utility functions
function readDatabase() {
  if (!fs.existsSync(DATABASE_PATH)) return [];
  const data = fs.readFileSync(DATABASE_PATH, 'utf-8');
  return data ? JSON.parse(data) : [];
}

function writeDatabase(data) {
  fs.writeFileSync(DATABASE_PATH, JSON.stringify(data, null, 2));
}

// API Endpoints
router.post('/register', (req, res) => {
  const { name, email, eventName, date } = req.body;

  if (!name || !email || !eventName || !date) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  const database = readDatabase();
  const ticketNumber = `TICKET-${Date.now()}`;
  const newEntry = { ticketNumber, name, email, eventName, date };

  database.push(newEntry);
  writeDatabase(database);
  res.status(201).json(newEntry);
});

router.get('/registrations', (req, res) => {
  const database = readDatabase();
  res.json(database);
});

router.get('/registrations/byname/:name', (req, res) => {
  const database = readDatabase();
  const result = database.filter(reg => reg.name.toLowerCase() === req.params.name.toLowerCase());
  res.json(result);
});

router.get('/registrations/event/:eventName', (req, res) => {
  const database = readDatabase();
  const result = database.filter(reg => reg.eventName.toLowerCase() === req.params.eventName.toLowerCase());
  res.json(result);
});

router.delete('/registrations/cancel/:ticketNumber', (req, res) => {
  const database = readDatabase();
  const updated = database.filter(reg => reg.ticketNumber !== req.params.ticketNumber);

  if (database.length === updated.length) {
    return res.status(404).json({ error: 'Ticket not found!' });
  }

  writeDatabase(updated);
  res.json({ message: 'Ticket canceled successfully.' });
});

module.exports = router;

