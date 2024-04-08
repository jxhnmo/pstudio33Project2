import React, { useState } from 'react';
import './magnifier.css';


if (typeof window !== 'undefined') {
  // Client-side-only code
}

const Magnifier = () => {
  const [zoomLevel, setZoomLevel] = useState(100);

  const zoomIn = () => {
    setZoomLevel(zoomLevel + 10);
    // Implement actual zoom in functionality here
  };

  const zoomOut = () => {
    setZoomLevel(zoomLevel - 10);

  };

  return (
    <div>
      <button onClick={zoomOut}>-</button>
      <span>ZOOM</span>
      <button onClick={zoomIn}>+</button>
    </div>
  );
};

export default Magnifier;
