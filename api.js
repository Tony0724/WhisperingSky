import React from "react";

const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const apiKey = '26c67ed58f6cd8d8670df2b48a80a200';

export function getWeatherData(latitude, longitude) {
  let weatherData;
  fetch(`${BASE_URL}/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=kr&appid=${apiKey}`).then((res) => res.json())
  .then((data) => weatherData = data);
  return weatherData;
}

export function getAirData(latitude, longitude) {
  let airData;
  fetch(`${BASE_URL}/air_pollution?lat=${latitude}&lon=${longitude}&units=metric&lang=kr&appid=${apiKey}`).then((res) => res.json()).then((data) => airData = data);
  return airData
}

