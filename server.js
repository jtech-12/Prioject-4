router.post('/register', (req, res) => {
  const { name, email, eventName, date } = req.body;

  // Validate the input data
  if (!name || !email || !eventName || !date) {
    return res.status(400).json({ error: 'All fields are required: name, email, eventName, and date.' });
  }

  const database = readDatabase();
  const ticketNumber = `TICKET-${Date.now()}`; // Generate a unique ticket number
  const newRegistration = { ticketNumber, name, email, eventName, date };

  // Save the registration to the database
  database.push(newRegistration);
  writeDatabase(database);

  // Send back the registration details including ticket number
  res.json(newRegistration);
});
