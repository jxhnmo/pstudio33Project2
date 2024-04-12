import React, { useState } from 'react';
import styles from './CustomizePopup.module.css';

const CustomizePopup = ({ selectedItem, selectedItemIngredients, onClose }) => {

  const ingredients = selectedItemIngredients || [];
  if (!ingredients || ingredients == []) {
    onClose();
  }
  const [selectedIngredients, setSelectedIngredients] = useState(new Set(ingredients));

  const toggleIngredient = (ingredient) => {
    const newSelectedIngredients = new Set(selectedIngredients);
    if (newSelectedIngredients.has(ingredient)) {
      newSelectedIngredients.delete(ingredient);
    } else {
      newSelectedIngredients.add(ingredient);
    }
    setSelectedIngredients(newSelectedIngredients);
  };

  const handleConfirmCustomization = () => {
    console.log('Selected Ingredients:', Array.from(selectedIngredients));
    onClose();
  };

  return (
    <div className={styles.popupBackdrop}>
      <div className={styles.popup}>
        <h2>Customize {selectedItem.name}</h2>
        <div className={styles.ingredientsList}>
          {ingredients.map((ingredient, index) => (
            <button
              key={index}
              className={`${styles.ingredientButton} ${selectedIngredients.has(ingredient) ? styles.selected : ''}`}
              onClick={() => toggleIngredient(ingredient)}
            >
              {ingredient}
            </button>
          ))}
        </div>
        <div className={styles.buttonGroup}>
          <button onClick={handleConfirmCustomization}>Confirm</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default CustomizePopup;
