"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './thankYou.module.css';

const ThankYou = () => {
  const router = useRouter();
  const [isWeatherClear, setIsWeatherClear] = useState(false);
  const [isStaff, setIsStaff] = useState(false); // State to track if the user is a staff member

  useEffect(() => {
    // Check if 'weatherData' is clear or not and set style state
    if (typeof window !== 'undefined') {
      const weatherData = window.localStorage.getItem('weatherData');
      setIsWeatherClear(!weatherData);

      // Check user role
      const role = window.localStorage.getItem('role');
      if (role === 'staff') {
        setIsStaff(true);
        const timer = setTimeout(() => router.push('/staff/order'), 5000);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => router.push('/order'), 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [router]);

  const orderId = typeof window !== 'undefined' ? window.localStorage.getItem('orderId') : null;

  // Handling the display based on the user role
  if (isStaff) {
    return (
      <div className={styles.container}>
        <h1 className={styles.header}>Staff Information</h1>
        <p className={styles.message}>Order {orderId} has been processed.</p>
      </div>
    );
  }

  // Non-staff user sees the thank you message
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Thank you for your business!</h1>
      <p className={styles.message}>Your order will be out shortly.</p>
      {orderId && <p className={styles.message}>Your order, {orderId}, will be out shortly.</p>}
    </div>
  );
};

export default ThankYou;
