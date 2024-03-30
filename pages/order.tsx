"use client";

import Image from "next/image";
import styles from "../src/app/styles/order.module.css";
import { useEffect, useState } from 'react';

import { fetchCategories, fetchItems } from './api/order';


export default function Home() {
  const [categories, setCategories] = useState([]);
  const [currentCategoryItems, setCurrentCategoryItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        setCategories(data.map((cat) => cat.category));
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
  
    loadCategories();
  }, []);
  

  // Function to load items for a selected category
  const loadItemsForCategory = async (categoryName: string) => {
    try {
      const response = await fetch(`/api/items/${categoryName}`);
      const items = await response.json();
      setCurrentCategoryItems(items);
      setActiveCategory(categoryName);
    } catch (error) {
      console.error(`Failed to fetch items for category ${categoryName}:`, error);
      setCurrentCategoryItems([]);
    }
  };


  return (
    <div className={styles.main}>
      {/* Categories Column */}
      <div className={styles.categories}>
        <h2 className={styles.categoriesHeader}>Categories</h2>
        <div className={styles.categoriesList}>
          {categories.map((categoryName, index) => (
            <button
              key={index}
              className={`${styles.categoryButton} ${activeCategory === categoryName ? styles.activeCategory : ''}`}
              onClick={() => loadItemsForCategory(categoryName)}
            >
              {categoryName}
            </button>
          ))}
        </div>
      </div>
      {/* Order Menu */}
      <div className={styles.orderMenu}>
        {currentCategoryItems.map((item, index) => (
          <button key={index}>{item.name}</button> // Adjust to match your item object structure
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