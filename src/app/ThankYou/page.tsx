"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Adjusted import for useRouter
import styles from './thankYou.module.css'; // Adjust the path as necessary

const ThankYou = () => {
  const router = useRouter();
  // State to manage style based on weatherData presence
  const [isWeatherClear, setIsWeatherClear] = useState(false);

  useEffect(() => {
    // Check if 'weatherData' is clear or not and set style state
    const weatherData = localStorage.getItem('weatherData');
    setIsWeatherClear(!weatherData);

    if(localStorage.getItem('role') === 'staff'){
      const timer = setTimeout(() => router.push('/staff/order'), 5000);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => router.push('/order'), 5000);
    return () => clearTimeout(timer);
  }, [router]);

  const orderId = localStorage.getItem('orderId');
  
  // Use different class based on isWeatherClear state
  const containerStyle = isWeatherClear ? styles.containerClear : styles.containerNotClear;
  
  return (
    <div className={containerStyle}>
      <h1 className={styles.header}>Thank you for your business!</h1>
      <p className={styles.message}>Your order will be out shortly.</p>
      {orderId && <p className={styles.message}>Your order, {orderId} , will be out shortly.</p>}
    </div>
  );
};

export default ThankYou;