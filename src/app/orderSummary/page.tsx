"use client";
import { useEffect, useState } from 'react';
import styles from '@/app/order/order.module.css'; // Adjust the path as necessary

// If you're placing this in the same file
interface Item {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const OrderSummary = () => {
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);

  useEffect(() => {
    // Retrieve and parse the selected items from local storage
    const items = JSON.parse(localStorage.getItem('selectedItems') || '[]');
    setSelectedItems(items);
  }, []);

  // Calculate the total price
  const totalPrice = selectedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className={styles.main}>
      <h1>Order Summary</h1>
      <div className={styles.orderList}>
        {selectedItems.length > 0 ? (
          selectedItems.map((item, index) => (
            <div key={index} className={styles.orderItem}>
              <div>{item.name} - ${item.price} x {item.quantity}</div>
            </div>
          ))
        ) : (
          <div>No items in the order.</div>
        )}
      </div>
      <div className={styles.total}>
        Total: <span>${totalPrice.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default OrderSummary;