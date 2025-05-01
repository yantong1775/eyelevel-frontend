import React from 'react';

function PageNavigation({ currentPage, totalPages, onPageChange }) {
    const goToPrevPage = () => {
        if (currentPage > 1) {
        onPageChange(currentPage - 1);
        }
    };
    
    const goToNextPage = () => {
        if (currentPage < totalPages) {
        onPageChange(currentPage + 1);
        }
    };
    
    return (
        <div className="page-navigation">
        <button 
            onClick={goToPrevPage}
            disabled={currentPage === 1 || totalPages === 0}
            className="prev-page-btn"
        >
            <span>◀</span>
        </button>
        
        <span>Page {totalPages > 0 ? currentPage : 0} of {totalPages}</span>
        
        <button 
            onClick={goToNextPage}
            disabled={currentPage === totalPages || totalPages === 0}
            className="next-page-btn"
        >
            <span>▶</span>
        </button>
        </div>
    );
}

export default PageNavigation;