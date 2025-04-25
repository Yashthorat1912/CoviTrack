async function fetchStateData() {
    try {
        const response = await fetch("http://localhost:8080/api/covid/state-data", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwtToken"),
                "Content-Type": "application/json"
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched State Data:", data); // Log the fetched data
        let tableBody = document.getElementById("stateTableBody");
        tableBody.innerHTML = "";
        data.forEach(state => {
            let updateButton = `<button onclick="updateStateData(${state.id})">Update</button>`;
            let deleteButton = `<button onclick="deleteStateData(${state.id})">Delete</button>`;

            let row = `<tr>
                <td>${state.stateName}</td>
                <td>${state.confirmedCases}</td>
                <td>${state.recovered}</td>
                <td>${state.deaths}</td>
                <td>${updateButton} ${deleteButton}</td>
            </tr>`;
            tableBody.innerHTML += row;
        });
        plotStateData(data); // Call to plot state data on the map
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

document.addEventListener("DOMContentLoaded", fetchStateData);


