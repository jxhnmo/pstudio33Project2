"use client";

import React, { useState } from 'react';
import './magnifier.css';


if (typeof window !== 'undefined') {
  // Client-side-only code
}

const Magnifier = () => {
  const [zoomLevel, setZoomLevel] = useState(100);

  const zoomIn = () => {
    if (zoomLevel < 200) {
      setZoomLevel(zoomLevel + 10);
      setZoom();
    }
  };

  const zoomOut = () => {
    if (zoomLevel > 10) {
      setZoomLevel(zoomLevel - 10);
      setZoom();
    }
  };

  const setZoom = () => {
    document.body.style.zoom = zoomLevel / 100;
  }

  return (
    <div className="zoomBar">
      <button className="button" onClick={zoomOut}>-</button>
      <span>ZOOM{zoomLevel}</span>
      <button className="button" onClick={zoomIn}>+</button>
    </div>
  );
};

export default Magnifier;
