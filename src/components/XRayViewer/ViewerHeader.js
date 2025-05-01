import React from 'react';
import PropTypes from 'prop-types';
import ViewerControls from './ViewerControls';

/**
 * Header component for the X-Ray viewer
 */
const ViewerHeader = ({ zoomLevel, onZoomChange, onClose }) => {
  return (
    <div className="xray-modal-header">
      <div className="xray-zoom-control">
        <ViewerControls 
          zoomLevel={zoomLevel}
          onZoomChange={onZoomChange}
          onClose={onClose}
        />
      </div>
    </div>
  );
};

ViewerHeader.propTypes = {
  zoomLevel: PropTypes.number.isRequired,
  onZoomChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default ViewerHeader;