import React, { useState } from 'react';
import './magnifier.css';

const Magnifier = ({ children }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  const handleMouseMove = (e) => {
    const magnifyingLens = e.currentTarget.querySelector('.magnifying-lens');
    const rect = magnifyingLens.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left - (rect.width / 2),
      y: e.clientY - rect.top - (rect.height / 2),
    });
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  return (
    <div 
      onMouseMove={handleMouseMove} 
      onMouseLeave={handleMouseLeave} 
      className="magnify-container"
    >
      {children}
      <div
        className={`magnifying-lens ${isVisible ? 'visible' : ''}`}
        style={{
          transformOrigin: `${position.x}px ${position.y}px`,
        }}
      />
    </div>
  );
};

export default Magnifier;

