import React, { useState } from "react";
import axios from "axios";
import { WiDaySunny, WiDayCloudy, WiRain, WiSnow, WiThunderstorm } from "react-icons/wi";
import { FaSearch, FaMapMarkerAlt } from "react-icons/fa";
import { BsSunrise, BsSunset } from "react-icons/bs";
import { WiHumidity, WiStrongWind, WiBarometer } from "react-icons/wi";
import "./App.css";

const WeatherApp = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

  const fetchWeather = async () => {
    if (!city) {
      setError("Please enter a city or ZIP code");
      setWeather(null);
      return;
    }

    let query;

    try {
      // **If input is a ZIP code (numbers only), fetch lat/lon first**
      if (/^\d+$/.test(city)) {
        const geoResponse = await axios.get(
          `http://api.openweathermap.org/geo/1.0/zip?zip=${city},US&appid=${API_KEY}`
        );

        if (!geoResponse.data || !geoResponse.data.lat || !geoResponse.data.lon) {
          setError("Invalid ZIP code. Please try again.");
          setWeather(null);
          return;
        }

        const { lat, lon } = geoResponse.data;
        query = `lat=${lat}&lon=${lon}`;
      } else {
        // **If input is a city, use the city name directly**
        query = `q=${city}`;
      }

      // **Fetch weather data using the correct query (city or lat/lon)**
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?${query}&units=metric&appid=${API_KEY}`
      );

      if (response.data.cod !== 200) {
        setError("Location not found. Try again.");
        setWeather(null);
        return;
      }

      setWeather(response.data);
      setError("");
    } catch (error) {
      console.error("Error fetching weather:", error);
      setError("Failed to fetch weather. Try again later.");
      setWeather(null);
    }
  };

  const getWeatherIcon = (weatherMain) => {
    switch (weatherMain) {
      case "Clear":
        return <WiDaySunny size={100} color="#FFD700" />;
      case "Clouds":
        return <WiDayCloudy size={100} color="#B0C4DE" />;
      case "Rain":
        return <WiRain size={100} color="#1E90FF" />;
      case "Snow":
        return <WiSnow size={100} color="#FFFFFF" />;
      case "Thunderstorm":
        return <WiThunderstorm size={100} color="#FFA500" />;
      default:
        return <WiDayCloudy size={100} color="#B0C4DE" />;
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="app">
      <div className="weather-container">
        <h1>Weather App</h1>
        <div className="search-box">
          <FaMapMarkerAlt size={20} color="white" />
          <input
            type="text"
            placeholder="Enter city, zip, or landmark..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button onClick={fetchWeather}>
            <FaSearch size={20} />
          </button>
        </div>

        {error && <p className="error-message">{error}</p>}

        {weather && (
          <div className="weather-info">
            {getWeatherIcon(weather.weather[0].main)}
            <h2>{weather.name}, {weather.sys.country}</h2>
            <p>{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
            <h3>{weather.main.temp.toFixed(1)}°C</h3>
            <p className="weather-desc">{weather.weather[0].description}</p>

            <div className="weather-details">
              <div className="detail">
                <BsSunrise size={20} color="#FF8C00" />
                <span>Sunrise: {formatTime(weather.sys.sunrise)}</span>
              </div>
              <div className="detail">
                <BsSunset size={20} color="#FF4500" />
                <span>Sunset: {formatTime(weather.sys.sunset)}</span>
              </div>
              <div className="detail">
                <WiHumidity size={20} color="#00BFFF" />
                <span>Humidity: {weather.main.humidity}%</span>
              </div>
              <div className="detail">
                <WiStrongWind size={20} color="#A9A9A9" />
                <span>Wind: {weather.wind.speed.toFixed(1)} m/s</span>
              </div>
              <div className="detail">
                <WiBarometer size={20} color="#708090" />
                <span>Pressure: {weather.main.pressure} hPa</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherApp;










