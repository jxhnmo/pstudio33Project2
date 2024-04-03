import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import styles from './sidebar.module.css';

/** SetTheme function for toggling between high-contrast and default themes */
const SetTheme = () => {
  const [theme, setTheme] = useState(global.window?.__theme || 'default');

  const isHighContrast = theme === 'high-contrast';

  const toggleTheme = () => {
    global.window?.__setPreferredTheme(theme === 'default' ? 'high-contrast' : 'default');
  };

  useEffect(() => {
    global.window.__onThemeChange = setTheme;
  }, []);

  return <button onClick={toggleTheme} className={styles.settingButton}>{isHighContrast ? 'ON' : 'OFF'}</button>;
};

/** Siddebar function for handling opening and closing the sidebar */
const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className={isOpen ? `${styles.sidebar} ${styles.open}` : styles.sidebar}>
      <button onClick={toggleSidebar} className={styles.toggleButton}>
        <FontAwesomeIcon icon={isOpen ? faChevronLeft : faChevronRight} />
      </button>
      {
        <>
          <h3 className={styles.settingName}>High Contrast Mode</h3>
          <SetTheme />
        </>
      }
    </div>
  );
};

export default Sidebar;
