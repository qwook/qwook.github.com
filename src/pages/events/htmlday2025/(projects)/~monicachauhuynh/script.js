// Function to get user's location
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    document.getElementById("location").textContent =
      "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  // Use a reverse geocoding service to get the full address
  fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
  )
    .then((response) => response.json())
    .then((data) => {
      // Display the full address instead of just city and country
      document.getElementById("location").textContent =
        data.locality + ", " + data.city || "Location not available";
    })
    .catch(() => {
      document.getElementById("location").textContent =
        "Unable to retrieve location data.";
    });
}

function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      document.getElementById("location").textContent =
        "User denied the request for Geolocation.";
      break;
    case error.POSITION_UNAVAILABLE:
      document.getElementById("location").textContent =
        "Location information is unavailable.";
      break;
    case error.TIMEOUT:
      document.getElementById("location").textContent =
        "The request to get user location timed out.";
      break;
    case error.UNKNOWN_ERROR:
      document.getElementById("location").textContent =
        "An unknown error occurred.";
      break;
  }
}

// Get user's location on page load
window.onload = getLocation;

let meditationsSaigon = [
  "this is a home and a foreign place, somewhere to both move towards and return to",
  "monica was here, august 2 2025",
  "don't be afraid to look inward, trust that something in you is always ready to answer",
  "reminder to visit grandma",
  "one day, when I make it, I hope I can call you again",
  "being nothing & being everything",
  "english tutor 300k/h @johndoe123",
  "when we go on walks together, she always puts her arm through mine and leans in shoulder-to-shoulder; she makes me feel like there is never distance between us, physically and emotionally and I love her for that and more",
  "not to start a fight but mayo > ketchup period",
  "today we move in together. they make me feel that the world is more beautiful with them in it, that life is worth living because they are here"
];
let currentIndex = 0;
function displayNextMeditation() {
  if (currentIndex < meditationsSaigon.length) {
    document.getElementById("demo").textContent =
      meditationsSaigon[currentIndex];
    currentIndex++;
  } else {
    document.getElementById("demo").textContent =
      "this wall is for all of us. it's your turn to leave something.";
  }
}

function submitMeditation() {
  const newMeditation = document.getElementById("meditationInput").value;
  if (newMeditation) {
    meditationsSaigon.push(newMeditation);
    document.getElementById("meditationInput").value = ""; // Clear the input field
    alert("your thought has been added to the wall"); // Confirmation message
  } else {
    alert("please enter a thought before submitting.");
  }
}

