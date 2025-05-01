import React from 'react';
import PropTypes from 'prop-types';
import PageNavigation from './PageNavigation';

/**
 * Footer component for the X-Ray viewer
 */
const ViewerFooter = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="xray-modal-footer">
      <PageNavigation 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};

ViewerFooter.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired
};

export default ViewerFooter;