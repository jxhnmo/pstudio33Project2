import React from 'react';
import styles from './InfoPopup.module.css';

const InfoPopup = ({ isOpen, itemIngredients, itemInfo, onClose }) => {
  if (!isOpen) return null;

  const renderIngredientsList = (ingredients) => {
    // Check if ingredients exist and are not empty
    if (!ingredients || ingredients.length === 0) {
      return <p>No ingredients listed.</p>;
    }
    
    // Join the ingredients array into a comma-separated string
    const ingredientsList = ingredients.join(', ');
    ingredients = ingredients.filter(ingredient => !["napkin", "tray", "straw", "shake cup", "large cup","small cup"
    , "cup lid", "salad bowl"].includes(ingredient));
    return (
      <p>{ingredientsList}</p> // Displaying the ingredients in a paragraph
    );
  };

  return (
    <div className={styles.popupBackground}>
      <div className={styles.popupContent}>
        <h2 className={styles.title}>{itemInfo?.name}</h2>
        <p className={styles.description}>{itemInfo?.description}</p>
        <div className={styles.ingredientsContainer}>
          <h3 className={styles.subtitle}>Ingredients</h3>
          {/* Displaying ingredients as a comma-separated list */}
          {renderIngredientsList(itemIngredients)}
          {/* Optionally, display calories here or within the list */}
          <p className={styles.calories}>Calories: {itemInfo?.calories}</p>
        </div>
        <button className={styles.closeButton} onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default InfoPopup;