// ====== Weather App by Rio & Leah ======

const apiKey = '1a43bcfba52fe73218f1ddcb79cb9d82';

function getWeather() {
    const city = document.getElementById('city').value.trim();

    const weatherIcon = document.getElementById('weather-icon');
    const tempDiv = document.getElementById('temp-div');
    const weatherInfo = document.getElementById('weather-info');
    const hourlyForecast = document.getElementById('hourly-forecast');

    // Reset before new data
    tempDiv.innerHTML = '';
    weatherInfo.innerHTML = '';
    hourlyForecast.innerHTML = '';
    weatherIcon.style.display = 'none';

    if (!city) {
        showError('Please enter a city name.');
        return;
    }

    showLoading();

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    Promise.all([
        fetch(currentWeatherUrl).then(res => res.json()),
        fetch(forecastUrl).then(res => res.json())
    ])
        .then(([weatherData, forecastData]) => {
            hideLoading();

            if (weatherData.cod !== 200) {
                showError(weatherData.message);
                return;
            }

            displayWeather(weatherData);
            displayHourlyForecast(forecastData.list);
        })
        .catch(err => {
            hideLoading();
            showError('Something went wrong. Try again later.');
            console.error('Error fetching data:', err);
        });
}

// ====== Display Current Weather ======
function displayWeather(data) {
    const tempDiv = document.getElementById('temp-div');
    const weatherInfo = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');

    const cityName = data.name;
    const temperature = Math.round(data.main.temp - 273.15);
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

    // Dynamic temperature color
    let tempColor = '#fff';
    if (temperature <= 10) tempColor = '#74b9ff';
    else if (temperature <= 20) tempColor = '#55efc4';
    else if (temperature <= 30) tempColor = '#fdcb6e';
    else tempColor = '#ff7675';

    tempDiv.innerHTML = `<p style="color:${tempColor}">${temperature}°C</p>`;
    weatherInfo.innerHTML = `
        <p>${cityName}</p>
        <p>${description}</p>
    `;

    weatherIcon.src = iconUrl;
    weatherIcon.alt = description;
    weatherIcon.style.display = 'block';
    weatherIcon.style.animation = 'fadeIn 0.8s ease';
}

// ====== Display Hourly Forecast ======
function displayHourlyForecast(hourlyData) {
    const hourlyForecast = document.getElementById('hourly-forecast');
    hourlyForecast.innerHTML = '';

    const next24Hours = hourlyData.slice(0, 8);

    next24Hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000);
        const hour = dateTime.getHours().toString().padStart(2, '0');
        const temperature = Math.round(item.main.temp - 273.15);
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const hourlyItem = document.createElement('div');
        hourlyItem.classList.add('hourly-item');
        hourlyItem.innerHTML = `
            <span>${hour}:00</span>
            <img src="${iconUrl}" alt="Hourly Weather Icon">
            <span>${temperature}°C</span>
        `;
        hourlyForecast.appendChild(hourlyItem);
    });
}

// ====== Loading & Error UI ======
function showLoading() {
    const weatherContainer = document.getElementById('weather-container');
    const loader = document.createElement('div');
    loader.id = 'loader';
    loader.innerHTML = `
        <div class="loading-spinner"></div>
        <p>Fetching weather...</p>
    `;
    weatherContainer.appendChild(loader);
}

function hideLoading() {
    const loader = document.getElementById('loader');
    if (loader) loader.remove();
}

function showError(message) {
    const weatherInfo = document.getElementById('weather-info');
    weatherInfo.innerHTML = `<p style="color:#ff7675;font-weight:600;">${message}</p>`;
}

/* ====== Optional: Add Enter Key Trigger ====== */
document.getElementById('city').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') getWeather();
});
