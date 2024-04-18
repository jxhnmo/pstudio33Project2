'use server';
import axios from 'axios';

export async function fetchWeather() {
    const url = `https://api.openweathermap.org/data/2.5/weather?zip=77840,us&appid=${process.env.WEATHER_KEY}`;

    try {

        console.log('about to get response');
        const response = await axios.get(url);
        return response.data.weather[0].main;
    } catch (error) {
        console.error("Failed to fetch weather data:", error);
        return "NO WEATHER DATA";
    }
}


export async function fetchWeatherAllData() {
    const url = `https://api.openweathermap.org/data/2.5/weather?zip=77840,us&appid=${process.env.WEATHER_KEY}`;

    try {
        console.log('about to get response');
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch weather data:", error);
        return "NO WEATHER DATA";
    }
}
