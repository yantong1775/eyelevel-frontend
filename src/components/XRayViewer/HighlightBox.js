import React, { useState } from "react";

function HighlightBox({ box, text, chunk, onClick }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`highlight-box ${isHovered ? "hovered" : ""}`}
      style={{
        position: "absolute",
        left: `${box.topLeftX}px`,
        top: `${box.topLeftY}px`,
        width: `${box.bottomRightX - box.topLeftX}px`,
        height: `${box.bottomRightY - box.topLeftY}px`,
        backgroundColor: "rgba(255, 235, 59, 0.3)",
        border: "1px solid rgba(255, 152, 0, 0.5)",
        cursor: "pointer",
      }}
      onClick={() => onClick(chunk)}
    ></div>
  );
}

export default HighlightBox;
