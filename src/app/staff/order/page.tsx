"use client";
import Link from 'next/link';
import Image from "next/image";
import { useRouter } from 'next/navigation';

import styles from "@/app/staff/order/staffOrder.module.css";
import { useEffect, useState } from 'react';

import { fetchCategories, fetchItems, completeTransaction } from '../../order';
import dynamic from 'next/dynamic';

const Sidebar = dynamic(() => import('../../../components/sidebar/Sidebar'), {
  ssr: false,
});

interface Item {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const Modal = ({ isOpen, onClose, onAdd }) => {
  const [newItem, setNewItem] = useState({ name: '', price: 0 });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(newItem);
    onClose();
  };

  return (
    isOpen && (
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <span className={styles.close} onClick={onClose}>
            &times;
          </span>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Item Name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            />
            <input
              type="number"
              placeholder="Price"
              value={newItem.price}
              onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) || 0 })}
            />
            <button type="submit">Add Item</button>
          </form>
        </div>
      </div>
    )
  );
};


export default function Home() {
  const router = useRouter();

  // const [categories, setCategories] = useState([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [currentCategoryItems, setCurrentCategoryItems] = useState<Item[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  //make it so if there are items in    JSON.parse(localStorage.getItem('selectedItems') || '[]');, they go into selectedItems
  const storedItems = JSON.parse(localStorage.getItem('selectedItems') || '[]');
  const [selectedItems, setSelectedItems] = useState<Item[]>(storedItems);
  const [totalPriceInfo, setTotalPriceInfo] = useState({ total: 0, updateKey: Date.now() });
  //const [newItem, setNewItem] = useState({ id: -1, name: '', price: 0, quantity: 1 });
  const [isModalOpen, setIsModalOpen] = useState(false);


  useEffect(() => {
    const total = selectedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotalPriceInfo({ total, updateKey: Date.now() });
  }, [selectedItems]); // Recalculate whenever selectedItems changes


  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoryObjects = await fetchCategories();
        console.log(categoryObjects);
        const categoryNames = categoryObjects.map(obj => obj.category);
        setCategories(categoryNames);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };

    loadCategories();
  }, []);

  // Function to load items for a selected category
  const loadItemsForCategory = async (categoryName: string) => {
    try {
      const items = await fetchItems(categoryName);
      console.log(items);
      // Temporarily clear items to signal a significant change
      setCurrentCategoryItems([]);
      // Introduce a slight delay before showing new items
      setTimeout(() => setCurrentCategoryItems(items), 100);
      setActiveCategory(categoryName);
    } catch (error) {
      console.error(`Failed to fetch items for category ${categoryName}:`, error);
      setCurrentCategoryItems([]); // Reset on error
    }
  };

  const handleSelectItem = (item: Item) => {
    const existingItem = selectedItems.find(selectedItem => selectedItem.id === item.id);

    if (existingItem) {
      // Update the quantity of the existing item
      const updatedItems = selectedItems.map(selectedItem =>
        selectedItem.id === item.id ? { ...selectedItem, quantity: selectedItem.quantity + 1 } : selectedItem
      );
      setSelectedItems(updatedItems);
    } else {
      // Add the new item with a quantity of 1
      setSelectedItems([...selectedItems, { ...item, quantity: 1 }]);
    }
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = [...selectedItems];
    updatedItems.splice(index, 1);
    setSelectedItems(updatedItems);
    localStorage.setItem('selectedItems', JSON.stringify(updatedItems)); 
  };

  const handleConfirmOrder = () => {
    if(selectedItems.length !== 0){
      const currentTime = new Date();
      // Store selected items in local storage
      console.log("printing selected items");
      console.log(selectedItems);
      localStorage.setItem('selectedItems', JSON.stringify(selectedItems));

      //router.push('/staff'); // Adjust the path to your order summary page
    }
    completeTransaction(totalPriceInfo.total.toFixed(2), selectedItems);
    setSelectedItems([]);
    localStorage.setItem('selectedItems', JSON.stringify([]));

  };

  const handleReturnHome = () => {
    router.push('/');
  }

  const handleAddNewItem = (newItem) => {
    const newItemWithId = { ...newItem, id: Date.now(), quantity: 1 };
    setCurrentCategoryItems([...currentCategoryItems, newItemWithId]);
  };

  return (
    <>
      <Sidebar />
      <div className={styles.main}>
        {/* Categories Column */}
        <div className={styles.categories}>
          <h2 className={styles.categoriesHeader} onClick={handleReturnHome}>Categories</h2>
          <div className={styles.categoriesList}>
            {categories.map((categoryName, index) => (
              <button
                key={index}
                className={`${styles.categoryButton} ${activeCategory === categoryName ? styles.activeCategory : ''}`}
                onClick={() => loadItemsForCategory(categoryName)}
              >
                {categoryName}
              </button>
            ))}
          </div>
        </div>
        {/* Order Menu */}
        <div className={styles.orderMenu}>
          {currentCategoryItems.map((item, index) => (
            <button key={index} onClick={() => handleSelectItem(item)}>
              {<Image src={`/images/${item.name.replace(/\s/g, '')}.png`} alt={item.name} width={100} height={100} />}
              {item.name}
              <br />
              {'$' + item.price}
            </button> // Adjust to match your item object structure
          ))}

          <button className={styles.addItemButton} onClick={() => setIsModalOpen(true)}>
            Add New Item
          </button>
        </div>

        
        {/* Current Order Column */}
        <div className={styles.currentOrder}>
          <div className={styles.currOrderTop}>
            <h2 className={styles.currentOrderTitle}>Current Order</h2>
            <div className={styles.orderList}>
            {selectedItems.map((item, index) => (
              <div key={`${item.id}-${new Date().getTime()}-${index}`}>
                {item.name} - ${item.price} x {item.quantity}
                <br />
                <button onClick={() => handleRemoveItem(index)} className={styles.removeButton}>
                    Remove
                </button>
              </div>
            ))}
          </div>
          </div>
          <div className={styles.currOrderBtm}>
          
          <div key={totalPriceInfo.updateKey} className={styles.total}>
                Total: <span>${totalPriceInfo.total.toFixed(2)}</span>
          </div>
            {/* <Link href="/orderSummary" className={styles.confirmOrderButton}>
              Confirm Order
            </Link> */}
            <button onClick={handleConfirmOrder} className={styles.confirmOrderButton}>
              Confirm Order
            </button>

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

      <Modal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onAdd={handleAddNewItem}
    />
    </>

  );
}
