'use client';
import { useState, useEffect } from 'react';

const SetTheme = () => {
  const [theme, setTheme] = useState(global.window?.__theme || 'default');

  const isHighContrast = theme === 'high-contrast';

  const toggleTheme = () => {
    global.window?.__setPreferredTheme(theme === 'default' ? 'high-contrast' : 'default');
  };

  useEffect(() => {
    global.window.__onThemeChange = setTheme;
  }, []);

  return <button onClick={toggleTheme}>{isHighContrast ? 'default' : 'high-contrast'}</button>;
};

export default SetTheme;