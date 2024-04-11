"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Adjusted import for useRouter
import styles from '@/app/ThankYou/thankYou.module.css'; // Adjust the path as necessary

const InventoryOrderConfirmed = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => router.push('/'), 5000);
    return () => clearTimeout(timer);
  }, [router]);

  
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Your order is confirmed</h1>
      <p className={styles.message}>Restock coming soon</p>
    </div>
  );
};

export default InventoryOrderConfirmed;