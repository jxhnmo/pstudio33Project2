import React from 'react';
import { fetchItems } from '../../app/order';
import { useState, useEffect } from 'react';
import styles from '../CustomizePopup/CustomizePopup.module.css';

function MealUpgradePopup({ isOpen, onClose, onConfirmMeal }) {
    const [sides, setSides] = useState([]);
    const [drinks, setDrinks] = useState([]);

    useEffect(() => {
        if (isOpen) {
            fetchItems('sides').then(setSides);
            fetchItems('drinks').then(setDrinks);
        }
    }, [isOpen]);

    const handleItemSelection = (item) => {
        onConfirmMeal([item]); // Directly confirm selection
        onClose(); // Close popup after selection
    };

    const handleBothSelection = () => {
        const fries = sides.find(side => side.name === "French Fries");
        const largeDrink = drinks.find(drink => drink.name === "Large Drink");
        if (fries && largeDrink) {
            onConfirmMeal([fries, largeDrink]);
            onClose(); // Close popup after selection
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.popupBackdrop}>
            <div className={styles.popup}>
                <h2>Make it a Meal?</h2>
                <div>
                    <h3>Sides</h3>
                    {sides.map(side => (
                        <button
                            className={styles.popupButton}
                            key={side.id}
                            onClick={() => handleItemSelection(side)}>
                            Add {side.name} (${side.price})
                        </button>
                    ))}
                </div>
                <div>
                    <h3>Drinks</h3>
                    {drinks.map(drink => (
                        <button
                            className={styles.popupButton}
                            key={drink.id}
                            onClick={() => handleItemSelection(drink)}>
                            Add {drink.name} (${drink.price})
                        </button>
                    ))}
                </div>
                <div className={styles.buttonGroup}>
                    <button className={styles.confirmButton} onClick={handleBothSelection}>Add Both</button>
                    <button className={styles.cancelButton} onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default MealUpgradePopup;
