import React, { useState } from 'react';
import styles from './CustomizePopup.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

const CustomizePopup = ({ selectedItem, selectedItemIngredients, onClose, onConfirmCustomization }) => {
    const ingredients = selectedItemIngredients || [];
    if (!ingredients || ingredients.length === 0) {
      onClose();
      return null;
    }
    const [selectedIngredients, setSelectedIngredients] = useState(new Set(selectedItem.ingredients || []));
  
    const toggleIngredient = (ingredient) => {
        const newSelectedIngredients = new Set(selectedIngredients);
        if (newSelectedIngredients.has(ingredient)) {
          newSelectedIngredients.delete(ingredient);
          console.log('Removed ingredient:', ingredient);
        } else {
          newSelectedIngredients.add(ingredient);
          console.log('Added ingredient:', ingredient);
        }
        setSelectedIngredients(newSelectedIngredients);
        console.log('Selected ingredients:', newSelectedIngredients);
      };
      
  
      const handleConfirmCustomization = () => {
        // Get array of selected and deselected ingredients
        const selectedIngredientsArray = Array.from(selectedIngredients);
        console.log("Selected Ingredients Array:", selectedIngredientsArray);
      
        const deselectedIngredients = selectedItem.ingredients?.filter(ingredient => !selectedIngredients.has(ingredient)) || [];
        console.log("Selected Item Ingredients:", selectedItem.ingredients);
        console.log("Deselected Ingredients:", deselectedIngredients);
      
        // Call the parent function with selected and deselected ingredients
        onConfirmCustomization(selectedIngredientsArray.join(', '), deselectedIngredients, selectedItem);
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
