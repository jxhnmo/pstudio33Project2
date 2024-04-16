"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './thankYou.module.css';

const ThankYou = () => {
  const router = useRouter();
  const [isWeatherClear, setIsWeatherClear] = useState(false);

  useEffect(() => {
    // Check if 'weatherData' is clear or not and set style state
    if (typeof window !== 'undefined') {
      const weatherData = window.localStorage.getItem('weatherData');
      setIsWeatherClear(!weatherData);
    }

    if (typeof window !== 'undefined') {
      if (window.localStorage.getItem('role') === 'staff') {
        const timer = setTimeout(() => router.push('/staff/order'), 5000);
        return () => clearTimeout(timer);
      }
    }

    const timer = setTimeout(() => router.push('/order'), 5000);
    return () => clearTimeout(timer);
  }, [router]);

  const orderId = typeof window !== 'undefined' ? window.localStorage.getItem('orderId') : null;

  // Use different class based on isWeatherClear state
  const containerStyle = isWeatherClear ? styles.containerClear : styles.containerNotClear;

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Thank you for your business!</h1>
      <p className={styles.message}>Your order will be out shortly.</p>
      {orderId && <p className={styles.message}>Your order, {orderId}, will be out shortly.</p>}
    </div>
  );
};

export default ThankYou;