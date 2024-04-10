// InfoPopup.js
"use client";
import React from 'react';
import styles from './InfoPopup.module.css'; // Assuming you have CSS modules set up

const InfoPopup = ({ isOpen, itemInfo, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.popupBackground}>
      <div className={styles.popupContent}>
        <h2>{itemInfo?.name}</h2>
        <p>{itemInfo?.description}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default InfoPopup;