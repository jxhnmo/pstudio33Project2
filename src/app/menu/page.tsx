"use client";
import Link from "next/link";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Corrected the import statement
import styles from "@/app/menu/menu.module.css";
import { fetchCategories, fetchItems } from '../menu';

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

const Home = () => {
  const router = useRouter();
  const [menuData, setMenuData] = useState<MenuCategory[]>([]);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [fadeState, setFadeState] = useState('in');

  useEffect(() => {
    async function loadData() {
      const categories = await fetchCategories();
      const data = await Promise.all(categories.map(async (category) => {
        const items = await fetchItems(category.category);
        if (Array.isArray(items)) {
          items.forEach((item) => {
            item.imageUrl = `/images/${item.name.replace(/\s/g, '').toLowerCase()}.png`;
          });
        }
        return { category: category.category, items };
      }));
      setMenuData(data);
    }

    loadData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeState('out');
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (fadeState === 'out') {
      setTimeout(() => {
        setCurrentCategoryIndex(prev => (prev + 1) % menuData.length);
        setFadeState('in');
      }, 500);
    }
  }, [fadeState]);

  const currentCategory = menuData[currentCategoryIndex] || { category: '', items: [] };

  return (
    <>
      <Sidebar />
      <Link href="/" passHref>
        <h1 className={styles.heading}>REV&apos;s American Grill</h1>
      </Link>
      <div className={styles.menuContainer} onClick={() => router.push('/order')}>
        <div key={currentCategory.category} className={`${styles.categoryContainer} ${styles[fadeState]}`}>
          <h2>{currentCategory.category}</h2>
          <div className={styles.items}>
            {currentCategory.items.map(item => (
              <div key={item.name} className={styles.itemContainer}>
                <img src={item.imageUrl} alt={item.name} className={styles.itemImage} />
                <p className={styles.itemNamePrice}>{item.name} - ${Number(item.price).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;