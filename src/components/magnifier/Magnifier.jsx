import React, { useState } from 'react';
import './magnifier.css';


if (typeof window !== 'undefined') {
  // Client-side-only code
}

const Magnifier = () => {
  const [zoomLevel, setZoomLevel] = useState(100);

  const zoomIn = () => {
    setZoomLevel(zoomLevel + 10);
    document.body.zoom = zoomLevel / 100;
  };

  const zoomOut = () => {
    setZoomLevel(zoomLevel - 10);
    document.body.zoom = zoomLevel / 100;
  };

  return (
    <div className="zoomBar">
      <button className="button" onClick={zoomOut}>-</button>
      <span>ZOOM</span>
      <button className="button" onClick={zoomIn}>+</button>
    </div>
  );
};

export default Magnifier;
