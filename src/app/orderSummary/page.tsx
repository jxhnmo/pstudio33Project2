"use client";
import { useEffect, useState } from 'react';
import styles from '@/app/orderSummary/orderSummary.module.css'; // Adjust the path as necessary
import { completeTransaction } from '../order';

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

  const handleConfirmOrder = () => {
    const currentTime: Date = new Date();
    // console.log(currentTime.toISOString());
    completeTransaction(totalPrice.toFixed(2), selectedItems);
    // selectedItems.map((item,index) => {console.log(item.id+item.name+item.price+item.quantity)})
    setSelectedItems([]);
  };

  return (
    <div className={styles.main}>
      <h1 className={styles.orderSummaryHeader}>Order Summary</h1>
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
      <button onClick={handleConfirmOrder} className={styles.confirmOrderButton}>
          Confirm Order
        </button>
    </div>
  );
};

export default OrderSummary;