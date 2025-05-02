// Function to load external HTML files into the DOM
async function loadHTML(elementId, url, callback = null) {
  try {
    const response = await fetch(url);
    const htmlContent = await response.text();
    document.getElementById(elementId).innerHTML = htmlContent;
    
    // If there's a callback function, invoke it (e.g., to update navbar after loading)
    if (callback) callback();
  } catch (error) {
    console.error("Error loading HTML content:", error);
  }
}

// Function to fetch vaccination data and populate the table and chart
async function fetchVaccinationData() {
  document.getElementById("loadingMessage").style.display = "block";
  try {
    // Fetch the data from the API
    const response = await fetch("https://cdn-api.co-vin.in/api/v1/reports/v2/getPublicReports");
    const json = await response.json();

    // Log the response to inspect it (can remove in production)
    console.log(json);

    // Safely extract data if available
    const data = json.getBeneficiariesGroupBy || [];

    if (data.length === 0) {
      console.log("No data available.");
    }

    // Format the data based on the actual structure (handle undefined fields)
    const formattedData = data.map(item => ({
      state: item.state_name || "Unknown",
      dose1: item.totally_vaccinated || 0,
      dose2: item.partial_vaccinated || 0,
      booster: item.precaution_dose || 0
    }));

    // Populate table and render chart
    populateTable(formattedData);
    renderChart(formattedData);
  } catch (error) {
    console.error("Error fetching vaccination data:", error);
    alert("An error occurred while fetching the data.");
  } finally {
    // Hide loading message
    document.getElementById("loadingMessage").style.display = "none";
  }
}

// Function to populate the vaccination data table
function populateTable(data) {
  const tableBody = document.querySelector("#vaccinationTable tbody");
  tableBody.innerHTML = ""; // Clear existing table rows

  data.forEach(item => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.state}</td>
      <td>${item.dose1}</td>
      <td>${item.dose2}</td>
      <td>${item.booster}</td>
    `;
    tableBody.appendChild(row);
  });
}

// Function to render the vaccination data chart
function renderChart(data) {
  const ctx = document.getElementById("vaccinationChart").getContext("2d");

  // Prepare data for chart
  const states = data.map(item => item.state);
  const dose1Data = data.map(item => item.dose1);
  const dose2Data = data.map(item => item.dose2);
  const boosterData = data.map(item => item.booster);

  // Create a new chart
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: states,
      datasets: [
        {
          label: 'First Dose',
          data: dose1Data,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        },
        {
          label: 'Second Dose',
          data: dose2Data,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        },
        {
          label: 'Booster Dose',
          data: boosterData,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        x: {
          beginAtZero: true
        },
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

// Load navbar and footer HTML
loadHTML("navbar-container", "navbar.html", updateNavbar);
loadHTML("footer-container", "footer.html");

// Function to handle updates after navbar is loaded (if any specific actions are needed)
function updateNavbar() {
  // Example: Add any navbar-related initialization or event listeners here
  console.log("Navbar loaded successfully.");
}

// Fetch vaccination data when the page loads
fetchVaccinationData();
