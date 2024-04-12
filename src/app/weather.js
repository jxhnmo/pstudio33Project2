'use server';
import axios from 'axios';

export async function fetchWeather() {
    // if (process.env.WEATHER_KEY === undefined) {
    //     console.log("WEATHER_KEY is undefined");
    //     return "WEATHER KEY IS UNDEFINED"; // Exit the function if WEATHER_KEY is not defined
    // }
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