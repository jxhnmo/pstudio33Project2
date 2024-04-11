"use client";
import Link from 'next/link';
import Image from "next/image";
import { useRouter } from 'next/navigation';

import styles from "@/app/order/order.module.css";
import { MouseEvent, SetStateAction, useEffect, useState } from 'react';

import { fetchCategories, fetchItems, getItemInfo, getMenuItemIngredients} from '../order';
import dynamic from 'next/dynamic';
import InfoPopup from '../../components/InfoPopup/InfoPopup'; // Adjust the path as necessary\
const Sidebar = dynamic(() => import('../../components/sidebar/Sidebar'), {
  ssr: false,
});

interface Item {
  id: number;
  name: string;
  price: number;
  quantity: number;
  ingredients?: string[];
  calories?: number;
}
interface ingredient {
  item_name: string;
}

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
  const [isCategoryLoaded, setIsCategoryLoaded] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedItemInfo, setSelectedItemInfo] = useState<Item | null>(null);
  const [selectedItemIngredients, setSelectedItemIngredients] = useState<string[]>([]);



  localStorage.setItem('role', 'customer');

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
       setIsCategoryLoaded(true); // Set to true once items are loaded

      setTimeout(() => {
        setCurrentCategoryItems(items);
        setActiveCategory(categoryName);
      }, 1);

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
      router.push('/orderSummary'); // Adjust the path to your order summary page
    }
    //completeTransaction(totalPrice.toFixed(2), selectedItems);

    //setSelectedItems([]);
  };


    const handleReturnHome = () => {
      router.push('/');
    }

        const handleOpenPopup = async (event: MouseEvent<HTMLDivElement, MouseEvent>, item: Item) => {
          event.stopPropagation(); 
          const menuItemIngredients = await getMenuItemIngredients(item.id);
          const ingredients = (menuItemIngredients || []).map((ingredient) => ingredient.item_name);

          setSelectedItemInfo(item);
          setSelectedItemIngredients(ingredients); // Fix: Update the type of the state setter to accept a Set<string>
          setIsPopupOpen(true);
      };
        
        const handleClosePopup = () => {
          setIsPopupOpen(false);
        };

  return (
    <>
      <Sidebar />
      <InfoPopup isOpen={isPopupOpen} itemInfo = {selectedItemInfo} itemIngredients={selectedItemIngredients} onClose={handleClosePopup} />

      <div className={`${styles.main} ${isCategoryLoaded ? styles.categoryLoaded : ''}`}>
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
        <button key={index} className={styles.menuItemContainer} onClick={() => handleSelectItem(item)}>
            <Image src={`/images/${item.name.replace(/\s/g, '')}.png`} alt={item.name} width={100} height={100} />
            <div>{item.name}<br />{'$' + item.price}</div>
            <div className={`${styles.infoIcon}`} onClick={(e) => handleOpenPopup(e, item)} >
                <Image src={'/images/infoButton.png'} alt="Info" width={30} height={30} />
            </div>
        </button>
    ))}
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

            
            <button onClick={handleConfirmOrder} className={styles.confirmOrderButton} disabled = {selectedItems.length === 0}>
              Confirm Order
            </button>

          </div>
        </div>
      </div>
    </>
  );
}