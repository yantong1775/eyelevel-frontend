import React, { useState, useEffect, useRef } from "react";
import HighlightBox from "./HighlightBox";
import useXRayData from "./useXRayData";
import "./XRayViewer.css";
import ViewerHeader from "./ViewerHeader";
import ViewerFooter from "./ViewerFooter";
import DetailPopup from "./DetailPopup";

function XRayViewer({ document, onClose }) {
  // State management
  const [zoomLevel, setZoomLevel] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [selectedChunk, setSelectedChunk] = useState(null);
  const imageRef = useRef(null);
  // Custom hook to fetch xray data
  const { data: xRayData, isLoading, error } = useXRayData(document);

  const totalPages = xRayData ? xRayData.documentPages.length : 0;

  // Zoom in and out handler
  const handleZoomChange = (newZoomLevel) => {
    setZoomLevel(newZoomLevel);
  };

  // Handle image load to calculate scaling
  const handleImageLoad = (event) => {
    const img = event.target;
    setImageSize({
      width: img.offsetWidth,
      height: img.offsetHeight,
    });

    // Then update again after layout calculations are complete
    // Try multiple timings to ensure we catch the correct size
    setTimeout(() => updateImageSize(), 50);
    setTimeout(() => updateImageSize(), 200);
  };

  const updateImageSize = () => {
    if (imageRef.current) {
      const img = imageRef.current;
      setImageSize({
        width: img.offsetWidth,
        height: img.offsetHeight,
      });
    }
  };

  // Effect to update image size when page or zoom level changes
  useEffect(() => {
    updateImageSize();
  }, [currentPage, zoomLevel]);

  // Add resize event listener to update image size when browser resizes
  useEffect(() => {
    const handleResize = () => {
      updateImageSize();
      setTimeout(() => updateImageSize(), 50);
      setTimeout(() => updateImageSize(), 200);
    };

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up the event listener when component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Handle showing chunks for the current page
  const currentPageChunks =
    xRayData && currentPage <= totalPages
      ? xRayData.documentPages[currentPage - 1].chunks
      : [];

  // Get the original dimensions of the current page
  const getOriginalPageDimensions = () => {
    if (
      !xRayData ||
      !xRayData.documentPages ||
      currentPage > xRayData.documentPages.length
    ) {
      return { width: 800, height: 1000 }; // Default fallback
    }
    const page = xRayData.documentPages[currentPage - 1];
    return {
      width: page.width,
      height: page.height,
    };
  };

  // Get

  // Calculate the scale for bounding boxes
  const calculateScale = () => {
    if (
      !xRayData ||
      !xRayData.documentPages ||
      currentPage > xRayData.documentPages.length ||
      !imageSize.width
    ) {
      return 1;
    }

    const originalDimensions = getOriginalPageDimensions();

    // Calculate scale based on the ratio between rendered image size and original size
    const widthScale = imageSize.width / originalDimensions.width;

    return widthScale;
  };

  const scale = calculateScale();

  // Handle click on the overlay
  const handleOverlayClick = (e) => {
    // If the click is directly on the overlay, close the popup
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Get the proxied image URL for the current page
  const getProxiedImageUrl = () => {
    if (
      !xRayData ||
      !xRayData.documentPages ||
      currentPage > xRayData.documentPages.length
    ) {
      return "";
    }

    const originalUrl = xRayData.documentPages[currentPage - 1].pageUrl;
    if (!originalUrl) return "";

    // Encode the image URL as a query parameter
    const encodedUrl = encodeURIComponent(originalUrl);
    return `/api/images/proxy?url=${encodedUrl}`;
  };

  return (
    <div className="xray-modal" onClick={handleOverlayClick}>
      <div className="xray-modal-content">
        <ViewerHeader
          zoomLevel={zoomLevel}
          onZoomChange={handleZoomChange}
          onClose={onClose}
        />

        {/* This is the viewport that will show scrollbars */}
        {selectedChunk && (
          <DetailPopup
            chunk={selectedChunk}
            onClose={() => setSelectedChunk(null)}
            fileSummary={xRayData.fileSummary}
            fileKeywords={xRayData.fileKeywords}
          />
        )}
        <div className="xray-document-viewer">
          {isLoading ? (
            <div className="xray-loading">
              <div className="spinner"></div>
              <p>Loading document...</p>
            </div>
          ) : error ? (
            <div className="xray-error">{error}</div>
          ) : xRayData ? (
            <div className="xray-scroll-container">
              {/* This div applies the zoom transform */}
              <div
                className="xray-page-wrapper"
                style={{
                  transform: `scale(${zoomLevel / 100})`,
                  transformOrigin: "0 0",
                }}
              >
                {/* This div holds the actual page at a fixed width */}
                <div
                  className="xray-page-container"
                  style={{
                    width: `${getOriginalPageDimensions().width}`,
                  }}
                >
                  {xRayData.documentPages.length > 0 &&
                  currentPage <= xRayData.documentPages.length ? (
                    <div className="xray-page">
                      <img
                        ref={imageRef}
                        src={getProxiedImageUrl()}
                        alt={`Page ${currentPage}`}
                        className="xray-page-image"
                        style={{
                          objectFit: "contain",
                          maxHeight: "calc(95vh - 160px)", // Adjust based on header/footer height
                          maxWidth: "auto",
                        }}
                        onLoad={handleImageLoad}
                      />

                      <div className="highlight-boxes-container">
                        {currentPageChunks.map((chunk) =>
                          chunk.boundingBoxes
                            .filter((box) => box.pageNumber === currentPage)
                            .map((box, index) => {
                              // Apply the scaling factor
                              const scaledBox = {
                                topLeftX: box.topLeftX * scale,
                                topLeftY: box.topLeftY * scale,
                                bottomRightX: box.bottomRightX * scale,
                                bottomRightY: box.bottomRightY * scale,
                              };

                              return (
                                <HighlightBox
                                  key={`${chunk.id || chunk.chunk}-${index}`}
                                  box={scaledBox}
                                  text={chunk.text}
                                  chunk={chunk}
                                  onClick={(chunk) => setSelectedChunk(chunk)}
                                />
                              );
                            })
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="xray-error">No page data available</div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="xray-error">Failed to load document data</div>
          )}
        </div>

        <ViewerFooter
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}

export default XRayViewer;
