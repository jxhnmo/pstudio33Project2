// "use client";

// import Link from "next/link";
// import React, { useState, useEffect } from 'react';
// import styles from "@/app/menu/menu.module.css";

// // Temporary data before database connection is coded
// const menuData = [
//   {
//     category: "Appetizers",
//     items: [
//       { name: "Spring Rolls", price: 5.99, imageUrl: "/images/spring-rolls.jpg" },
//       { name: "Garlic Bread", price: 4.99, imageUrl: "/images/garlic-bread.jpg" },
//       { name: "Spring Rolls", price: 5.99, imageUrl: "/images/spring-rolls.jpg" },
//       { name: "Garlic Bread", price: 4.99, imageUrl: "/images/garlic-bread.jpg" },
//       { name: "Spring Rolls", price: 5.99, imageUrl: "/images/spring-rolls.jpg" },
//       { name: "Garlic Bread", price: 4.99, imageUrl: "/images/garlic-bread.jpg" },
//     ],
//   },
//   {
//     category: "Entrees",
//     items: [
//       { name: "Steak", price: 19.99, imageUrl: "/images/steak.jpg" },
//       { name: "Salmon", price: 17.99, imageUrl: "/images/salmon.jpg" },
//       { name: "Steak", price: 19.99, imageUrl: "/images/steak.jpg" },
//       { name: "Salmon", price: 17.99, imageUrl: "/images/salmon.jpg" },
//       { name: "Steak", price: 19.99, imageUrl: "/images/steak.jpg" },
//       { name: "Salmon", price: 17.99, imageUrl: "/images/salmon.jpg" },
//       { name: "Steak", price: 19.99, imageUrl: "/images/steak.jpg" },
//     ],
//   },
// ];

// const Home: React.FC = () => {
//   const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentCategoryIndex((prevIndex) => (prevIndex + 1) % menuData.length);
//     }, 5000); // Change category every 5000 ms (5 seconds)

//     return () => clearInterval(interval);
//   }, []);

//   const currentCategory = menuData[currentCategoryIndex];

//   return (
//     <div className={styles.menuContainer}>
//       <Link href="/" style={{ width: '100%', height: '100%' }}>
//         <h1 className={styles.heading}>REV&apos;s American Grill</h1>
//       </Link>
//       <div key={currentCategory.category} className={`${styles.categoryContainer} ${styles.fade}`}>
//         <h2>{currentCategory.category}</h2>
//         <div className={styles.items}>
//           {currentCategory.items.map((item) => (
//             <div key={item.name} className={styles.itemContainer}>
//               <img src={item.imageUrl} alt={item.name} className={styles.itemImage}/>
//               <p className={styles.itemNamePrice}>{item.name} - ${item.price.toFixed(2)}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;
"use client";

import Link from "next/link";
import React, { useState, useEffect } from 'react';
import styles from "@/app/menu/menu.module.css";
import { fetchCategories, fetchItems } from '../menu'; // Adjust the import path as needed
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
  const [menuData, setMenuData] = useState<MenuCategory[]>([]);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const totalPrice = selectedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  useEffect(() => {
    const loadData = async () => {
      const categories = await fetchCategories();
      const menuData = await Promise.all(categories.map(async (category) => {
        const items = await fetchItems(category.category);
      // for each throguh items 
      //  items.forEach((item) => {
      //     item.name = item.name.replace(/\s/g, '');
      //     item.imageUrl = `/images/${item.name}.jpg`;
      //   });
        return { category: category.category, items };
      }));
      setMenuData(menuData);
    };

    loadData();

    const interval = setInterval(() => {
      setCurrentCategoryIndex((prevIndex) => (prevIndex + 1) % menuData.length);
    }, 5000); // Change category every 5000 ms (5 seconds)

    return () => clearInterval(interval);
  }, [menuData.length]);

  const currentCategory = menuData[currentCategoryIndex] || { category: '', items: [] };

  return (
    <div className={styles.menuContainer}>
      <Link href="/" style={{ width: '100%', height: '100%' }}>
        <h1 className={styles.heading}>REV&apos;s American Grill</h1>
      </Link>
      <div key={currentCategory.category} className={`${styles.categoryContainer} ${styles.fade}`}>
        <h2>{currentCategory.category}</h2>
        <div className={styles.items}>
          {currentCategory.items.map((item) => (
            <div key={item.name} className={styles.itemContainer}>
              <img src={item.imageUrl} alt={item.name} className={styles.itemImage}/>
              <p className={styles.itemNamePrice}>{item.name} - ${item.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
