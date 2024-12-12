const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000; // Fallback to 3000 if PORT is not set
const DATABASE_PATH = path.join(__dirname, 'database.json');

// Middleware
app.use(bodyParser.json()); // Parse JSON requests

// Utility functions for database handling
function readDatabase() {
  if (!fs.existsSync(DATABASE_PATH)) {
    return [];
  }
  try {
    const data = fs.readFileSync(DATABASE_PATH, 'utf-8');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading database:', error);
    return [];
  }
}

function writeDatabase(data) {
  fs.writeFileSync(DATABASE_PATH, JSON.stringify(data, null, 2));
}

// Routes
app.post('/api/register', (req, res) => {
  const { name, email, eventName, date } = req.body;

  if (!name || !email || !eventName || !date) {
    return res.status(400).json({ error: 'All fields are required: name, email, eventName, and date.' });
  }

  const database = readDatabase();
  const ticketNumber = `TICKET-${Date.now()}`;
  const newRegistration = { ticketNumber, name, email, eventName, date };

  database.push(newRegistration);
  writeDatabase(database);

  res.json(newRegistration);
});

app.get('/api/registrations', (req, res) => {
  const database = readDatabase();
  res.json(database);
});

app.get('/api/registrations/byname/:name', (req, res) => {
  const name = req.params.name;
  const database = readDatabase();
  const userRegistrations = database.filter(reg => reg.name === name);

  if (userRegistrations.length === 0) {
    return res.status(404).json({ error: `No registrations found for user ${name}.` });
  }

  res.json(userRegistrations);
});

app.get('/api/registrations/event/:eventName', (req, res) => {
  const eventName = req.params.eventName;
  const database = readDatabase();
  const eventRegistrations = database.filter(reg => reg.eventName === eventName);

  if (eventRegistrations.length === 0) {
    return res.status(404).json({ error: `No registrations found for event ${eventName}.` });
  }

  res.json(eventRegistrations);
});

app.delete('/api/registrations/cancel/:ticketNumber', (req, res) => {
  const ticketNumber = req.params.ticketNumber;
  let database = readDatabase();

  const initialLength = database.length;
  database = database.filter(reg => reg.ticketNumber !== ticketNumber);

  if (database.length === initialLength) {
    return res.status(404).json({ error: `Ticket ${ticketNumber} not found.` });
  }

  writeDatabase(database);
  res.json({ message: `Ticket ${ticketNumber} has been canceled.` });
});

// Serve static files
app.use(express.static(path.join(__dirname, 'rec')));

// Default route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'rec/view/register.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

