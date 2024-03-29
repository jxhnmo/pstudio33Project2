"use client";

import Link from "next/link";
import React, { useState, useEffect } from 'react';
import styles from "../src/app/styles/menu.module.css";

// Temporary data before database connection is coded
const menuData = [
  {
    category: "Appetizers",
    items: [
      { name: "Spring Rolls", price: 5.99, imageUrl: "/images/spring-rolls.jpg" },
      { name: "Garlic Bread", price: 4.99, imageUrl: "/images/garlic-bread.jpg" },
      { name: "Spring Rolls", price: 5.99, imageUrl: "/images/spring-rolls.jpg" },
      { name: "Garlic Bread", price: 4.99, imageUrl: "/images/garlic-bread.jpg" },
      { name: "Spring Rolls", price: 5.99, imageUrl: "/images/spring-rolls.jpg" },
      { name: "Garlic Bread", price: 4.99, imageUrl: "/images/garlic-bread.jpg" },
    ],
  },
  {
    category: "Entrees",
    items: [
      { name: "Steak", price: 19.99, imageUrl: "/images/steak.jpg" },
      { name: "Salmon", price: 17.99, imageUrl: "/images/salmon.jpg" },
      { name: "Steak", price: 19.99, imageUrl: "/images/steak.jpg" },
      { name: "Salmon", price: 17.99, imageUrl: "/images/salmon.jpg" },
      { name: "Steak", price: 19.99, imageUrl: "/images/steak.jpg" },
      { name: "Salmon", price: 17.99, imageUrl: "/images/salmon.jpg" },
      { name: "Steak", price: 19.99, imageUrl: "/images/steak.jpg" },
    ],
  },
];

const Home: React.FC = () => {
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCategoryIndex((prevIndex) => (prevIndex + 1) % menuData.length);
    }, 5000); // Change category every 5000 ms (5 seconds)

    return () => clearInterval(interval);
  }, []);

  const currentCategory = menuData[currentCategoryIndex];

  return (
    <div className={styles.menuContainer}>
      <Link href="/" style={{ width: '100%', height: '100%' }}>
        <h1 className={styles.heading}>REV's American Grill</h1>
      </Link>
      <div key={currentCategory.category} className={`${styles.categoryContainer} ${styles.fade}`}>
        <h2>{currentCategory.category}</h2>
        <div className={styles.items}>
          {currentCategory.items.map((item) => (
            <div key={item.name} className={styles.itemContainer}>
              <img src={item.imageUrl} alt={item.name} className={styles.itemImage}/>
              <p className={styles.itemNamePrice}>{item.name} - ${item.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;