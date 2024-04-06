"use client";

import Link from 'next/link';
import styles from "@/app/staff/inventory/staffInventory.module.css";
import dynamic from 'next/dynamic';

import { ChangeEvent, useEffect, useState } from 'react';

import { fetchInventory, addItem, updateItemStock } from '../../inventory';


const Sidebar = dynamic(() => import('../../../components/sidebar/Sidebar'), {
  ssr: false,
});

interface Item {
  id: number;
  item_name: string;
  max_stock: number;
  price: number;
  stock: number;

  isEditing?: boolean;
  orderQuantity?: number;
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

  const toggleEdit = (index: number) => {
    const updatedInventory = inventory.map((item, idx) => {
      if (idx === index) {
        // Toggle the isEditing state of the item
        return { ...item, isEditing: !item.isEditing };
      }
      return item;
    });
    setInventory(updatedInventory);
  };

  const handleEditChange = (event: ChangeEvent<HTMLInputElement>, index: number, field: string) => {
    const updatedInventory = inventory.map((item, idx) => {
      if (idx === index) {
        return { ...item, [field]: event.target.value };
      }
      return item;
    });
    setInventory(updatedInventory);
  };

  const adjustOrderQuantity = (index: number, adjustment: number) => {
    const updatedInventory = inventory.map((item, idx) => {
      if (idx === index) {
        return { ...item, orderQuantity: (item.orderQuantity || 0) + adjustment };
      }
      return item;
    });
    setInventory(updatedInventory);
  };

  const handleOrderQuantityChange = (event: ChangeEvent<HTMLInputElement>, index: number) => {
    const updatedInventory = inventory.map((item, idx) => {
      if (idx === index) {
        return { ...item, orderQuantity: parseInt(event.target.value) };
      }
      return item;
    });
    setInventory(updatedInventory);
  };

  const handleBulkOrder = async () => {
    const orderPromises = inventory.map(item => {
      if (item.orderQuantity && item.orderQuantity > 0) {
        return updateItemStock(item.id, item.orderQuantity);
      }
      return Promise.resolve();
    });

    const loadData = async () => {
      try {
        const data = await fetchInventory();
        setInventory(data);
      }
      catch (error) {
        console.error("Failed to fetch:", error);
      }
    };

    try {
      await Promise.all(orderPromises);
      alert('All orders processed successfully.');
      setInventory(inventory.map(item => ({ ...item, orderQuantity: 0 })));
      loadData();
    } catch (error) {
      console.error("Failed to process bulk order:", error);
      alert('Failed to process some orders.');
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
                    <th>Order Stock</th>
                    <th>Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((item: Item, index: number) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.item_name}</td>
                      <td>
                        {item.isEditing ? (
                          <input
                            type="number"
                            value={item.max_stock}
                            onChange={(e) => handleEditChange(e, index, 'max_stock')}
                          />
                        ) : (
                          item.max_stock
                        )}
                      </td>
                      <td>
                        {item.isEditing ? (
                          <input
                            type="number"
                            value={item.price}
                            onChange={(e) => handleEditChange(e, index, 'price')}
                          />
                        ) : (
                          `$${item.price}`
                        )}
                      </td>
                      <td>{item.stock}</td>

                      <td>
                        {/* <th>Order More</th> */}
                        <button onClick={() => adjustOrderQuantity(index, -50)}>-</button>
                        <input
                          type="number"
                          value={item.orderQuantity || 0}
                          onChange={(e) => handleOrderQuantityChange(e, index)}
                          style={{ width: "50px" }}
                        />
                        <button onClick={() => adjustOrderQuantity(index, 50)}>+</button>                      </td>

                      <td>
                        <button onClick={() => toggleEdit(index)}>{item.isEditing ? 'Save' : 'Edit'}</button>
                      </td>



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
              <button onClick={handleBulkOrder} className={styles.orderButton}>Process All Orders</button>
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
