import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faUpload } from '@fortawesome/free-solid-svg-icons';
import styles from './AddItemPopup.module.css';
import {addItem} from '../../app/inventory';
import {addIngredient } from '../../app/ingredients'
import { fetchInventory } from '../../app/inventory'; // Import fetchInventory function


const AddMenuItem = ({ isOpen, onClose, onAddNewItem, categoryName }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState(null);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);

  useEffect(() => {
      const loadInventoryItems = async () => {
          try {
              const items = await fetchInventory();
              setInventoryItems(items);
          } catch (error) {
              console.error('Failed to fetch inventory items', error);
          }
      };

      loadInventoryItems();
  }, []);

  const handleIngredientChange = (ingredientId) => {
      setSelectedIngredients((prevIngredients) => {
          if (prevIngredients.includes(ingredientId)) {
              return prevIngredients.filter((id) => id !== ingredientId);
          } else {
              return [...prevIngredients, ingredientId];
          }
      });
  };

  const handleImageChange = (e) => {
      const file = e.target.files[0];
      setImage(file);
  };

  const handleAddItem = async () => {
    console.log('Adding item...');
      try {
          const newItem = {
              name: name,
              price: parseFloat(price),
              stock: parseInt(stock),
              image: image, // File object
              ingredients: selectedIngredients, // Array of selected ingredient ids
          };

          const addedItem = await addItem(newItem);

          // Add ingredients if needed
          for (const ingredientId of selectedIngredients) {
              await addIngredient({
                  item_id: ingredientId,
                  menu_id: addedItem.id,
                  num: 1, // Default quantity, adjust as needed
              });
          }
          onAddNewItem(addedItem, categoryName);
          onClose();
          console.log('Item added to inventory:', addedItem);
          
      } catch (error) {
          console.error('Error adding item to inventory:', error);
      }
  };

  return (
    <div className={styles.popupBackdrop}>
        <div className={styles.popup}>
            <h2>Add New Menu Item</h2>
            <label>Name:</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            <label>Price:</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
            <label>Stock:</label>
            <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} />
            <label>Image:</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {image && <img src={URL.createObjectURL(image)} alt="Selected Item" />}
            <label>Ingredients:</label>
            <div className={styles.ingredientsGrid}>
                {inventoryItems.map((item) => (
                    <label key={item.id}>
                        <input
                            type="checkbox"
                            checked={selectedIngredients.includes(item.id)}
                            onChange={() => handleIngredientChange(item.id)}
                        />
                        {item.item_name}
                    </label>
                ))}
            </div>
            <div className={styles.buttonGroup}>
                <button
                    onClick={handleAddItem}
                    className={styles.confirmButton}
                    disabled={!name || !price || !stock || !image}
                >
                    Add Item
                </button>
                <button onClick={onClose} className={styles.cancelButton}>
                    Cancel
                </button>
            </div>
        </div>
    </div>
);
};

export default AddMenuItem;