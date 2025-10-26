// ===== Weather Oracle by Rio & Leah =====
const apiKey = "1a43bcfba52fe73218f1ddcb79cb9d82";

document.getElementById("search-btn").addEventListener("click", getWeather);
document.getElementById("city").addEventListener("keypress", e => {
  if (e.key === "Enter") getWeather();
});

async function getWeather() {
  const city = document.getElementById("city").value.trim();
  const weatherIcon = document.getElementById("weather-icon");
  const tempDiv = document.getElementById("temp-div");
  const weatherInfo = document.getElementById("weather-info");
  const hourlyForecast = document.getElementById("hourly-forecast");

  // Reset UI
  [tempDiv, weatherInfo, hourlyForecast].forEach(el => (el.innerHTML = ""));
  weatherIcon.style.display = "none";

  if (!city) return showError("Please enter a city name.");

  showLoading();

  try {
    const [weatherRes, forecastRes] = await Promise.all([
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`),
      fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`)
    ]);

    const weatherData = await weatherRes.json();
    const forecastData = await forecastRes.json();

    hideLoading();

    if (weatherData.cod !== 200) return showError(capitalize(weatherData.message));

    displayWeather(weatherData);
    displayHourlyForecast(forecastData.list);
  } catch (error) {
    hideLoading();
    console.error("Error fetching data:", error);
    showError("Something went wrong. Try again later.");
  }
}

// ===== Display Current Weather =====
function displayWeather(data) {
  const tempDiv = document.getElementById("temp-div");
  const weatherInfo = document.getElementById("weather-info");
  const weatherIcon = document.getElementById("weather-icon");

  const { name, main, weather } = data;
  const temperature = Math.round(main.temp - 273.15);
  const { description, icon } = weather[0];
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@4x.png`;

  const tempColor =
    temperature <= 10 ? "#74b9ff" :
    temperature <= 20 ? "#55efc4" :
    temperature <= 30 ? "#fdcb6e" : "#ff7675";

  tempDiv.innerHTML = `<p style="color:${tempColor}">${temperature}°C</p>`;
  weatherInfo.innerHTML = `
    <p>${name}</p>
    <p>${capitalize(description)}</p>
  `;

  weatherIcon.src = iconUrl;
  weatherIcon.alt = description;
  weatherIcon.style.display = "block";
}

// ===== Display Hourly Forecast =====
function displayHourlyForecast(hourlyData) {
  const hourlyForecast = document.getElementById("hourly-forecast");
  hourlyForecast.innerHTML = "";

  hourlyData.slice(0, 8).forEach(item => {
    const dateTime = new Date(item.dt * 1000);
    const hour = dateTime.getHours().toString().padStart(2, "0");
    const temperature = Math.round(item.main.temp - 273.15);
    const iconUrl = `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`;

    const hourlyItem = document.createElement("div");
    hourlyItem.className = "hourly-item";
    hourlyItem.innerHTML = `
      <span>${hour}:00</span>
      <img src="${iconUrl}" alt="${item.weather[0].description}">
      <span>${temperature}°C</span>
    `;
    hourlyForecast.appendChild(hourlyItem);
  });
}

// ===== Utility Functions =====
function showLoading() {
  const loader = document.createElement("div");
  loader.id = "loader";
  loader.innerHTML = `
    <div class="loading-spinner"></div>
    <p>Fetching weather...</p>
  `;
  document.getElementById("weather-container").appendChild(loader);
}

function hideLoading() {
  const loader = document.getElementById("loader");
  if (loader) loader.remove();
}

function showError(message) {
  document.getElementById("weather-info").innerHTML =
    `<p style="color:#ff7675;font-weight:600;">${message}</p>`;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
