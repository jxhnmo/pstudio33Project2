import React, { useState } from 'react';
import styles from './CustomizePopup.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

const CustomizePopup = ({ selectedItem, selectedItemIngredients, onClose, onConfirmCustomization  }) => {

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
    // get array of customizations, call parent function (from order/page.tsx), and close window
    const selectedIngredientsArray = Array.from(selectedIngredients);
    onConfirmCustomization(selectedIngredientsArray.join(', '));
    onClose();
  };

  return (
    <div className={styles.popupBackdrop}>
      <div className={styles.popup}>
        <h2>Customize {selectedItem.name}</h2>
        <div className={styles.ingredientsList}>
            {ingredients.map((ingredient, index) => (
                <React.Fragment key={index}>
                    <button
                        key={index}
                        className={`${styles.ingredientButton} ${selectedIngredients.has(ingredient) ? styles.selected : ''}`}
                        onClick={() => toggleIngredient(ingredient)}
                    >
                        {selectedIngredients.has(ingredient) ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faTimes} />}
                        <br />
                        {ingredient}
                    </button>
                    {(index + 1) % 3 === 0 && <br />} 
                </React.Fragment>
            ))}
        </div>
        <div className={styles.buttonGroup}>
            <button onClick={onClose} className={styles.cancelButton}>Cancel</button>
            <button onClick={handleConfirmCustomization} className={styles.confirmButton}>Confirm</button>   
        </div>
      </div>
    </div>
  );
};

export default CustomizePopup;
