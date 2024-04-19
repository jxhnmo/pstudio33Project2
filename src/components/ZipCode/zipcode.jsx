import React, { useState, useEffect } from 'react';
import styles from './ZipCode.module.css';

const ZipCode = ({ onZipCodeChange }) => {

    const [zipCode, setZipCode] = useState('');
  useEffect(() => {
    const storedZipCode = typeof window !== 'undefined' ? localStorage.getItem('zipCode') || '' : '';
    if (storedZipCode) {
      setZipCode(storedZipCode);
    }
  }, []);

  
  const handleZipCodeChange = (e) => {

    const newZip = e.target.value.replace(/[^0-9]/g, '');

    setZipCode(newZip); // Set zip code with every change
    onZipCodeChange(newZip);  // Notify parent component about the change

    if (/^\d{5}$/.test(newZip)) { // Checks if the input is exactly five digits
        if (typeof window !== 'undefined') {
            window.localStorage.setItem('zipCode', newZip);
            window.location.reload();
          }
    }

  };

  return (

    <div className={styles.zipCodeContainer}>
      <label htmlFor="zipCode">Enter ZIP Code:</label>
      <input
        type="text"
        id="zipCode"
        className={styles.zipCodeInput}
        value={zipCode}
        onChange={handleZipCodeChange}
        maxLength="5"
      />
    </div>

  );
};

export default ZipCode;