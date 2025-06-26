// Base URL for the local lunch spots API
const BASE_URL = "http://localhost:3000/lunchSpots";

// When the page loads, initialize everything
document.addEventListener("DOMContentLoaded", () => {
  loadLunchSpots();        // Fetch and show all lunch spots
  setupRandomPicker();     // Setup random spot button
  setupCuisineFilter();    // Setup cuisine filter dropdown
});

// Fetch and display all lunch spots from the API
function loadLunchSpots() {
fetch(BASE_URL)
    .then(response => response.json())     // Convert response to JSON
    .then(data => displaySpots(data));     // Send data to display function
}

// Render each lunch spot to the main spot list section
function displaySpots(spots) {
const container = document.getElementById("spot-list");
  container.innerHTML = "";  // Clear previous content

spots.forEach(spot => {
    const spotCard = document.createElement("div");
    spotCard.className = "spot-item";

    // Basic spot info (name & cuisine)
    spotCard.innerHTML = `
    <h3 class="spot-name" style="cursor:pointer">${spot.name}</h3>
    <p><strong>Cuisine:</strong> ${spot.cuisine}</p>
    `;

    // When the name is clicked, show full details
    spotCard.querySelector(".spot-name").addEventListener("click", () => {
    showSpotDetails(spot);
    });

    container.appendChild(spotCard); // Add to DOM
});
}

// Show full details of a selected lunch spot
function showSpotDetails(spot) {
const detailSection = document.getElementById("spot-detail");

  // Populate the details section with spot info and buttons
detailSection.innerHTML = `
    <h2>${spot.name}</h2>
    <p><strong>Cuisine:</strong> ${spot.cuisine}</p>
    <p><strong>Location:</strong> ${spot.location || "Not provided"}</p>
    <p><strong>Rating:</strong> <span id="rating-display">${spot.rating || "N/A"}</span></p>

    <input type="number" id="new-rating" placeholder="New rating (1-5)" min="1" max="5"/>
    <button id="submit-rating">Update Rating</button>

    <button id="add-favorite">Add to Favorites</button>
    <button id="remove-favorite">Remove from Favorites</button>
`;

  // Add event listeners for buttons
document.getElementById("add-favorite").addEventListener("click", () => {
    addFavorite(spot);
});

document.getElementById("remove-favorite").addEventListener("click", () => {
    removeFavorite(spot.id);
});

document.getElementById("submit-rating").addEventListener("click", () => {
    const newRating = document.getElementById("new-rating").value;
    if (newRating) updateRating(spot.id, newRating);
});
}

// Add a lunch spot to the favorites list (avoid duplicates)
function addFavorite(spot) {
const favList = document.getElementById("favorites");

  // Check if already added
const exists = Array.from(favList.children).some(item => item.dataset.id == spot.id);
if (exists) return;

  // Create new list item
const favItem = document.createElement("li");
favItem.textContent = `${spot.name} (${spot.cuisine})`;
favItem.dataset.id = spot.id;

favList.appendChild(favItem);
}

// Remove a spot from favorites by ID
function removeFavorite(id) {
const favList = document.getElementById("favorites");
const items = favList.querySelectorAll("li");

  // Loop and remove matching item
items.forEach(item => {
    if (item.dataset.id == id) {
    item.remove();
    }
});
}

// Send PATCH request to update rating of a spot
function updateRating(id, rating) {
fetch(`${BASE_URL}/${id}`, {
    method: "PATCH", // Or PUT if your server uses full replacement
    headers: {
    "Content-Type": "application/json"
    },
    body: JSON.stringify({ rating: Number(rating) }) // Ensure numeric
})
    .then(res => res.json())
    .then(updated => {
      // Reflect new rating in the UI
    document.getElementById("rating-display").textContent = updated.rating;
    alert("Rating successfully updated.");
    })
    .catch(error => {
    alert("Failed to update rating.");
    console.error(error);
    });
}

// Setup functionality for the "Random" button
function setupRandomPicker() {
const button = document.getElementById("random-btn");

button.addEventListener("click", () => {
    fetch(BASE_URL)
    .then(response => response.json())
    .then(spots => {
        // Pick a random spot
        const randomSpot = spots[Math.floor(Math.random() * spots.length)];
        showSpotDetails(randomSpot);
    });
});
}

// Setup dropdown filter for cuisine types
function setupCuisineFilter() {
const dropdown = document.getElementById("cuisine-filter");

dropdown.addEventListener("change", event => {
    const selectedCuisine = event.target.value;

    fetch(BASE_URL)
    .then(res => res.json())
    .then(spots => {
        // Filter or show all depending on selection
        const filtered = selectedCuisine === "All"
        ? spots
        : spots.filter(spot => spot.cuisine === selectedCuisine);

        displaySpots(filtered);
    });
});
}
