"use client";

import Link from 'next/link';
import styles from "@/app/staff/inventory/staffInventory.module.css";
import dynamic from 'next/dynamic';

import { useEffect, useState } from 'react';

import { fetchInventory } from '../../inventory';


const Sidebar = dynamic(() => import('../../../components/sidebar/Sidebar'), {
  ssr: false,
});

interface Item {
  id: number;
  item_name: string;
  max_stock: number;
  price: number;
  stock: number;
}


export default function StaffInventory() {
  const [inventory, setInventory] = useState<Item[]>([]);


  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchInventory();
        console.log(data);
        setInventory(data);
      }
      catch (error) {
        console.error("Failed to fetch:", error);
      }
    }

    loadData();
  }, []);

  return (
    <>
      <div className="pageContainer">
        <Sidebar />

        <div className={styles.main}>
          <h1 className={styles.title}>Inventory</h1>
          <div className={styles.container}>
            {/* Inventory Grid */}
            <div className={styles.inventoryTableContainer}>
              <table className={styles.inventoryTable}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Item Name</th>
                    <th>Max Stock</th>
                    <th>Price</th>
                    <th>Current Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((item: Item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.item_name}</td>
                      <td>{item.max_stock}</td>
                      <td>${item.price}</td>
                      <td>{item.stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>


        {/* Navigation Buttons */}
        <div className={styles.buttonsContainer}>
          <Link href="/staff/order" legacyBehavior>
            <a className={styles.navButton}>Staff Order</a>
          </Link>
          <Link href="/staff/stats" legacyBehavior>
            <a className={styles.navButton}>Staff Stats</a>
          </Link>
          <Link href="/staff/inventory" legacyBehavior>
            <a className={styles.navButton}>Staff Inventory</a>
          </Link>
        </div>
      </div>
    </>
  );
}
