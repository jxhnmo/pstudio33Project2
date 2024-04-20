"use client";

import React, { useState, useEffect } from 'react';
import './magnifier.css';


const Magnifier = () => {
  const [zoomLevel, setZoomLevel] = useState(100);

  useEffect(() => {
    document.body.style.zoom = zoomLevel / 100;
  }, [zoomLevel]);

  const zoomIn = () => {
    if (zoomLevel < 200) {
      setZoomLevel(zoomLevel + 10);
    }
  };

  const zoomOut = () => {
    if (zoomLevel > 10) {
      setZoomLevel(zoomLevel - 10);
    }
  };

  return (
    <div className="zoomBar">
      <button className="button" onClick={zoomOut}>-</button>
      
      <span className="zoomText">Zoom: {zoomLevel}%</span>
      <button className="button" onClick={zoomIn}>+</button>
    </div>
  );
};

export default Magnifier;
