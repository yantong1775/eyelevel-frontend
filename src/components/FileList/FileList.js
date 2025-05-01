import React, { useState, useEffect } from "react";
import FileListItem from "./FileListItem";
import FileActions from "./FileActions";
import Pagination from "./Pagination";
import XRayViewer from "../XRayViewer/XRayViewer";
import "./FileList.css";

function FileList() {
  // document list state
  const [documents, setDocuments] = useState([]);
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Xray viewer state
  const [xrayViewerOpenStatus, setXrayViewerOpenStatus] = useState(false);
  const [currentXrayDocument, setCurrentXrayDocument] = useState(null);

  // fetch document list from backend API
  const fetchDocuments = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/documents/list");

      if (!response.ok) {
        throw new Error("Failed to fetch documents");
      }

      // update the document list state
      const data = await response.json();
      setDocuments(data.documents);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  // fetch documents on component mount
  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    setTotalPages(Math.ceil(documents.length / rowsPerPage));
    setCurrentPage(1);
  }, [documents, rowsPerPage]);

  // Get documents for current page
  const paginatedDocuments = documents.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // If no documents are available
  const noDocuments = documents.length === 0;

  // Selection handlers
  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedDocs(documents.map((doc) => doc.documentId));
    } else {
      setSelectedDocs([]);
    }
  };

  const toggleSelectDocument = (id) => {
    if (selectedDocs.includes(id)) {
      setSelectedDocs(selectedDocs.filter((docId) => docId !== id));
    } else {
      setSelectedDocs([...selectedDocs, id]);
    }
  };

  // X-Ray viewer handlers
  const openXrayViewer = (documentId) => {
    const document = documents.find((doc) => doc.documentId === documentId);
    if (document) {
      setCurrentXrayDocument(document);
      setXrayViewerOpenStatus(true);
    }
  };

  const closeXrayViewer = () => {
    setXrayViewerOpenStatus(false);
    setCurrentXrayDocument(null);
  };

  // handle file list refresh when documents are deleted
  const handleFileListDelete = () => {
    fetchDocuments();
    setSelectedDocs([]);
  };

  // handle file list refersh when documents are uploaded
  const handleFileListUpload = () => {
    fetchDocuments();
  };

  return (
    <div className="document-list-container">
      <FileActions
        selectedDocs={selectedDocs}
        onDocumentDelete={handleFileListDelete}
        onDocumentUpload={handleFileListUpload}
      />

      <div className="table-wrapper">
        {noDocuments ? (
          <div className="no-documents-message">
            <p>
              No documents have been processed yet. Upload files to see them
              listed here.
            </p>
          </div>
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      onChange={toggleSelectAll}
                      checked={
                        selectedDocs.length === documents.length &&
                        documents.length > 0
                      }
                    />
                  </th>
                  <th>Name</th>
                  <th>Document ID</th>
                  <th>Document Size</th>
                </tr>
              </thead>
              <tbody>
                {paginatedDocuments.map((doc) => (
                  <FileListItem
                    key={doc.documentId}
                    document={doc}
                    isSelected={selectedDocs.includes(doc.documentId)}
                    onSelect={toggleSelectDocument}
                    onXrayView={openXrayViewer}
                  />
                ))}
              </tbody>
            </table>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              rowsPerPage={rowsPerPage}
              totalItems={documents.length}
              onPageChange={setCurrentPage}
              onRowsPerPageChange={setRowsPerPage}
            />
          </>
        )}
      </div>

      {xrayViewerOpenStatus && currentXrayDocument && (
        <XRayViewer document={currentXrayDocument} onClose={closeXrayViewer} />
      )}
    </div>
  );
}

export default FileList;
