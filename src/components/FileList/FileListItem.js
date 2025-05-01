import React from "react";

function FileListItem({ document, isSelected, onSelect, onXrayView }) {
  const handleSelect = () => {
    onSelect(document.documentId);
  };

  const handleXRayClick = () => {
    onXrayView(document.documentId);
  };

  return (
    <tr>
      <td>
        <input type="checkbox" checked={isSelected} onChange={handleSelect} />
      </td>
      <td data-label="Name">
        {document.fileName}
        <span
          className="download-icon"
          onClick={() => window.open(document.xrayUrl, "_blank")}
        >
          ⬇️
        </span>
        {document.fileType === "pdf" && (
          <span
            className="x-ray-badge"
            onClick={handleXRayClick}
            title="View document X-RAY"
          >
            X-RAY
          </span>
        )}
      </td>
      <td data-label="ID" className="document-id-cell">
        <span className="document-id truncate-text">{document.documentId}</span>
        <button
          className="copy-button"
          onClick={(event) => {
            navigator.clipboard.writeText(document.documentId);
            const button = event.currentTarget;
            const originalText = button.innerHTML;
            button.innerHTML = "Copied!";
            setTimeout(() => {
              button.innerHTML = originalText;
            }, 1000);
          }}
          title="Copy Document ID"
        >
          <span className="large-icon">&#x2398;</span>
        </button>
      </td>
      <td data-label="Size" className="tokens-cell">
        {document.fileSize.toLocaleString()}
      </td>
    </tr>
  );
}

export default FileListItem;
