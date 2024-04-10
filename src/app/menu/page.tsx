"use client";
import Link from "next/link";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Corrected the import statement
import styles from "@/app/menu/menu.module.css";
import { fetchCategories, fetchItems } from '../menu'; // Adjust the import path as needed

import dynamic from 'next/dynamic';
const Sidebar = dynamic(() => import('../../components/sidebar/Sidebar'), {
  ssr: false,
});

interface MenuItem {
  name: string;
  price: number;
  imageUrl: string;
}
interface MenuCategory {
  category: string;
  items: MenuItem[];
}

interface SelectedItem extends MenuItem {
  quantity: number;
}

const Home: React.FC = () => {
  const router = useRouter(); // Use useRouter hook for navigation
  const [menuData, setMenuData] = useState<MenuCategory[]>([]);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const totalPrice = selectedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  useEffect(() => {
    const loadData = async () => {
      const categories = await fetchCategories();
      const menuData = await Promise.all(categories.map(async (category) => {
        const items = await fetchItems(category.category);
        if (Array.isArray(items)) {
          items.forEach((item) => {
            item.imageUrl = `/images/${item.name.replace(/\s/g, '')}.png`;
          });
        }
        return { category: category.category, items };
      }));
      setMenuData(menuData);
    };

    loadData();

    // Rotating categories logic
    const interval = setInterval(() => {
      setCurrentCategoryIndex((prevIndex) => (prevIndex + 1) % menuData.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [menuData.length]);

  const currentCategory = menuData[currentCategoryIndex] || { category: '', items: [] };

  return (
    <>
      <Sidebar />

      <Link href="/" passHref>
        <h1 className={styles.heading}>REV&apos;s American Grill</h1>
      </Link>
      <div
        className={styles.menuContainer}
        onClick={() => router.push('/order')} // Redirect to order page on click
      >
        <div key={currentCategory.category} className={`${styles.categoryContainer} ${styles.fade}`}>
          <h2>{currentCategory.category}</h2>
          <div className={styles.items}>
            {currentCategory.items.map((item) => (
              <div key={item.name} className={styles.itemContainer}>
                <img src={item.imageUrl} alt={item.name} className={styles.itemImage} />
                <p className={styles.itemNamePrice}>{item.name} - ${item.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
