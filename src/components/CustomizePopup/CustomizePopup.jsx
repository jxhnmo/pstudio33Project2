import React, { useState, useEffect } from 'react';
import styles from './CustomizePopup.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faLock } from '@fortawesome/free-solid-svg-icons';
import { getIrremovableIngredients } from '../../app/order'; // Ensure you're importing from the correct location

const CustomizePopup = ({ selectedItem, selectedItemIngredients, onClose, onConfirmCustomization }) => {
    const [selectedIngredients, setSelectedIngredients] = useState(new Set(selectedItem.ingredients || []));
    const [irremovableIngredients, setIrremovableIngredients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true; // T if component is still mounted
        const fetchIrremovable = async () => {
            const data = await getIrremovableIngredients();
            if (active) {
                setIrremovableIngredients(data.map(ing => ing.name));
                setLoading(false);

                const hasRemovable = selectedItemIngredients.some(ingredient => !data.map(ing => ing.name).includes(ingredient));
                if (!hasRemovable) {
                    handleConfirmCustomization();
                }
            }
        };
        fetchIrremovable();

        return () => {
            active = false;
        };
    }, [selectedItemIngredients]);

    const toggleIngredient = (ingredient) => {
        if (irremovableIngredients.includes(ingredient)) return;

        const newSelectedIngredients = new Set(selectedIngredients);
        if (newSelectedIngredients.has(ingredient)) {
            newSelectedIngredients.delete(ingredient);
        } else {
            newSelectedIngredients.add(ingredient);
        }
        setSelectedIngredients(newSelectedIngredients);
    };
    
    const handleConfirmCustomization = () => {
        const selectedIngredientsArray = Array.from(selectedIngredients);
        const deselectedIngredients = selectedItem.ingredients?.filter(ingredient => !selectedIngredients.has(ingredient)) || [];
        onConfirmCustomization(selectedIngredientsArray.join(', '), deselectedIngredients, selectedItem);
        onClose();
    };

    const hasValidSelections = () => {
        return Array.from(selectedIngredients).some(ingredient => 
            !irremovableIngredients.includes(ingredient)
        );
    };

    if (loading) {
        return (
            <div className={styles.popupBackdrop}>
                <div className={styles.popup}>
                    <h2 className>Loading...</h2>
                </div>
        </div>
        );
    }

    return (
        <div className={styles.popupBackdrop}>
            <div className={styles.popup}>
                <h2>Customize {selectedItem.name}</h2>
                <div className={styles.ingredientsList}>
                    {selectedItemIngredients.map((ingredient, index) => (
                        <React.Fragment key={index}>
                            {irremovableIngredients.includes(ingredient) ? (
                                <button key={index} className={styles.irremovableButton}>
                                    <FontAwesomeIcon icon={faLock} />
                                    <br />
                                    {ingredient}
                                </button>
                            ) : (
                                <button
                                    className={`${styles.ingredientButton} ${selectedIngredients.has(ingredient) ? styles.selected : ''}`}
                                    onClick={() => toggleIngredient(ingredient)}
                                >
                                    {selectedIngredients.has(ingredient) ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faTimes} />}
                                    <br />
                                    {ingredient}
                                </button>
                            )}
                            {(index + 1) % 3 === 0 && <br />}
                        </React.Fragment>
                    ))}
                </div>
                <div className={styles.buttonGroup}>
                    <button onClick={onClose} className={styles.cancelButton}>Cancel</button>
                    <button onClick={handleConfirmCustomization} className={styles.confirmButton} disabled={!hasValidSelections()}>Confirm</button>
                </div>
            </div>
        </div>
    );
};

export default CustomizePopup;
