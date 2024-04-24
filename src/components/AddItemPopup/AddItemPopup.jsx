import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faUpload } from '@fortawesome/free-solid-svg-icons';
import styles from './AddItemPopup.module.css';
import {addItem} from '../../app/inventory';
import {addMenuItem} from '../../app/menuItem'
import { fetchInventory } from '../../app/inventory'; // Import fetchInventory function


/* TODO 
remove stock and max_stock
add calories and description instead
*/

const AddMenuItem = ({ isOpen, onClose, onAddNewItem, categoryName }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [calories, setCalories] = useState('');
    const [image, setImage] = useState(null);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [inventoryItems, setInventoryItems] = useState([]);
    const [menuItems, setMenuItems] = useState(null);

        useEffect(() => {
            const loadInventoryItems = async () => {
                try {
                    console.log("LLLLL");
                    const items = await fetchInventory();    
                    setInventoryItems(items);
                } catch (error) {
                    console.error('Failed to fetch inventory items', error);
            }
        };

        loadInventoryItems();
    }, []);

    useEffect(() => {
        console.log("EEE", menuItems);
        const addNewMenuItem = async () => {
            try {
                const newItem = {
                    item_name: name,
                    price: parseFloat(price),
                    calories: parseInt(calories),
                    description: description,
                    image: image,
                    ingredients: selectedIngredients,
                    category: categoryName,
                };
                console.log("JJJ", newItem);
                //const addedItem = await addMenuItem(newItem);
                onAddNewItem(newItem);
                console.log('Item added to order page:', newItem);
                setMenuItems(onClose); // Close the popup after adding the item
            } catch (error) {
                console.error('Error adding item to order page:', error);
                throw error;
            }
        };

        if (menuItems !== null/* && name && price && description && image && calories*/) {
            console.log("RRR");
            addNewMenuItem();
        }
        setMenuItems(null);
    }, [calories, categoryName, description, image, menuItems, name, price, selectedIngredients]);


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

    /*const handleAddItem = async (oc) => {
        console.log('Adding item...');
        try {
            const newItem = {
                item_name: name,
                price: parseFloat(price),
                calories: parseInt(calories),
                description: description,
                image: image, // File object
                ingredients: selectedIngredients, // Array of selected ingredient ids
                category: categoryName,
            };
            const aip = addMenuItem(newItem);
            console.log('Before calling addItem', newItem, aip);
            const addedItem = await aip;
            console.log('After calling addItem');
            
            //setMenuItems([...menuItems, addedItem]);

            oc();
            console.log('Item added to order page:', addedItem);
            
        } catch (error) {
            console.error('Error adding item to order page:', error);
            throw error;
        }
    };*/

    return (
        <div className={styles.popupBackdrop}>
            <div className={styles.popup}>
                <h2>Add New Menu Item</h2>
                <label>Name:</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />

                <label>Price:</label>
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />

                <label>Description:</label>
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />

                <label>Calories</label>
                <input type = "number" value = {calories} onChange={(e) => setCalories(e.target.value)}></input>

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
                        onClick={() => setMenuItems()}
                        className={styles.confirmButton}
                        // disabled={!name || !price || !description || !image || !calories}
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