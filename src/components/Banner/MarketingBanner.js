import React from "react";
import { Carousel } from "antd";
import "./MarketingBanner.css";

function MarketingBanner() {
  const messages = ["Extract Information Using GROUNDX"];

  const inner_messages = ["Upload and Process!"];

  return (
    <React.Fragment>
      <Carousel autoplay={true} autoplaySpeed={3000} dots={false}>
        {messages.map((message, index) => (
          <div key={index} className="marketing-slide">
            <div className="msg-container">
              <h3>
                <b>{message} </b>
              </h3>
              <p> {inner_messages[index]}</p>
            </div>
          </div>
        ))}
      </Carousel>
    </React.Fragment>
  );
}

export default MarketingBanner;
