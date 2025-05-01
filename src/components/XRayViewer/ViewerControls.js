import React from 'react';

function ViewerControls({ zoomLevel, onZoomChange, onFitToScreen, onClose }) {
    const handleZoomIn = () => {
        onZoomChange(Math.min(400, zoomLevel + 25));
    };
    
    const handleZoomOut = () => {
        onZoomChange(Math.max(25, zoomLevel - 25));
    };
    
    return (
        <div className="xray-modal-controls">
            <div className="zoom-controls">
                <span>Zoom: {zoomLevel}%</span>
                <button 
                className="zoom-out-btn" 
                onClick={handleZoomOut}
                title="Zoom out"
                >
                <span>🔍-</span>
                </button>
                <button 
                className="zoom-in-btn" 
                onClick={handleZoomIn}
                title="Zoom in"
                >
                <span>🔍+</span>
                </button>
            </div>
            <button 
                className="close-modal-btn" 
                onClick={onClose} 
                title="Close"
            >
                <span>×</span>
            </button>
        </div>
    );
}

export default ViewerControls;