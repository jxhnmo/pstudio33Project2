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
  return (
    <div className={styles.menuContainer}>
      <Link href="/" style={{ width: '100%', height: '100%' }}>
        <h1>This is the menu</h1>
      </Link>
      {menuData.map((category) => (
        <div key={category.category} className={styles.category}>
          <h2>{category.category}</h2>
          <div className={styles.items}>
            {category.items.map((item) => (
              <div key={item.name} className={styles.item}>
                <img src={item.imageUrl} alt={item.name} className={styles.itemImage}/>
                <p>{item.name} - ${item.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;
