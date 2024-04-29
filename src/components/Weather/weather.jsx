"use client";
import React, { useState, useEffect } from 'react';
import styles from './Weather.module.css';
import { fetchWeatherAllData } from '../../app/weather'; // Adjust the path as necessary

const Weather = ({ zipCode }) => {
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);



    useEffect(() => {
        const loadWeatherData = async () => {

            try {
                if (typeof window !== 'undefined') {
                    const data = await fetchWeatherAllData(zipCode);
                    setWeatherData(data);
                }


            } catch (error) {
                console.error('Error fetching weather data:', error);
                setWeatherData(null);
            }
   
        setLoading(false);
        };

        loadWeatherData();
    }, []);

    if (loading) {
        return <div className={styles.weatherContainer}>Loading weather data...</div>;
    }

    if (!weatherData || !weatherData.weather || weatherData.weather.length === 0) {
        return <div className={styles.weatherContainer}>Weather data is not available.</div>;
    }

    return (
        <div className={styles.weatherContainer}>
            <h2>Weather in {weatherData.name}</h2>
            <div className={styles.weatherDetails}>
                <p><strong>Condition:</strong> {weatherData.weather[0].main} ({weatherData.weather[0].description})</p>
                <p><strong>Temperature:</strong> {Math.round(weatherData.main.temp - 273.15)}°C (Feels like {Math.round(weatherData.main.feels_like - 273.15)}°C)</p>
                <p><strong>Humidity:</strong> {weatherData.main.humidity}%</p>
                <p><strong>Wind:</strong> {weatherData.wind.speed} m/s from {weatherData.wind.deg} degrees</p>
            </div>
        </div>
    );
};

export default Weather;