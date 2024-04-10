"use client";
import React from 'react';
import styles from './InfoPopup.module.css'; 
import { getItemInfo } from '../../app/order';

const InfoPopup = ({ isOpen, itemInfo, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.popupBackground}>
      <div className={styles.popupContent}>
        <h2>{itemInfo?.name}</h2>
        <p>{itemInfo?.description}</p>
        <button className = {styles.closeButton} onClick={onClose} style={{ color: 'black' }}>Close</button>
      </div>
    </div>
  );
};

export default InfoPopup;