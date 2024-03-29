"use client";

import Image from "next/image";
import styles from "@/app/order/order.module.css";
import { useEffect, useState } from 'react';

import { fetchCategories } from '../categories';



export default function Home() {

  const [categories, setCategories] = useState([]);
  const [currentCategoryItems, setCurrentCategoryItems] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetchCategories();
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setCategories(data);
        // Assuming your data structure has items within categories, adjust as necessary
        if (data.length > 0) {
          setCurrentCategoryItems(data[0].items || []);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const changeCategory = async (categoryName: string) => {
    const response = await fetch(`/api/items?category=${categoryName}`);
    const items = await response.json();
    setCurrentCategoryItems(items);
  };

  return (
    <div className={styles.main}>
      {/* Categories Column */}
      <div className={styles.categories}>
        <h2 className={styles.categoriesHeader}>Categories</h2>
        <div className={styles.categoriesList}>
          {categories.map((category) => (
            <button
              key={category}
              className={styles.categoryButton}
              onClick={() => changeCategory(category)} // Change the current category's items
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      {/* Order Menu */}
      <div className={styles.orderMenu}>
        {currentCategoryItems.map((item, index) => (
          <button key={index}>{item}</button> // Display items for the current category
        ))}
      </div>
      {/* Current Order Column */}
      <div className={styles.currentOrder}>
        <div className={styles.currOrderTop}>
          <h2 className={styles.currentOrderTitle}>Current Order</h2>
          <div className={styles.orderList}>
            {/* Dynamic list of order items would go here */}
            <div>Item 1 - $2.99</div>
            <div>Item 2 - $1.99</div>
            {/* ... more items ... */}
          </div>
        </div>
        <div className={styles.currOrderBtm}>
          <div className={styles.total}>
            Total: $<span>4.98</span> {/* This would be calculated */}
          </div>
          <button className={styles.confirmOrderButton}>Confirm Order</button>
        </div>
      </div>
    </div>
  );
}
