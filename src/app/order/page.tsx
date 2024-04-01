"use client";
import Link from 'next/link';
import Image from "next/image";
import styles from "@/app/order/order.module.css";
import { useEffect, useState } from 'react';

import { fetchCategories, fetchItems, completeTransaction } from '../order';

interface Item {
  id: number;
  name: string;
  price: number;
  quantity: number;
  // Add other properties as needed
}

export default function Home() {
  // const [categories, setCategories] = useState([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [currentCategoryItems, setCurrentCategoryItems] = useState<Item[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<Item[]>([]); // Use the Item type for selectedItems
  const totalPrice = selectedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);


  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoryObjects = await fetchCategories();
        console.log(categoryObjects);
        const categoryNames = categoryObjects.map(obj => obj.category);
        setCategories(categoryNames);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    loadCategories();
  }, []);

  // Function to load items for a selected category
  const loadItemsForCategory = async (categoryName: any) => {
    try {
      const items = await fetchItems(categoryName);
      console.log(items);
      setCurrentCategoryItems(items);
      setActiveCategory(categoryName);
    } catch (error) {
      console.error(`Failed to fetch items for category ${categoryName}:`, error);
      setCurrentCategoryItems([]); // Consider resetting or handling the error state differently
    }
  };

  const handleSelectItem = (item: Item) => {
    const existingItem = selectedItems.find(selectedItem => selectedItem.id === item.id);

    if (existingItem) {
      // Update the quantity of the existing item
      const updatedItems = selectedItems.map(selectedItem =>
        selectedItem.id === item.id ? { ...selectedItem, quantity: selectedItem.quantity + 1 } : selectedItem
      );
      setSelectedItems(updatedItems);
    } else {
      // Add the new item with a quantity of 1
      setSelectedItems([...selectedItems, { ...item, quantity: 1 }]);
    }
  };

  const handleRemoveItem = (item: Item) => {

  };

  const handleConfirmOrder = () => {
    const currentTime: Date = new Date();
    // console.log(currentTime.toISOString());
    completeTransaction(totalPrice.toFixed(2), selectedItems);
    // selectedItems.map((item,index) => {console.log(item.id+item.name+item.price+item.quantity)})
    setSelectedItems([]);
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
          <button key={index} onClick={() => handleSelectItem(item)}>
            {item.name}
          </button> // Adjust to match your item object structure
        ))}
      </div>
      {/* Current Order Column */}
      <div className={styles.currentOrder}>
        <div className={styles.currOrderTop}>
          <h2 className={styles.currentOrderTitle}>Current Order</h2>
          <div className={styles.orderList}>
            {selectedItems.map((item: { name: string, price: number, quantity: number }, index: number) => (
              <div key={index}>
                {item.name} - ${item.price} x {item.quantity}
              </div>
            ))}
          </div>
        </div>
        <div className={styles.currOrderBtm}>
          <div className={styles.total}>
            Total: <span>${totalPrice.toFixed(2)}</span>
          </div>
          <Link href="/orderSummary" className={styles.confirmOrderButton}>
              Confirm Order
            </Link>

        </div>
      </div>
    </div>
  );
}
