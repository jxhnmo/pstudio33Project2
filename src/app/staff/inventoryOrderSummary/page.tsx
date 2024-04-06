"use client";
import { useRouter } from 'next/navigation'; // Ensure this import is at the top
import { useEffect, useState } from 'react';
import styles from '@/app/orderSummary/orderSummary.module.css'; // Adjust the path as necessary
import dynamic from 'next/dynamic';
import { updateItemStock } from '@/app/inventory';

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
  orderQuantity?: number; // This property is now used to filter and display items
}

const InventoryOrderSummary = () => {
  const router = useRouter(); 
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);
  useEffect(() => {
    // Filter out items where orderQuantity is zero or undefined
    const updatedInventory = JSON.parse(localStorage.getItem('inventory') || '[]').filter((item: Item) => item.orderQuantity && item.orderQuantity > 0);
    setSelectedItems(updatedInventory);
  }, []);

  const totalPrice = selectedItems.reduce((acc, item) => acc + item.price * (item.orderQuantity || 0), 0);

  const handleConfirmOrder = async () => {
    const orderPromises = selectedItems.map(item => {
      if (item.orderQuantity && item.orderQuantity > 0) {
        return updateItemStock(item.id, item.orderQuantity);
      }
      return Promise.resolve();
    });
    try {

      await Promise.all(orderPromises);
       localStorage.setItem('inventory', JSON.stringify([]));
       setSelectedItems([]);
     //  setSelectedItems(selectedItems.map(item => ({ ...item, orderQuantity: 0 })));
       
       
     } catch (error) {
       console.error("Failed to process bulk order:", error);
       alert('Failed to process some orders.');
     }
    // Implementation for confirming the order
  };

  const handleRemoveItem = (index: number) => {
    // Implementation for removing an item from the order
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
                <div>
                  {item.item_name} - ${item.price} x {item.orderQuantity}
                  <button onClick={() => handleRemoveItem(index)} className={styles.removeButton}>
                    Remove
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div>No items in the order.</div>
          )}
        </div>
        <div className={styles.total}>
          Total: <span>${totalPrice.toFixed(2)}</span>
        </div>
        <div className={styles.buttonsContainer}>
          <button className={styles.goBackButton} onClick={() => router.back()}>
            Go Back
          </button>
          <button onClick={handleConfirmOrder} className={styles.confirmOrderButton}>
            Confirm Order
          </button>
        </div>
      </div>
    </>
  );
};

export default InventoryOrderSummary;
