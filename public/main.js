// Define the base URL for the API endpoints
const baseURL = '/api';

// Utility function for sending POST requests
async function postData(url, data) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

// Utility function for sending GET requests
async function getData(url) {
  const response = await fetch(url);
  return response.json();
}

// Utility function for sending DELETE requests
async function deleteData(url) {
  const response = await fetch(url, {
    method: 'DELETE',
  });
  return response.json();
}

// Register for an event
document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault(); // Prevent default form submission

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const eventName = document.getElementById('eventName').value;
  const date = document.getElementById('date').value;

  const response = await postData(`${baseURL}/register`, { name, email, eventName, date });

  if (response.error) {
    alert(`Error: ${response.error}`);
  } else {
    alert(`Registration successful! Ticket Number: ${response.ticketNumber}`);
    document.getElementById('registerForm').reset(); // Reset the form fields
  }
});

// View all registrations
document.getElementById('viewRegistrations').addEventListener('click', async () => {
  const registrations = await getData(`${baseURL}/registrations`);

  const output = document.getElementById('output');
  output.innerHTML = '<h3>All Registrations:</h3>';
  if (registrations.length === 0) {
    output.innerHTML += '<p>No registrations found.</p>';
  } else {
    registrations.forEach((reg) => {
      output.innerHTML += `<p>${reg.name} - ${reg.eventName} (${reg.date}) - Ticket #: ${reg.ticketNumber}</p>`;
    });
  }
});

// Search for registrations by name
document.getElementById('searchByNameForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('searchName').value;

  const registrations = await getData(`${baseURL}/registrations/byname/${name}`);
  const output = document.getElementById('output');
  output.innerHTML = `<h3>Registrations for ${name}:</h3>`;

  if (registrations.length === 0) {
    output.innerHTML += '<p>No registrations found.</p>';
  } else {
    registrations.forEach((reg) => {
      output.innerHTML += `<p>${reg.eventName} (${reg.date}) - Ticket #: ${reg.ticketNumber}</p>`;
    });
  }
});

// Cancel a registration
document.getElementById('cancelForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const ticketNumber = document.getElementById('cancelTicket').value;

  const response = await deleteData(`${baseURL}/registrations/cancel/${ticketNumber}`);
  if (response.error) {
    alert(`Error: ${response.error}`);
  } else {
    alert(`Registration canceled: ${response.message}`);
    document.getElementById('cancelForm').reset(); // Reset the form
  }
});
