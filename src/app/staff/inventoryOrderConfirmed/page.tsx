"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/app/ThankYou/thankYou.module.css';

const InventoryOrderConfirmed = () => {
  const router = useRouter();
  const [weatherWarning, setWeatherWarning] = useState(false);

  useEffect(() => {
    // Retrieve the weather data from local storage
    const weatherData = localStorage.getItem('weatherData');

    // Check if the weatherData is not 'clear' and set warning state
    if (weatherData != '"Clear"') {
      alert(weatherData);
      setWeatherWarning(true);
    }

    const timer = setTimeout(() => router.push('/'), 5000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Your order is confirmed</h1>
      {weatherWarning && ( <p className = {styles.warning}> Warning: Weather conditions may affect restock times. </p> )}
      <p className={styles.message}>Restock coming soon</p>
    </div>
  );
};

export default InventoryOrderConfirmed;