"use client";

import Link from "next/link";
import styles from "@/app/menu/menu.module.css";

// Just for testing, data should be retrieved from database
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

export default function Home() {
  return (
    <Link href="/" style={{ width: '100%', height: '100%' }}>
      <h1>This is the menu</h1>
    </Link>
  );
}

