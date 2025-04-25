document.addEventListener("DOMContentLoaded", function () {
    // Password toggle functionality
    const togglePassword = document.getElementById("togglePassword");
    const password = document.getElementById("password");

    togglePassword.addEventListener("click", function () {
        const type = password.getAttribute("type") === "password" ? "text" : "password";
        password.setAttribute("type", type);
        
        // Toggle button text and icon
        if (type === "password") {
            this.innerHTML = '<i class="bi bi-eye"></i> Show';
        } else {
            this.innerHTML = '<i class="bi bi-eye-slash"></i> Hide';
        }
    });

    document.getElementById("loginForm").addEventListener("submit", function (event) {
        event.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        
        if (username === "admin" && password === "admin123") {
            alert("Login successful!");
            document.getElementById("dataForm").style.display = "block";
            document.getElementById("stateTableContainer").style.display = "block";
            document.getElementById("contactTableContainer").style.display = "block";
            document.getElementById("loginForm").style.display = "none";
            fetchStateData();
            fetchAndDisplayContacts();
        } else {
            alert("Invalid credentials. Please try again.");
        }
    });

    document.getElementById("stateDataForm").addEventListener("submit", async function(event) {
        event.preventDefault();
        const stateId = document.getElementById("updateId").value;
        if (stateId) {
            updateStateData(stateId);
        } else {
            addStateData();
        }
    });
});

// Function to add state data
async function addStateData() {
    const stateData = getStateFormData();
    const response = await fetch("http://localhost:8080/api/covid/add-state", {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("jwtToken"),
            "Content-Type": "application/json",
        },
        body: JSON.stringify(stateData),
    });

    if (response.ok) {
        alert("State data added successfully!");
        resetForm();
        fetchStateData();
    } else {
        alert("Error adding data!");
    }
}

// Function to update state data
async function updateStateData(stateId) {
    if (!stateId) {
        console.error("Error: Missing state ID for update.");
        return;
    }

    const updatedData = getStateFormData();

    const response = await fetch(`http://localhost:8080/api/covid/update-state/${stateId}`, {
        method: "PUT",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("jwtToken"),
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
    });

    if (response.ok) {
        alert("State data updated successfully!");
        resetForm();
        fetchStateData();
    } else {
        alert("Failed to update state data.");
    }
}

// Function to delete state data
async function deleteStateData(stateId) {
    if (!stateId) {
        console.error("Error: Missing state ID for delete.");
        return;
    }
    if (!confirm("Are you sure you want to delete this state data?")) {
        return;
    }
    event?.preventDefault(); 

    const response = await fetch(`http://localhost:8080/api/covid/delete-state/${stateId}`, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("jwtToken"),
            "Content-Type": "application/json",
        },
    });

    if (response.ok) {
        alert("State data deleted successfully!");
        resetForm();
        fetchStateData();
    } else {
        alert("Failed to delete state data.");
    }
}

// Function to get form data
function getStateFormData() {
    return {
        stateName: document.getElementById("state").value,
        confirmedCases: parseInt(document.getElementById("confirmedCases").value),
        recovered: parseInt(document.getElementById("recovered").value),
        deaths: parseInt(document.getElementById("deaths").value),
    };
}

// Function to reset form
function resetForm() {
    document.getElementById("stateDataForm").reset();
    document.getElementById("updateId").value = "";
    document.getElementById("updateButton").style.display = "none";
    document.getElementById("deleteButton").style.display = "none";
    document.getElementById("addButton").style.display = "block";
}

// Function to fetch state data
async function fetchStateData() {
    const response = await fetch("http://localhost:8080/api/covid/state-data", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("jwtToken"),
            "Content-Type": "application/json",
        },
    });

    if (response.ok) {
        const data = await response.json();
        const tableBody = document.getElementById("stateTableBody");
        tableBody.innerHTML = "";
        data.forEach(state => {
            const row = `<tr>
                <td>${state.stateName}</td>
                <td>${state.confirmedCases}</td>
                <td>${state.recovered}</td>
                <td>${state.deaths}</td>
                <td>
                    <button class='btn btn-warning btn-sm' onclick='populateForm(${JSON.stringify(state)})'>Edit</button>
                    <button class='btn btn-danger btn-sm' onclick='deleteStateData(${state.id})'>Delete</button>
                </td>
            </tr>`;
            tableBody.innerHTML += row;
        });
    } else {
        console.error("Error fetching data.");
    }
}

// Function to fetch and display contacts
async function fetchAndDisplayContacts() {
    const response = await fetch("http://localhost:8080/api/contacts", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("jwtToken"),
            "Content-Type": "application/json",
        },
    });

    if (response.ok) {
        const data = await response.json();
        const tableBody = document.getElementById("contactTableBody");
        tableBody.innerHTML = "";
        data.forEach(contact => {
            const row = `<tr>
                <td>${contact.name}</td>
                <td>${contact.email}</td>
                <td>${contact.message}</td>
            </tr>`;
            tableBody.innerHTML += row;
        });
    } else {
        console.error("Error fetching contacts.");
    }
}

// Function to populate form for editing
function populateForm(state) {
    document.getElementById("updateId").value = state.id;
    document.getElementById("state").value = state.stateName;
    document.getElementById("confirmedCases").value = state.confirmedCases;
    document.getElementById("recovered").value = state.recovered;
    document.getElementById("deaths").value = state.deaths;
    
    document.getElementById("updateButton").style.display = "block";
    document.getElementById("deleteButton").style.display = "block";
    document.getElementById("addButton").style.display = "none";

    document.getElementById("dataForm").scrollIntoView({ behavior: "smooth" });
}
