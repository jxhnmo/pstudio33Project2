"use client";

import Link from 'next/link';
import styles from "@/app/staff/inventory/staffInventory.module.css";
import dynamic from 'next/dynamic';

import { useEffect, useState } from 'react';

import { fetchInventory, addItem } from '../../inventory';


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

interface NewItem {
  item_name?: string;
  max_stock?: number;
  price?: number;
  stock?: number;
}


export default function StaffInventory() {
  const [inventory, setInventory] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState<NewItem>({});

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

  const handleAddNewItem = async () => {
    if (newItem.item_name && newItem.max_stock && newItem.price && newItem.stock) { // Ensure all fields are filled
      try {
        const addedItem = await addItem(newItem);
        if (addedItem) {
          setInventory([...inventory, addedItem]);
          setNewItem({}); // Reset form
        }
      } catch (error) {
        console.error("Failed to add new item:", error);
      }
    } else {
      alert('Please fill in all fields.');
    }
  };

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

                  {/* New Item Row */}
                  <tr>
                    <td>New</td>
                    <td><input type="text" placeholder="Item Name" value={newItem.item_name || ''} onChange={(e) => setNewItem({ ...newItem, item_name: e.target.value })} /></td>
                    <td><input type="number" placeholder="Max Stock" value={newItem.max_stock || ''} onChange={(e) => setNewItem({ ...newItem, max_stock: parseInt(e.target.value) })} /></td>
                    <td><input type="number" placeholder="Price" value={newItem.price || ''} onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) })} /></td>
                    <td><input type="number" placeholder="Stock" value={newItem.stock || ''} onChange={(e) => setNewItem({ ...newItem, stock: parseInt(e.target.value) })} /></td>
                    <td><button onClick={handleAddNewItem}>Add</button></td>
                  </tr>
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
