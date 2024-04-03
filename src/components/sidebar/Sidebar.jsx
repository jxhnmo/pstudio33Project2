"use client";

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import styles from './sidebar.module.css';
import SetTheme from '../theme/SetTheme';

/** Siddebar component for handling opening and closing the sidebar */
const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className={isOpen ? `${styles.sidebar} ${styles.open}` : styles.sidebar}>
      <button onClick={toggleSidebar} className={styles.toggleButton}>
        <FontAwesomeIcon icon={isOpen ? faChevronLeft : faChevronRight} />
      </button>
      {
        <div>
          <div className={styles.settingName}>High Contrast Mode</div>
          <SetTheme />
        </div>
      }
    </div>
  );
};

export default Sidebar;
