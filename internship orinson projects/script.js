document.addEventListener("DOMContentLoaded", () => {
    const cityInput = document.querySelector(".city-input");
    const searchButton = document.querySelector(".search-btn");
    const weatherDataContainer = document.querySelector(".weather-data");

    const API_KEY = "9c31567b7f3b6ba5bfe3e5ac45ea672d";


    const getWeatherDetails = (cityName, lat, lon) => {
        const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

        fetch(WEATHER_API_URL)
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
            .then((data) => {
                displayCurrentWeather(cityName, data.list[0]);
                displayWeatherForecast(data.list);
            })
            .catch((err) => {
                console.error("Error fetching weather details:", err);
                alert("An error occurred while fetching the weather details!");
            });
    };

    
    const getCityCoordinates = () => {
        const cityName = cityInput.value.trim();
        if (!cityName) {
            alert("Please enter a city name!");
            return;
        }

        const GEOCODING_API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`;

        fetch(GEOCODING_API_URL)
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
            .then((data) => {
                const { name, coord: { lat, lon } } = data;
                getWeatherDetails(name, lat, lon);
            })
            .catch((err) => {
                console.error("Error fetching coordinates:", err);
                alert("An error occurred while fetching the coordinates!");
            });
    };

    // Display current weather
    const displayCurrentWeather = (cityName, weatherData) => {
        const date = new Date(weatherData.dt * 1000).toLocaleDateString();
        const temp = weatherData.main.temp;
        const wind = weatherData.wind.speed;
        const humidity = weatherData.main.humidity;
        const description = weatherData.weather[0].description;
        const icon = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;

        const currentWeatherHTML = `
            <div class="current-weather">
                <div class="details">
                    <h3>${cityName} (${date})</h3>
                    <h4>Temperature: ${temp}°C</h4>
                    <h4>Wind: ${wind} M/S</h4>
                    <h4>Humidity: ${humidity}%</h4>
                </div>
                <div class="icon">
                    <img src="${icon}" alt="${description}">
                    <h4>${description}</h4>
                </div>
            </div>
        `;
        weatherDataContainer.innerHTML = currentWeatherHTML;
    };

    // Display 5-day weather forecast
    const displayWeatherForecast = (forecastList) => {
        const forecastHTML = `
            <div class="days-forecast">
                <h2>5-Day Forecast</h2>
                <ul class="weather-cards">
                    ${forecastList
                        .filter((_, index) => index % 8 === 0)
                        .map((forecast) => {
                            const date = new Date(forecast.dt * 1000).toLocaleDateString();
                            const temp = forecast.main.temp;
                            const description = forecast.weather[0].description;
                            const icon = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`;

                            return `
                                <li class="card">
                                    <h3>${date}</h3>
                                    <img src="${icon}" alt="${description}">
                                    <h4>${description}</h4>
                                    <h4>Temperature: ${temp}°C</h4>
                                </li>
                            `;
                        })
                        .join("")}
                </ul>
            </div>
        `;
        weatherDataContainer.innerHTML += forecastHTML;
    };

    searchButton.addEventListener("click", getCityCoordinates);
});
