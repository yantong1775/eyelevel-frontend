import React from 'react';

function Pagination({ 
    currentPage, 
    totalPages, 
    rowsPerPage, 
    totalItems, 
    onPageChange, 
    onRowsPerPageChange 
}) {
    const handleRowsPerPageChange = (e) => {
        onRowsPerPageChange(parseInt(e.target.value));
    };
    
    const goToNextPage = () => {
        if (currentPage < totalPages) {
        onPageChange(currentPage + 1);
        }
    };
    
    const goToPrevPage = () => {
        if (currentPage > 1) {
        onPageChange(currentPage - 1);
        }
    };
    
    // Calculate range of items being displayed
    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
    const endItem = Math.min(currentPage * rowsPerPage, totalItems);
    
    return (
        <div className="pagination">
        <div className="rows-per-page">
            Rows per page: 
            <select value={rowsPerPage} onChange={handleRowsPerPageChange}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            </select>
        </div>
        <div className="page-indicator">
            {totalItems > 0 ? `${startItem}-${endItem} of ${totalItems}` : '0-0 of 0'}
        </div>
        <div className="page-controls">
            <button 
            onClick={goToPrevPage} 
            disabled={currentPage === 1}
            className="page-control"
            >
            &lt;
            </button>
            <button 
            onClick={goToNextPage} 
            disabled={currentPage === totalPages || totalPages === 0}
            className="page-control"
            >
            &gt;
            </button>
        </div>
        </div>
    );
}

export default Pagination;