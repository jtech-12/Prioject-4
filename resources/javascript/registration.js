document.addEventListener('DOMContentLoaded', () => {
  const registrationForm = document.getElementById('registration-form');
  const confirmationDiv = document.getElementById('confirmation');
  const resultsDiv = document.getElementById('results');

  if (registrationForm) {
    registrationForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(registrationForm);
      const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        event: formData.get('event'),
        date: formData.get('date')
      };

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      confirmationDiv.innerHTML = `<p>Registration Successful! Ticket Number: ${result.ticketNumber}</p>`;
    });
  }

  document.addEventListener('click', async (e) => {
    if (e.target.id === 'view-all') {
      const response = await fetch('/api/registrations');
      const data = await response.json();
      resultsDiv.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    } else if (e.target.id === 'search-by-name') {
      const name = document.getElementById('search-query').value;
      const response = await fetch(`/api/registrations/byname/${name}`);
      const data = await response.json();
      resultsDiv.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    } else if (e.target.id === 'search-by-event') {
      const event = document.getElementById('search-query').value;
      const response = await fetch(`/api/registrations/event/${event}`);
      const data = await response.json();
      resultsDiv.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    } else if (e.target.id === 'delete-ticket') {
      const ticketNumber = document.getElementById('search-query').value;
      const response = await fetch(`/api/registrations/cancel/${ticketNumber}`, {
        method: 'DELETE'
      });
      const result = await response.json();
      resultsDiv.innerHTML = `<p>${result.message}</p>`;
    }
  });
});
