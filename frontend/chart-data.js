const barCtx = document.getElementById("barChart");
const pieCtx = document.getElementById("pieChart");
let barChart, pieChart;
let covidData = [];

const dataTypeSelect = document.getElementById("dataType");
const searchInput = document.getElementById("stateSearch");

let currentType = "confirmedCases";
let originalLabels = [];
let originalValues = [];

fetch("http://localhost:8080/api/covid/state-data")
  .then(response => response.json())
  .then(data => {
    covidData = data;
    renderCharts(currentType); // default
  });

dataTypeSelect.addEventListener("change", () => {
  currentType = dataTypeSelect.value;
  renderCharts(currentType);
});

searchInput.addEventListener("input", () => {
  filterChart(searchInput.value.toLowerCase());
});

function renderCharts(type) {
  const stateNames = covidData.map(d => d.stateName);
  const values = covidData.map(d => d[type]);

  // Save original for filtering
  originalLabels = stateNames;
  originalValues = values;

  if (barChart) barChart.destroy();
  if (pieChart) pieChart.destroy();

  // Bar Chart
  barChart = new Chart(barCtx, {
    type: "bar",
    data: {
      labels: stateNames,
      datasets: [{
        label: formatLabel(type),
        data: values,
        backgroundColor: "rgba(75, 192, 192, 0.7)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: false
        }
      },
      scales: {
        x: {
          ticks: {
            autoSkip: false,
            maxRotation: 45,
            minRotation: 45,
            font: {
              size: 10
            }
          }
        },
        y: {
          beginAtZero: true
        }
      }
    }
  });

  // Pie Chart
  pieChart = new Chart(pieCtx, {
    type: "pie",
    data: {
      labels: stateNames,
      datasets: [{
        label: "State Distribution",
        data: values,
        backgroundColor: stateNames.map((_, i) =>
          `hsl(${i * 360 / stateNames.length}, 70%, 70%)`
        )
      }]
    },
    options: {
      responsive: true
    }
  });
}

// Search Filter Function
function filterChart(searchValue) {
  const filteredLabels = [];
  const filteredValues = [];

  originalLabels.forEach((label, index) => {
    if (label.toLowerCase().includes(searchValue)) {
      filteredLabels.push(label);
      filteredValues.push(originalValues[index]);
    }
  });

  // Update Bar Chart
  barChart.data.labels = filteredLabels;
  barChart.data.datasets[0].data = filteredValues;
  barChart.update();

  // Update Pie Chart
  pieChart.data.labels = filteredLabels;
  pieChart.data.datasets[0].data = filteredValues;
  pieChart.update();
}

function formatLabel(type) {
  switch(type) {
    case "confirmedCases": return "Confirmed Cases";
    case "recovered": return "Recovered Cases";
    case "deaths": return "Deaths";
    default: return type;
  }
}
