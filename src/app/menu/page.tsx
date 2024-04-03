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

import dynamic from 'next/dynamic';
import Link from "next/link";
import React, { useState, useEffect } from 'react';
import styles from "@/app/menu/menu.module.css";
import { fetchCategories, fetchItems } from '../menu'; // Adjust the import path as needed

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
  const [menuData, setMenuData] = useState<MenuCategory[]>([]);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const totalPrice = selectedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const [currentPage, setCurrentPage] = useState(0);


  useEffect(() => {
    const loadData = async () => {
      const categories = await fetchCategories();
      const menuData = await Promise.all(categories.map(async (category) => {
        const items = await fetchItems(category.category);
      // for each throguh items 
       items.forEach((item) => {
          item.imageUrl = `/images/${item.name.replace(/\s/g, '')}.png`;
        });
        return { category: category.category, items };
      }));
      setMenuData(menuData);
    };

    loadData();

    const interval = setInterval(() => {
      setCurrentCategoryIndex((prevIndex) => {
        // Calculate the number of pages for the current category
        const numPages = Math.ceil(menuData[prevIndex].items.length / 3);
        // If the current page is the last page of the current category, move to the next category
        if (currentPage + 1 < numPages) {
          setCurrentPage(currentPage + 1);
          return prevIndex; // Stay on the current category, but increment page
        } else {
          setCurrentPage(0); // Reset to the first page for the next category
          return (prevIndex + 1) % menuData.length; // Move to the next category
        }
      });
    }, 5000); // Adjust time as needed
  
    return () => clearInterval(interval);
  }, [menuData.length, currentPage]);
  
   // Empty dependency array means this effect runs only once on mount

  const currentCategory = menuData[currentCategoryIndex] || { category: '', items: [] };

  return (
    <>
    <Sidebar />
    <div className={styles.menuContainer}>
      <Link href="/" style={{ width: '100%', height: '100%' }}>
        <h1 className={styles.heading}>REV&apos;s American Grill</h1>
      </Link>
      <div key={currentCategory.category} className={`${styles.categoryContainer} ${styles.fade}`}>
        <h2>{currentCategory.category}</h2>
        <div className={styles.items}>
          {currentCategory.items
          .slice(currentPage * 3, (currentPage + 1) * 3)
          .map((item) => (
            <div key={item.name} className={styles.itemContainer}>
              <img src={item.imageUrl} alt={item.name} className={styles.itemImage}/>
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
