const express = require('express');
const fs = require('fs');
const router = express.Router();

const DATABASE_PATH = './data/database.json';

// Utility function to read/write to the database
function readDatabase() {
  const data = fs.readFileSync(DATABASE_PATH, 'utf-8');
  return JSON.parse(data);
}

function writeDatabase(data) {
  fs.writeFileSync(DATABASE_PATH, JSON.stringify(data, null, 2));
}

// Routes
router.post('/register', (req, res) => {
  const { name, email, eventName, date } = req.body;
  const database = readDatabase();

  const ticketNumber = `TICKET-${Date.now()}`;
  const newRegistration = { ticketNumber, name, email, eventName, date };

  database.push(newRegistration);
  writeDatabase(database);

  res.json(newRegistration);
});

router.get('/registrations', (req, res) => {
  const database = readDatabase();
  res.json(database);
});

router.get('/registrations/byname/:name', (req, res) => {
  const name = req.params.name;
  const database = readDatabase();

  const userRegistrations = database.filter(reg => reg.name === name);
  res.json(userRegistrations);
});

router.get('/registrations/event/:eventName', (req, res) => {
  const eventName = req.params.eventName;
  const database = readDatabase();

  const eventRegistrations = database.filter(reg => reg.eventName === eventName);
  res.json(eventRegistrations);
});

router.get('/registrations/cancel/:ticketNumber', (req, res) => {
  const ticketNumber = req.params.ticketNumber;
  let database = readDatabase();

  database = database.filter(reg => reg.ticketNumber !== ticketNumber);
  writeDatabase(database);

  res.json({ message: `Ticket ${ticketNumber} has been canceled.` });
});

module.exports = router;
