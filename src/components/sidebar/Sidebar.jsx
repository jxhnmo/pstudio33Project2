"use client";
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import styles from './sidebar.module.css';
import SetTheme from '../theme/SetTheme';
import Magnifier from '../magnifier/Magnifier';
import Weather from '../weather/Weather';
import ZipCode from '../ZipCode/zipcode'; // Import the new ZipCode component

// Sidebar component
const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle sidebar open/close
  const toggleSidebar = () => setIsOpen(!isOpen);

  useEffect(() => {
    // Function to load and initialize the Google Translate widget
    const loadGoogleTranslate = () => {
      if (window.googleTranslateScriptLoaded) return;

      // Define the initialization function for Google Translate
      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement({ pageLanguage: 'en' }, 'google_translate_element');
      };
      // Dynamically load the Google Translate script
      const googleTranslateScript = document.createElement('script');
      googleTranslateScript.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      googleTranslateScript.async = true;
      document.body.appendChild(googleTranslateScript);

      window.googleTranslateScriptLoaded = true; // Set flag to true

      // Cleanup function
      return () => {
        window.googleTranslateScriptLoaded = false; // Reset flag

      //  document.body.removeChild(googleTranslateScript);
      //  delete window.googleTranslateElementInit;
      };
    };

    loadGoogleTranslate();
  }, []);

  return (
    <div className={isOpen ? `${styles.sidebar} ${styles.open}` : styles.sidebar}>
      <button onClick={toggleSidebar} className={styles.toggleButton} aria-label="Open accessibility options" aria-expanded="false">
        <FontAwesomeIcon icon={isOpen ? faChevronLeft : faChevronRight} />
      </button>
      <div className={styles.settingName}>High Contrast Mode</div>
      <SetTheme />
      <Magnifier />
      <div id="google_translate_element" style={{ marginTop: '20px' }}></div>
      <Weather /> 
      <ZipCode />
    </div>
  );
};

export default Sidebar;