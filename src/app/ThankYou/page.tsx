"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Adjusted import for useRouter
import styles from './ThankYou.module.css'; // Adjust the path as necessary

const ThankYou = () => {
  const router = useRouter();

  useEffect(() => {
    if(localStorage.getItem('role') === 'staff'){
      const timer = setTimeout(() => router.push('/staff/order'), 5000);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => router.push('/order'), 5000);
    return () => clearTimeout(timer);
  }, [router]);

  const orderId = localStorage.getItem('orderId');
  
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Thank you for your business!</h1>
      <p className={styles.message}>Your order will be out shortly.</p>
      {orderId && <p className={styles.message}>Your order, {orderId} , will be out shortly.</p>}
    </div>
  );
};

export default ThankYou;