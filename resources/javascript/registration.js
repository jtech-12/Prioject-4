document.addEventListener('DOMContentLoaded', () => {
  const registrationForm = document.getElementById('registration-form');
  const confirmationDiv = document.getElementById('confirmation');

  // Handle form submission for registration
  if (registrationForm) {
    registrationForm.addEventListener('submit', async (e) => {
      e.preventDefault();  // Prevent the default form submission

      const formData = new FormData(registrationForm);
      const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        eventName: formData.get('event'),
        date: formData.get('date')
      };

      try {
        // Send the data to the server
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        const result = await response.json();

        // Handle success or error
        if (response.ok) {
          confirmationDiv.innerHTML = `<p>Registration Successful! Ticket Number: ${result.ticketNumber}</p>`;
        } else {
          confirmationDiv.innerHTML = `<p>Error: ${result.error || 'Unknown error'}</p>`;
        }
      } catch (error) {
        confirmationDiv.innerHTML = `<p>Error: ${error.message}</p>`;
      }
    });
  }
});
