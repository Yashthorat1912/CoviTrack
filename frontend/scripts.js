let map;
let statewiseData = [];
const token = localStorage.getItem("jwt"); // ✅ Retrieve JWT token

document.addEventListener("DOMContentLoaded", () => {
    initializeMap();  // ✅ Initialize map
    fetchStateData(); // ✅ Fetch COVID-19 data
    document.getElementById("searchInput").addEventListener("input", filterStates);
});

// ✅ Initialize the Leaflet Map
function initializeMap() {
    map = L.map("map").setView([20.5937, 78.9629], 5); // Centered on India

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
}

// ✅ Fetch State Data from Backend
function fetchStateData() {
    fetch("http://localhost:8080/api/covid/state-data", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `Bearer ${token}` : undefined // ✅ Include JWT if available
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        statewiseData = data; // Store globally
        displayData(statewiseData);
        calculateTotalStats(statewiseData);
        plotStateDataOnMap(statewiseData); // ✅ Plot state data on map
    })
    .catch(error => {
        console.error("Error fetching state data:", error);
        document.getElementById("stateDataTable").innerHTML = `
            <tr><td colspan="4" class="text-center text-danger">Failed to load data</td></tr>
        `;
    });
}

// ✅ Plot State Data on the Map
function plotStateDataOnMap(states) {
    states.forEach(state => {
        const { stateName, confirmedCases, recovered, deaths } = state;

        // ⚠️ Replace with actual lat/lon for all states
        const stateCoordinates = {
            "Andhra Pradesh": [15.9129, 79.7400],
            "Arunachal Pradesh": [27.1004, 93.6167],
            "Assam": [26.2006, 92.9376],
            "Bihar": [25.0961, 85.3131],
            "Chhattisgarh": [21.2787, 81.8661],
            "Goa": [15.2993, 74.1240],
            "Gujarat": [22.2587, 71.1924],
            "Haryana": [29.0588, 76.0856],
            "Himachal Pradesh": [31.1048, 77.1734],
            "Jharkhand": [23.6102, 85.2799],
            "Karnataka": [15.3173, 75.7139],
            "Kerala": [10.8505, 76.2711],
            "Madhya Pradesh": [23.2599, 77.4126],
            "Maharashtra": [19.7515, 75.7139],
            "Manipur": [24.6637, 93.9063],
            "Meghalaya": [25.4670, 91.3662],
            "Mizoram": [23.1645, 92.9376],
            "Nagaland": [26.1584, 94.5624],
            "Odisha": [20.9517, 85.0985],
            "Punjab": [31.1471, 75.3412],
            "Rajasthan": [27.0238, 74.2179],
            "Sikkim": [27.5320, 88.5122],
            "Tamil Nadu": [11.1271, 78.6569],
            "Telangana": [18.1124, 79.0193],
            "Tripura": [23.9408, 91.9882],
            "Uttar Pradesh": [26.8467, 80.9462],
            "Uttarakhand": [30.0668, 79.0193],
            "West Bengal": [22.9868, 87.8550]
        };

        if (stateCoordinates[stateName]) {
            L.marker(stateCoordinates[stateName])
                .addTo(map)
                .bindPopup(
                    `<b>${stateName}</b><br>
                    Cases: ${confirmedCases.toLocaleString()}<br>
                    Recovered: ${recovered.toLocaleString()}<br>
                    Deaths: ${deaths.toLocaleString()}`
                );
        }
    });
}

// ✅ Display State Data in Table
function displayData(states) {
    const tableBody = document.getElementById("stateDataTable");
    tableBody.innerHTML = ""; // Clear previous data

    states.forEach(state => {
        const row = `
            <tr>
                <td>${state.stateName}</td>
                <td>${state.confirmedCases.toLocaleString()}</td>
                <td>${state.recovered.toLocaleString()}</td>
                <td>${state.deaths.toLocaleString()}</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

// ✅ Filter States Based on Search Input
function filterStates() {
    const searchTerm = document.getElementById("searchInput").value.toLowerCase();
    const filteredStates = statewiseData.filter(state => 
        state.stateName.toLowerCase().includes(searchTerm)
    );
    displayData(filteredStates);
}

// ✅ Calculate Total Cases, Recovered, and Deaths
function calculateTotalStats(states) {
    let totalCases = 0, totalRecovered = 0, totalDeaths = 0;

    states.forEach(state => {
        totalCases += state.confirmedCases;
        totalRecovered += state.recovered;
        totalDeaths += state.deaths;
    });

    // Update UI
    document.getElementById("totalCases").innerText = totalCases.toLocaleString();
    document.getElementById("totalRecovered").innerText = totalRecovered.toLocaleString();
    document.getElementById("totalDeaths").innerText = totalDeaths.toLocaleString();
}
