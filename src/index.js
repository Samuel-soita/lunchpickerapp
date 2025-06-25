//  URL for the lunch spots API
const BASE_URL = "http://localhost:3000/lunchSpots";

// will only run if the page has loaded
document.addEventListener("DOMContentLoaded", () => {
  loadLunchSpots();         // Load all spots 
  setupRandomPicker();      // Random button functionality
  setupCuisineFilter();     // Dropdown filter functionality
});

// using fetch display all lunch spots
function loadLunchSpots() {
fetch(BASE_URL)
.then(res => res.json()) //converts response to json
.then(spots => {
displaySpots(spots); //sends data to display spots to display on page
    });
}

// build html for every lunch spot
function displaySpots(spots) {
const list = document.getElementById("spot-list");  //selects container where the "lunchspots" should go,clears any previous content
list.innerHTML = "";

spots.forEach(spot => {   //Loops through all the lunch spots
    const item = document.createElement("div");   //Creates a new <div> for each one
    item.classList.add("spot-item");   //Adds a CSS class so it can be styled
    item.innerHTML = `
    <h3 class="spot-name" style="cursor:pointer">${spot.name}</h3> 
    <p><strong>Cuisine:</strong> ${spot.cuisine}</p>
    `;

    // Click name to view full details
    item.querySelector(".spot-name").addEventListener("click", () => {
    showDetails(spot);  //Adds a click event to the name. When clicked, it will show full details.
    });

    list.appendChild(item);  //Adds each spot’s <div> to the page
});
}

// let me see random spot details
function showRandomSpot(spots) {
const random = spots[Math.floor(Math.random() * spots.length)];
showDetails(random);
}

// Load and display a random lunch spot
function setupRandomPicker() {
const button = document.getElementById("random-btn");

button.addEventListener("click", () => {
    fetch(BASE_URL)
    .then(res => res.json())
    .then(spots => showRandomSpot(spots));
});
}

// Filter spots based on selected cuisine
function setupCuisineFilter() {
const dropdown = document.getElementById("cuisine-filter");

dropdown.addEventListener("change", (e) => {
    const selected = e.target.value;    //Gets the dropdown menu.

    fetch(BASE_URL)
    .then(res => res.json())
    .then(spots => {
        const filtered = selected === "All"
        ? spots
        : spots.filter(spot => spot.cuisine === selected);
        displaySpots(filtered);
    });
});
}

// a spot selected has to be shown fully what it entails
function showDetails(spot) {
const detail = document.getElementById("spot-detail");  //Uses a fallback if location or rating is missing ("Not provided" or "N/A")

detail.innerHTML = `
    <h2>${spot.name}</h2>
    <p><strong>cuisine:</strong> ${spot.cuisine}</p>
    <p><strong>location:</strong> ${spot.location || "Not provided"}</p>
    <p><strong>Rating:</strong> ${spot.rating || "N/A"}</p>
    <button id="fav-btn">Add to Favorites</button>
`;

document.getElementById("fav-btn").addEventListener("click", () => {
    saveToFavorites(spot);
});
}

// you can save the best spot you love to favorites you have to have a favorite
function saveToFavorites(spot) {
const favorites = document.getElementById("favorites");
const item = document.createElement("li");
item.textContent = `${spot.name} (${spot.cuisine})`;
favorites.appendChild(item);
}
