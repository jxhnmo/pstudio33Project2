"use client";
import { useRouter } from 'next/navigation';

import { useEffect, useState } from 'react';
import styles from '@/app/orderSummary/orderSummary.module.css';
import { completeTransaction, getMaxId } from '../order';
import { Router } from 'next/router';
import dynamic from 'next/dynamic';
const Sidebar = dynamic(() => import('../../components/sidebar/Sidebar'), {
  ssr: false,
});

interface Item {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const OrderSummary = () => {
  const router = useRouter();

  // State to track whether it's Dine-In or Takeout
  const [isTakeout, setIsTakeout] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('selectedItems') || '[]');
    setSelectedItems(items);
  }, []);

  const totalPrice = selectedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Toggle between Dine-In and Takeout
  const toggleTakeout = () => {
    setIsTakeout(!isTakeout);
  };

  const handleConfirmOrder = async () => {
    const currentTime = new Date();
    const orderId = await getMaxId() + 1;

    // Pass 'isTakeout' to completeTransaction
    completeTransaction(totalPrice.toFixed(2), selectedItems, isTakeout);

    localStorage.setItem('orderId', JSON.stringify(orderId));
    setSelectedItems([]);
    localStorage.setItem('selectedItems', JSON.stringify([]));
    router.push('/ThankYou');
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = [...selectedItems];
    updatedItems.splice(index, 1);
    setSelectedItems(updatedItems);
    localStorage.setItem('selectedItems', JSON.stringify(updatedItems));
  };


  return (
    <>
      <Sidebar />
      <div className={styles.main}>
        <h1 className={styles.orderSummaryHeader}>Order Summary</h1>
        
        {/* Order Details */}
        <div className={styles.orderList}>
          {selectedItems.length > 0 ? (
            selectedItems.map((item, index) => (
              <div key={index} className={styles.orderItem}>
                <div>
                  {item.name} - ${Number(item.price).toFixed(2)} x {item.quantity}
                </div>
                <button onClick={() => handleRemoveItem(index)} className={styles.removeButton}>
                  Remove
                </button>
              </div>
            ))
          ) : (
            <div>No items in the order.</div>
          )}
        </div>
        
        {/* Order Total */}
        <div className={styles.total}>
          Total: <span>${totalPrice.toFixed(2)}</span>
        </div>
        
        {/* Order Submission */}
        <div className={styles.buttonsContainer}>
          <button className={styles.goBackButton} onClick={() => router.back()}>
            Go Back
          </button>
          {/* Dine-In/Takeout Toggle */}
          <div className={styles.toggleContainer}>
            <button
              onClick={toggleTakeout}
              className={isTakeout ? styles.confirmOrderButton : styles.confirmOrderButton}
            >
              {isTakeout ? 'Switch to Dine-In' : 'Switch to Takeout'}
            </button>
        </div>
          <button onClick={handleConfirmOrder} className={styles.confirmOrderButton}>
            Confirm Order
          </button>
        </div>
      </div>
    </>
  );
};

export default OrderSummary;