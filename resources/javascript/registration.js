document.addEventListener("DOMContentLoaded", () => {
  const resultsDiv = document.getElementById("results");

  async function fetchAndDisplay(endpoint) {
    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      resultsDiv.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    } catch (error) {
      resultsDiv.innerHTML = `<p>Error: ${error.message}</p>`;
    }
  }

  document.addEventListener("click", async (e) => {
    if (e.target.id === "view-all") {
      await fetchAndDisplay("/api/registrations");
    } else if (e.target.id === "search-by-name") {
      const name = document.getElementById("search-query").value.trim();
      if (name) {
        await fetchAndDisplay(`/api/registrations/byname/${name}`);
      } else {
        resultsDiv.innerHTML = "<p>Please enter a name to search.</p>";
      }
    } else if (e.target.id === "search-by-event") {
      const event = document.getElementById("search-query").value.trim();
      if (event) {
        await fetchAndDisplay(`/api/registrations/event/${event}`);
      } else {
        resultsDiv.innerHTML = "<p>Please enter an event name to search.</p>";
      }
    } else if (e.target.id === "delete-ticket") {
      const ticketNumber = document.getElementById("search-query").value.trim();
      if (ticketNumber) {
        try {
          const response = await fetch(`/api/registrations/cancel/${ticketNumber}`, { method: "DELETE" });
          const result = await response.json();
          resultsDiv.innerHTML = `<p>${result.message || result.error}</p>`;
        } catch (error) {
          resultsDiv.innerHTML = `<p>Error: ${error.message}</p>`;
        }
      } else {
        resultsDiv.innerHTML = "<p>Please enter a ticket number to delete.</p>";
      }
    }
  });
});
