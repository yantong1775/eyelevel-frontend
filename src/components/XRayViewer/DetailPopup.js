import React, { useState } from "react";
import "./DetailPopup.css";

function DetailPopup({ chunk, fileSummary, fileKeywords, onClose }) {
  const [expandedSections, setExpandedSections] = useState({
    jsonFormatted: false,
    narrativeText: false,
    suggestedText: false,
    extractedText: false,
    fileSummary: false,
    fileKeywords: false,
  });

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  // Handle click on the overlay
  const handleOverlayClick = (e) => {
    // If the click is directly on the overlay, close the popup
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const isParagraph = chunk.contentType[0] === "paragraph";

  // Generate a formatted chunk ID for display
  const chunkId = chunk.chunk;
  const formattedChunkId = `Chunk [${chunkId}]`;

  // Determine chunk type (default to Paragraph if not specified)
  const chunkType = chunk.contentType;

  return (
    <div className="detail-overlay" onClick={handleOverlayClick}>
      <div className="detail-container">
        <div className="detail-header">
          <h2>Semantic Object Detail</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <p className="detail-description">
          Each object starts with the core text extracted from your doc and
          rewritten for LLMs. The original source text is also there for
          sourcing. We then surround the object with rich metadata so the LLM
          has context to make sense of your data.
        </p>

        <div className="chunk-identifier">
          <span>{formattedChunkId}</span>
          <span className="chunk-type">[{chunkType}]</span>
        </div>

        <div className="detail-section">
          <div
            className="section-header"
            onClick={() => toggleSection("jsonFormatted")}
          >
            <h3>JSON Formatted</h3>
            <span className="info-icon">ⓘ</span>
            <span className="expand-icon">
              {expandedSections.jsonFormatted ? "▲" : "▼"}
            </span>
          </div>
          {expandedSections.jsonFormatted && (
            <div className="section-content">
              <pre>{JSON.stringify(chunk.json, null, 2)}</pre>
            </div>
          )}
        </div>

        {!isParagraph && (
          <div className="detail-section">
            <div
              className="section-header"
              onClick={() => toggleSection("narrativeText")}
            >
              <h3>Narrative Text</h3>
              <span className="info-icon">ⓘ</span>
              <span className="expand-icon">
                {expandedSections.narrativeText ? "▲" : "▼"}
              </span>
            </div>
            {expandedSections.narrativeText && (
              <div className="section-content">
                <pre>{chunk.narrative}</pre>
              </div>
            )}
          </div>
        )}

        <div className="detail-section">
          <div
            className="section-header"
            onClick={() => toggleSection("suggestedText")}
          >
            <h3>Suggested Text</h3>
            <span className="info-icon">ⓘ</span>
            <span className="expand-icon">
              {expandedSections.suggestedText ? "▲" : "▼"}
            </span>
          </div>
          {expandedSections.suggestedText && (
            <div className="section-content">
              <p>{chunk.suggestedText || "No suggested text available"}</p>
            </div>
          )}
        </div>

        <div className="detail-section">
          <div
            className="section-header"
            onClick={() => toggleSection("extractedText")}
          >
            <h3>Extracted Text</h3>
            <span className="info-icon">ⓘ</span>
            <span className="expand-icon">
              {expandedSections.extractedText ? "▲" : "▼"}
            </span>
          </div>
          {expandedSections.extractedText && (
            <div className="section-content">
              <p>{chunk.text}</p>
            </div>
          )}
        </div>

        <div className="detail-section">
          <div
            className="section-header"
            onClick={() => toggleSection("fileSummary")}
          >
            <h3>File Summary</h3>
            <span className="info-icon">ⓘ</span>
            <span className="expand-icon">
              {expandedSections.fileSummary ? "▲" : "▼"}
            </span>
          </div>
          {expandedSections.fileSummary && (
            <div className="section-content">
              <p>{fileSummary}</p>
            </div>
          )}
        </div>

        <div className="detail-section">
          <div
            className="section-header"
            onClick={() => toggleSection("fileKeywords")}
          >
            <h3>File Keywords</h3>
            <span className="info-icon">ⓘ</span>
            <span className="expand-icon">
              {expandedSections.fileKeywords ? "▲" : "▼"}
            </span>
          </div>
          {expandedSections.fileKeywords && (
            <div className="section-content">
              <p>{fileKeywords}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DetailPopup;
