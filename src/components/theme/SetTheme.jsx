"use client";

import React, { useState, useEffect } from 'react';
import styles from './settheme.module.css';

/** SetTheme component for toggling between high-contrast and default themes */
const SetTheme = () => {
  const [theme, setTheme] = useState(global.window?.__theme || 'default');

  const isHighContrast = theme === 'high-contrast';

  const toggleTheme = () => {
    global.window?.__setPreferredTheme(theme === 'default' ? 'high-contrast' : 'default');
  };

  useEffect(() => {
    global.window.__onThemeChange = setTheme;
  }, []);

  return <button onClick={toggleTheme} className={styles.button}>{isHighContrast ? 'ON' : 'OFF'}</button>;
};

export default SetTheme;
