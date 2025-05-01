import React, { useState } from "react";
import FileUploader from "../FileUploader/FileUploader";
function FileActions({
  selectedDocs = [],
  onDocumentDelete,
  onDocumentUpload,
}) {
  const [showUploader, setShowUploader] = useState(false);

  // Lifted state for the FileUploader
  const [files, setFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState("idle"); // idle, uploading, success, error
  const [errors, setErrors] = useState([]);
  const [processedFiles, setProcessedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  // state for delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // delete status
  const [isDeleting, setIsDeleting] = useState(false);

  // Modified to show confirmation dialog first
  const handleDeleteClick = () => {
    if (selectedDocs.length === 0) {
      return;
    }
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    // Implement delete functionality

    if (selectedDocs.length === 0) {
      return;
    }

    setIsDeleting(true);

    try {
      const resp = await fetch("/api/documents/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ documentIds: selectedDocs }),
      });
      if (!resp.ok) {
        throw new Error("Failed to delete documents");
      }

      onDocumentDelete();
    } catch (error) {
      alert("Failed to delete documents");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const handleAddContent = () => {
    // Open the uploader
    setShowUploader(true);
  };

  const closeModal = () => {
    // Close the uploader
    setShowUploader(false);
  };

  return (
    <>
      <div className="document-header">
        <h2>test_bucket</h2>
        <div className="document-actions">
          <button
            className="action-button delete-button"
            disabled={selectedDocs.length === 0 || isUploading}
            onClick={handleDeleteClick}
          >
            <span className="icon">🗑️</span>
            <span className="button-text">DELETE</span>
          </button>
          <button
            className="action-button add-button"
            onClick={handleAddContent}
          >
            {isUploading ? (
              <>
                <span className="spinner-small"></span> UPLOADING...
              </>
            ) : (
              <>
                <span className="icon">+</span>
                <span className="button-text">ADD CONTENT</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content delete-confirm-modal">
            <div className="modal-header">
              <h3>Confirm Delete</h3>
            </div>
            <div className="modal-body">
              <p>
                Are you sure you want to delete {selectedDocs.length} selected
                document(s)?
              </p>
              <p>This action cannot be undone.</p>
              <div className="confirm-actions">
                <button className="cancel-button" onClick={cancelDelete}>
                  Cancel
                </button>
                <button
                  className="delete-confirm-button"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deletion Overlay */}
      {isDeleting && (
        <div className="deletion-overlay">
          <div className="deletion-modal">
            <h3>Deleting Documents</h3>
            <p>Please wait while we delete the selected documents...</p>
            <div className="spinner"></div>
          </div>
        </div>
      )}

      {/* File Upload Modal */}
      {showUploader && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Upload Files</h3>
              <button className="close-button" onClick={closeModal}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <FileUploader
                onUploadComplete={closeModal}
                files={files}
                setFiles={setFiles}
                uploadStatus={uploadStatus}
                setUploadStatus={setUploadStatus}
                errors={errors}
                setErrors={setErrors}
                processedFiles={processedFiles}
                setProcessedFiles={setProcessedFiles}
                isUploading={isUploading}
                setIsUploading={setIsUploading}
                onDocumentUploadComplete={onDocumentUpload}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default FileActions;
