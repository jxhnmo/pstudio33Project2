"use client";
import { useRouter } from 'next/navigation'; // Ensure this import is at the top

import { useEffect, useState } from 'react';
import styles from '@/app/orderSummary/orderSummary.module.css'; // Adjust the path as necessary
import { completeTransaction, getMaxId } from '../order';
import { Router } from 'next/router';
import dynamic from 'next/dynamic';
const Sidebar = dynamic(() => import('../../components/sidebar/Sidebar'), {
  ssr: false,
});

// If you're placing this in the same file
interface Item {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const OrderSummary = () => {
  const router = useRouter(); // Use the useRouter hook

  const [selectedItems, setSelectedItems] = useState<Item[]>([]);

  useEffect(() => {
    // Retrieve and parse the selected items from local storage
    const items = JSON.parse(localStorage.getItem('selectedItems') || '[]');
    setSelectedItems(items);
  }, []);

  // Calculate the total price
  const totalPrice = selectedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleConfirmOrder = async () => {
    const currentTime: Date = new Date();
    // console.log(currentTime.toISOString());
    const orderId = await getMaxId() + 1;
    completeTransaction(totalPrice.toFixed(2), selectedItems);
    console.log(orderId);
    localStorage.setItem('orderId', JSON.stringify(orderId));

    // selectedItems.map((item,index) => {console.log(item.id+item.name+item.price+item.quantity)})
    setSelectedItems([]);

    router.push('/ThankYou');
  };

  return (
    <>
    <Sidebar />
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
    </>
  );
};

export default OrderSummary;