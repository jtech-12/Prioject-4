const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'database.json');

function readDatabase() {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function writeDatabase(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

module.exports = {
  getAll: () => readDatabase(),
  add: (entry) => {
    const data = readDatabase();
    data.push(entry);
    writeDatabase(data);
  },
  deleteByTicketNumber: (ticketNumber) => {
    const data = readDatabase();
    const updatedData = data.filter((entry) => entry.ticketNumber !== ticketNumber);
    writeDatabase(updatedData);
    return updatedData;
  },
  filterByName: (name) => {
    const data = readDatabase();
    return data.filter((entry) => entry.name === name);
  },
  filterByEvent: (eventName) => {
    const data = readDatabase();
    return data.filter((entry) => entry.event === eventName);
  }
};
