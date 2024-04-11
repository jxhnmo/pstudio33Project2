// CustomizePopup.jsx

import React, { useState } from 'react';
import styles from './CustomizePopup.module.css'; // Import CSS module for styling

const CustomizePopup = ({ selectedItem, onClose }) => {
  const [customization, setCustomization] = useState('');

  const handleCustomizationChange = (e) => {
    setCustomization(e.target.value);
  };

  const handleConfirmCustomization = () => {
    console.log('Customization confirmed:', customization);
    onClose();
  };

  return (
    <div className={styles.popupBackdrop}>
      <div className={styles.popup}>
        <h2>Customize {selectedItem.name}</h2>
        <textarea
          placeholder="Add customization..."
          value={customization}
          onChange={handleCustomizationChange}
        ></textarea>
        <div className={styles.buttonGroup}>
          <button onClick={handleConfirmCustomization}>Confirm</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default CustomizePopup;
