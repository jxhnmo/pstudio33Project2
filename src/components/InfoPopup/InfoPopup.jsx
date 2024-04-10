import React from 'react';
import styles from './InfoPopup.module.css';

const InfoPopup = ({ isOpen, itemIngredients, itemInfo, onClose }) => {
  if (!isOpen) return null;

  // Function to render ingredients list
  const renderIngredientsList = (ingredients) => {
    // Check if ingredients exist and is not empty
    if (!ingredients || ingredients.length === 0) {
      return <p>No ingredients listed.</p>;
    }
    
    return (
      <ul>
        {ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>
    );
  };

  return (
    <div className={styles.popupBackground}>
      <div className={styles.popupContent}>
        <h2>{itemInfo?.name}</h2>
        {/* Render ingredients as a list */}
        <div>
          <h3>Ingredients</h3>
          {renderIngredientsList(itemIngredients)}
        </div>
        <p>{itemInfo?.description}</p>
        <button className={styles.closeButton} onClick={onClose} style={{ color: 'black' }}>Close</button>
      </div>
    </div>
  );
};

export default InfoPopup;