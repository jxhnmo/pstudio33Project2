"use client";

import Link from "next/link";
import styles from "@/app/menu/menu.module.css";

// Temporary data before database connection is coded
const menuData = [
  {
    category: "Appetizers",
    items: [
      { name: "Spring Rolls", price: 5.99, imageUrl: "/images/spring-rolls.jpg" },
      { name: "Garlic Bread", price: 4.99, imageUrl: "/images/garlic-bread.jpg" },
    ],
  },
  {
    category: "Mains",
    items: [
      { name: "Steak", price: 19.99, imageUrl: "/images/steak.jpg" },
      { name: "Salmon", price: 17.99, imageUrl: "/images/salmon.jpg" },
    ],
  },
];

const Home: React.FC = () => {
  const firstCategory = menuData[0]; // to be changed every 5 seconds later

  return (
    <div className={styles.menuContainer}>
      <Link href="/" style={{ width: '100%', height: '100%' }}>
        <h1 className={styles.heading}>REV's American Grill</h1>
      </Link>
      <div key={firstCategory.category} className={styles.categoryContainer}>
        <h2>{firstCategory.category}</h2>
        <div className={styles.items}>
          {firstCategory.items.map((item) => (
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
