import React, { useEffect } from "react";
import { useDropzone } from "react-dropzone";
import "./FileUploader.css";

const MAX_FILE_COUNT = 5;
const MAX_TOTAL_SIZE = 100 * 1024 * 1024; // 100MB

function FileUploader({
  files,
  setFiles,
  uploadStatus,
  setUploadStatus,
  errors,
  setErrors,
  processedFiles,
  setProcessedFiles,
  isUploading,
  setIsUploading,
  onDocumentUploadComplete,
}) {
  // Define allowed MIME types and extensions
  const acceptedFileTypes = {
    "application/pdf": [".pdf"],
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      [".pptx"],
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
      ".xlsx",
    ],
    "text/plain": [".txt"],
  };

  // Rehydrate state from localStorage (if needed) on component mount
  useEffect(() => {
    const uploadState = localStorage.getItem("uploadState");
    if (uploadState) {
      try {
        const parsedState = JSON.parse(uploadState);
        if (parsedState.inProgress) {
          setFiles(parsedState.files || []);
          setIsUploading(true);
        }
      } catch (e) {
        localStorage.removeItem("uploadState");
      }
    }
  }, [setFiles, setIsUploading]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: acceptedFileTypes,
    onDrop: (acceptedFiles) => {
      handleFileValidation(acceptedFiles);
    },
  });

  const handleFileValidation = (newFiles) => {
    const newErrors = [];
    const totalFiles = files.length + newFiles.length;
    if (totalFiles > MAX_FILE_COUNT) {
      newErrors.push(
        `Maximum ${MAX_FILE_COUNT} files allowed, you have uploaded ${totalFiles} files`
      );
    }
    const currentTotalSize = files.reduce((acc, file) => acc + file.size, 0);
    const newFilesTotalSize = newFiles.reduce(
      (acc, file) => acc + file.size,
      0
    );
    if (currentTotalSize + newFilesTotalSize > MAX_TOTAL_SIZE) {
      newErrors.push(
        `Fail to upload: Total file size exceeds ${
          MAX_TOTAL_SIZE / (1024 * 1024)
        } MB`
      );
    }
    if (newErrors.length === 0) {
      setFiles([...files, ...newFiles]);
      setErrors([]);
    } else {
      setErrors(newErrors);
    }
  };

  const handleUpload = async () => {
    // Save state to localStorage before upload
    const uploadData = {
      inProgress: true,
      files: files.map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
      })),
    };
    localStorage.setItem("uploadState", JSON.stringify(uploadData));
    setIsUploading(true);
    setUploadStatus("uploading");

    // Create FormData and append files
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`file-${index}`, file);
    });

    try {
      const response = await fetch("/upload/", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      setProcessedFiles(data.files);

      const hasErrors = data.files.some((file) => file.status === "error");
      setUploadStatus(hasErrors ? "error" : "success");

      onDocumentUploadComplete();

      localStorage.removeItem("uploadState");
      setIsUploading(false);

      if (hasErrors) {
        setErrors([
          "Some files could not be processed. Please check the results.",
        ]);
      }
    } catch (error) {
      setUploadStatus("error");
      setErrors(["Failed to upload files"]);
    }
  };

  const clear = () => {
    if (uploadStatus === "error" || uploadStatus === "success") {
      setFiles([]);
      setErrors([]);
      setProcessedFiles([]);
      setUploadStatus("idle");
    }
  };

  const viewResults = (url) => {
    if (url) {
      window.open(url, "_blank");
    }
  };

  return (
    <div className="upload-container">
      {isUploading ? (
        <div className="processing-modal">
          <h3>Processing Files</h3>
          <p>
            {files.length} {files.length === 1 ? "file" : "files"} being
            processed, please wait...
          </p>
          <div className="processing-indicator">
            <div className="spinner"></div>
          </div>
        </div>
      ) : (
        <>
          <div
            {...getRootProps({ onClick: clear })}
            className={`dropzone ${isDragActive ? "active" : ""}`}
          >
            <input {...getInputProps()} />
            <p>Drag files here or click to select</p>
            <em>(Up to 5 files of types: pdf, xlsx, pptx, txt)</em>
          </div>

          {errors.length > 0 && (
            <div className="error-list">
              {errors.map((error, index) => (
                <div key={index} className="error-item">
                  {error}
                </div>
              ))}
            </div>
          )}

          {files.length > 0 && (
            <div className="file-preview">
              <h4>Selected Files:</h4>
              {files.map((file, index) => (
                <div key={index} className="file-item">
                  <span>{file.name}</span>
                  <span>({Math.round(file.size / 1024)} KB)</span>
                </div>
              ))}
            </div>
          )}

          {processedFiles.length > 0 &&
            (uploadStatus === "success" || uploadStatus === "error") && (
              <div className="file-preview">
                <h4>Processed Files:</h4>
                {processedFiles.map((file, index) => (
                  <div key={index} className="file-item">
                    <span>{file.original_name}</span>
                    <span className={`status-badge ${file.status}`}>
                      {file.status === "complete" ? "Success" : "Failed"}
                    </span>
                    {file.status === "complete" && file.results_url && (
                      <button
                        className="view-results-button"
                        onClick={() => viewResults(file.results_url)}
                      >
                        View Results
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

          {files.length > 0 && uploadStatus === "idle" && (
            <button onClick={handleUpload} className="upload-button">
              Upload Files
            </button>
          )}

          {uploadStatus === "uploading" && (
            <div className="upload-status">
              <div className="progress-bar" />
              <p>Uploading {files.length} files...</p>
            </div>
          )}

          {uploadStatus === "success" && (
            <div className="upload-success">
              ✓ All files uploaded successfully!
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default FileUploader;
