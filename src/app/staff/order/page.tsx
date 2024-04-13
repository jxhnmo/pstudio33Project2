"use client";
import Link from 'next/link';
import Image from "next/image";
import { useRouter } from 'next/navigation';

import styles from "@/app/staff/order/staffOrder.module.css";
import React, { useEffect, useState } from 'react';

import { fetchCategories, fetchItems, completeTransaction, getItemInfo, getMenuItemIngredients } from '../../order';
import { fetchInventory, addItem, updateItemStock } from '../../inventory';
import { addIngredient } from '../../ingredients';

import InfoPopup from '../../../components/InfoPopup/InfoPopup';
import CustomizePopup from '../../../components/CustomizePopup/CustomizePopup';

import dynamic from 'next/dynamic';

const Sidebar = dynamic(() => import('../../../components/sidebar/Sidebar'), {
  ssr: false,
});

interface Item {
  id: number;
  name: string;
  price: number;
  quantity: number;
  ingredients: string[];
  customization?: string;
  calories?: number;
  imageUrl?: string;
}

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: { name: string; price: number }, selectedIngredients: string[]) => void;
};


const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [newItem, setNewItem] = useState({ name: '', price: 0, ingredients: [], imageUrl: ''});
  const [inventoryItems, setInventoryItems] = useState<Item[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    const loadInventory = async () => {
      const items = await fetchInventory();
      setInventoryItems(items);
    };
    loadInventory();
  }, []);

  const handleIngredientChange = (ingredientId: number, checked: boolean) => {
    if (checked) {
      setSelectedIngredients([...selectedIngredients, ingredientId.toString()]);
    } else {
      setSelectedIngredients(selectedIngredients.filter(id => id !== ingredientId.toString()));
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setImageFile(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(newItem, selectedIngredients);
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
            <div>
              <label>Ingredients:</label>
              {inventoryItems.map((item) => (
                <div key={item.id}>
                  <input
                    type="checkbox"
                    id={`ingredient-${item.id}`}
                    name={`ingredient-${item.id}`}
                    onChange={(e) => handleIngredientChange(item.id, e.target.checked)}
                  />
                  <label htmlFor={`ingredient-${item.id}`} className={styles.checkboxLabel}>{item.name}</label>
                </div>
              ))}
            </div>
          <div>
            <label>Image:</label>
            <input type="file" onChange={handleImageChange} />
          </div>
            <button type="submit">Add Item</button>
          </form>
        </div>
      </div>
    )
  );
};


export default function Home() {
  const router = useRouter();

  const [isManager, setIsManager] = useState(false);

  // const [categories, setCategories] = useState([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [currentCategoryItems, setCurrentCategoryItems] = useState<Item[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  //make it so if there are items in    JSON.parse(localStorage.getItem('selectedItems') || '[]');, they go into selectedItems
  const storedItems = JSON.parse(localStorage.getItem('selectedItems') || '[]');
  const [selectedItems, setSelectedItems] = useState<Item[]>(storedItems);
  //const [newItem, setNewItem] = useState({ id: -1, name: '', price: 0, quantity: 1 });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [totalPriceInfo, setTotalPriceInfo] = useState({ total: 0, updateKey: Date.now() });
  const [isCategoryLoaded, setIsCategoryLoaded] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedItemInfo, setSelectedItemInfo] = useState<Item | null>(null);
  const [selectedItemIngredients, setSelectedItemIngredients] = useState<string[]>([]);
  // CustomizePopup window states and functions:
  const [isCustomizePopupOpen, setIsCustomizePopupOpen] = useState(false);
  const [selectedItemForCustomization, setSelectedItemForCustomization] = useState<Item | null>(null);

  localStorage.setItem('role', 'staff');

  useEffect(() => {
    function getCookie(name:any) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      return parts.length === 2 ? parts.pop()?.split(';').shift() ?? '' : '';
    }

    // Use the getCookie function inside the useEffect hook
    const managerStatus = getCookie('isManager');
    setIsManager(managerStatus === 'true'); // Assuming 'true' is stored as a string in the cookie
  }, []);

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

  const handleCloseCustomizePopup = () => {
    setIsCustomizePopupOpen(false);
  };

  const handleCustomizationConfirmation = (customization: string, deselectedIngredients: string[] = [], item: Item) => {
    if (!item) {
      // Handle the case where item is undefined
      return;
    }
  
    // Create the customized item object
    let customizedItem: Item;
    if (deselectedIngredients && deselectedIngredients.length > 0) {
      const formattedDeselectedIngredients = deselectedIngredients.map(ingredient => `NO ${ingredient}`).join(', ');
      customizedItem = {
        ...item,
        customization: formattedDeselectedIngredients
      };
    } else {
      customizedItem = {
        ...item,
        customization: undefined
      };
    }
  
    const existingItemIndex = selectedItems.findIndex(selectedItem => selectedItem.id === item.id && selectedItem.customization === customizedItem.customization);
  
    if (existingItemIndex !== -1) {
      // Update the quantity of the existing item
      const updatedItems = [...selectedItems];
      // Ensure quantity property exists and is a number
      updatedItems[existingItemIndex].quantity = (updatedItems[existingItemIndex].quantity || 1) + 1;
      setSelectedItems(updatedItems);
    } else {
      // Add the new customized item to the selected items list
      setSelectedItems(prevItems => [...prevItems, { ...customizedItem, quantity: 1 }]);
    }
  
    setIsCustomizePopupOpen(false);
  };

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

  const handleSelectItem = async (item: Item) => {
    const menuItemIngredients = await getMenuItemIngredients(item.id);
    const ingredients = (menuItemIngredients || []).map((ingredient) => ingredient.item_name);
    console.log("Selected Item:", item); // Log the selected item
    const updatedSelectedItem = { ...item, ingredients: ingredients };
    setSelectedItemForCustomization(updatedSelectedItem);
    setSelectedItemIngredients(ingredients);
    setIsCustomizePopupOpen(true);
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

  const handleOpenPopup = async (event: MouseEvent, item: Item) => {
    event.stopPropagation(); 
    const menuItemIngredients = await getMenuItemIngredients(item.id);
    const ingredients = (menuItemIngredients || []).map((ingredient) => ingredient.item_name);
  
    setSelectedItemInfo(item);
    setSelectedItemIngredients(ingredients);
    setIsPopupOpen(true);
  };
    
  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const generateDeselectedIngredientsList = (item: Item): string => {
    if (!item.customization) {
      return ''; // Return empty string if no customization exists
    }
    
    const deselectedIngredients = item.customization
      .split(', ')
      .filter(customization => customization.startsWith('NO'))
      .map(customization => customization.substring(3))
      .map(ingredient => `  NO ${ingredient}`)
      .join(',\n');
    return deselectedIngredients;
  };


  const handleAddNewItem = async (newItem: any, selectedIngredients: string[]) => {
    const newItemWithId = { ...newItem, id: Date.now(), quantity: 1 };
    setCurrentCategoryItems([...currentCategoryItems, newItemWithId]);

    try {
      const addedItem = await addItem({
        name: newItem.name,
        price: newItem.price,
        // Handle image upload separately if needed
      });
  
      // Add each selected ingredient to the ingredients table
      for (const ingredientId of selectedIngredients) {
        await addIngredient({
          item_id: parseInt(ingredientId),
          menu_id: addedItem.id,
          num: 1, // Default quantity, adjust as needed
        });
      }
  
      console.log('Item and ingredients added to inventory');
    } catch (error) {
      console.error('Error adding item and ingredients to inventory:', error);
    }
  };

  return (
    <>
      <Sidebar />
      <InfoPopup isOpen={isPopupOpen} itemInfo = {selectedItemInfo} itemIngredients={selectedItemIngredients} onClose={handleClosePopup} />

      {isCustomizePopupOpen && selectedItemForCustomization && (
        <CustomizePopup 
          selectedItem={selectedItemForCustomization} 
          selectedItemIngredients={selectedItemIngredients} 
          onClose={handleCloseCustomizePopup} 
          onConfirmCustomization={handleCustomizationConfirmation}
        />
      )}

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
            <button key={index} className={styles.menuItemContainer} onClick={() => handleSelectItem(item)}>
                <Image src={`/images/${item.name.replace(/\s/g, '')}.png`} alt={item.name} width={100} height={100} />
                <div>{item.name}<br />{'$' + item.price}</div>
                {/*<div className={`${styles.infoIcon}`} onClick={(e) => handleOpenPopup(e, item)} >
                    <Image src={'/images/infoButton.png'} alt="Info" width={30} height={30} />
          </div>*/}
            </button>
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
                <div className={styles.deselectedIngredients}>
                  {generateDeselectedIngredientsList(item)}
                </div>
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

        {/* Navigation Buttons */}
        <div className={styles.buttonsContainer}>
          {isManager ? (
            <>
              <Link href="/staff/order" passHref><div className={styles.navButton}>Staff Order</div></Link>
              <Link href="/staff/stats" passHref><div className={styles.navButton}>Staff Stats</div></Link>
              <Link href="/staff/inventory" passHref><div className={styles.navButton}>Staff Inventory</div></Link>
            </>
          ) : (
            <>
              <div className={`${styles.navButton} ${styles.disabled}`}>Staff Order</div>
              <div className={`${styles.navButton} ${styles.disabled}`}>Staff Stats</div>
              <div className={`${styles.navButton} ${styles.disabled}`}>Staff Inventory</div>
            </>
          )}
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
