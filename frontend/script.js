document.addEventListener("DOMContentLoaded", function () {
    console.log("Script Loaded...");

    // Load Navbar and Footer
    loadHTML("navbar-container", "navbar.html", updateNavbar);
    loadHTML("footer-container", "footer.html");

    function loadHTML(containerId, file, callback = null) {
        let container = document.getElementById(containerId);
        if (container) {
            fetch(file)
                .then(response => response.text())
                .then(data => {
                    container.innerHTML = data;
                    if (callback) callback();
                })
                .catch(error => console.error(`Error loading ${file}:`, error));
        }
    }

    function updateNavbar() {
        const jwtToken = localStorage.getItem("jwt");
        const storedUsername = localStorage.getItem("userName");

        toggleVisibility("user-item", !!jwtToken);
        toggleVisibility("logout-item", !!jwtToken);
        toggleVisibility("login-item", !jwtToken);

        if (jwtToken && storedUsername) {
            let userNameDisplay = document.getElementById("user-name");
            if (userNameDisplay) userNameDisplay.textContent = storedUsername;
        }

        let logoutButton = document.getElementById("logout-link");
        if (logoutButton) logoutButton.addEventListener("click", logoutUser);
    }

    function toggleVisibility(elementId, isVisible) {
        let element = document.getElementById(elementId);
        if (element) element.style.display = isVisible ? "block" : "none";
    }

    

    function initializeVaccinationChart() {
        let vaccinationChartElement = document.getElementById("vaccinationChart");
        if (!vaccinationChartElement) return;

        let ctx = vaccinationChartElement.getContext("2d");

        if (window.vaccinationChartInstance) {
            window.vaccinationChartInstance.destroy();
        }

        fetch("https://api.rootnet.in/covid19-in/stats/latest")
            .then(response => response.json())
            .then(data => {
                const statewiseData = data.data.regional;

                // Extract State Names and Vaccination Data (Using totalConfirmed as a basis)
                const states = statewiseData.map(state => state.loc);
                const confirmedCases = statewiseData.map(state => state.totalConfirmed);

                window.vaccinationChartInstance = new Chart(ctx, {
                    type: "bar",
                    data: {
                        labels: states,
                        datasets: [{
                            label: "Vaccination Progress (Total Cases as Proxy)",
                            data: confirmedCases,
                            backgroundColor: "rgba(75, 192, 192, 0.6)",
                            borderColor: "rgba(75, 192, 192, 1)",
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            })
            .catch(error => console.error("Error fetching vaccination data:", error));
    }

    function submitContactForm(event) {
        event.preventDefault();
        const name = document.getElementById("name")?.value.trim();
        const email = document.getElementById("email")?.value.trim();
        const message = document.getElementById("message")?.value.trim();

        if (!name || !email || !message) return alert("Please fill out all fields.");

        const currentDate = new Date().toISOString();
        fetch("http://localhost:8080/api/contacts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, message, createdAt: currentDate }),
        })
        .then(response => response.ok ? response.json() : Promise.reject(response))
        .then(() => {
            alert("Contact submitted successfully!");
            document.getElementById("contactForm").reset();
        })
        .catch(error => {
            console.error("Contact submission error:", error);
            alert("Error submitting contact.");
        });
    }

    function fetchNews() {
        const apiKey = "2f107edded27e23bdc809b0e62b77fd7"; 
        const apiUrl = `https://gnews.io/api/v4/search?q=covid&lang=en&country=us&token=${apiKey}`;

        let newsContainer = document.getElementById("news-container");
        if (!newsContainer) return;

        newsContainer.innerHTML = "<p class='loading-text text-center'>Fetching latest news...</p>";

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.articles && data.articles.length > 0) {
                    displayNews(data.articles);
                } else {
                    newsContainer.innerHTML = "<p class='text-center'>No news available.</p>";
                }
            })
            .catch(error => {
                console.error("Error fetching news:", error);
                newsContainer.innerHTML = "<p class='text-danger text-center'>Error fetching news.</p>";
            });
    }

    function displayNews(articles) {
        const newsContainer = document.getElementById("news-container");
        newsContainer.innerHTML = "";

        articles.forEach(article => {
            const newsCard = document.createElement("div");
            newsCard.className = "card fade-in";
            newsCard.innerHTML = `
                <img src="${article.image || 'default.jpg'}" class="card-img-top" alt="News">
                <div class="card-body">
                    <h5 class="card-title">${article.title}</h5>
                    <p class="card-text">${article.description || "No description available."}</p>
                    <a href="${article.url}" class="btn btn-primary" target="_blank">Read More</a>
                </div>
            `;
            newsContainer.appendChild(newsCard);
        });
    }

    // Attach event listeners
   
    document.getElementById("contactForm")?.addEventListener("submit", submitContactForm);

    // Initialize
    initializeVaccinationChart();
    fetchNews();
});
function checkSymptoms() {
    let fever = document.getElementById("fever").value;
    let cough = document.getElementById("cough").value;
    let breath = document.getElementById("breath").value;
    let tasteSmell = document.getElementById("tasteSmell").value;
    let travel = document.getElementById("travel").value;

    let severity = 0;

    if (fever === "high") severity += 2;
    if (fever === "mild") severity += 1;
    if (cough === "severe") severity += 2;
    if (breath === "yes") severity += 2;
    if (breath === "sometimes") severity += 1;
    if (tasteSmell === "yes") severity += 2;
    if (travel === "yes") severity += 1;

    let resultText = "";
    let resultBox = document.getElementById("assessmentResult");
    resultBox.classList.remove("bg-success", "bg-warning", "bg-danger");

    if (severity <= 2) {
      resultText = "No major symptoms detected. Stay safe!";
      resultBox.classList.add("bg-success", "text-white");
    } else if (severity <= 4) {
      resultText =
        "Mild symptoms detected. Monitor your health and follow precautions.";
      resultBox.classList.add("bg-warning", "text-dark");
    } else {
      resultText =
        "Severe symptoms detected! Seek medical attention immediately.";
      resultBox.classList.add("bg-danger", "text-white");
    }

    resultBox.innerHTML = `<strong>${resultText}</strong>`;
    resultBox.style.display = "block";

    // Update progress bar
    let progress = (severity / 8) * 100 + "%";
    document.getElementById("progressBar").style.width = progress;
  }

  