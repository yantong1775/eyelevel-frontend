import React, { useState, useEffect } from "react";
import { Result, Button } from "antd";
import Layout from "../../components/Layout/Layout";
import "./Exception.css";

const EXCEPTION_TYPES = {
  NO_PERMISSION: {
    title: 403,
    description: "Sorry, you do not have permission to view this resource.",
  },
  LOGIN_REQUIRED: {
    title: 403,
    description: "Sorry, you need to login to view this resource.",
  },
  NO_ACCOUNT: {
    title: 403,
    description: "Sorry, your account is expired.",
  },
  SERVER_ERROR: {
    title: 500,
    description:
      "Oops, our servers seem to be taking a break. Please wait a moment.",
  },
  CONFLICT_ERROR: {
    title: 404,
    description: "User is registered. Please log in.",
  },
  UNEXPECTED_ERROR: {
    title: 404,
    description: "Oops, something unexpected happened.",
  },
  EXPIRED_ERROR: {
    title: 404,
    description: "Oops, invlid link.",
  },
  NO_QUOTA: {
    title: 404,
    description: "Oops, you have exceeded your executive hub quota.",
  },
};

const getRetryCountFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return parseInt(urlParams.get("retries") || "0", 10);
};

const ExceptionPage = ({ exceptionType, onRetry }) => {
  const [counter, setCounter] = useState(5);
  const initialRetries = getRetryCountFromUrl();
  const [retries, setRetries] = useState(initialRetries);
  const { title, description } = EXCEPTION_TYPES[exceptionType];

  useEffect(() => {
    if (retries >= 3 || exceptionType !== EXCEPTION_TYPES["SERVER_ERROR"])
      return;

    const intervalId = setInterval(() => {
      setCounter((prevCounter) => prevCounter - 1);
    }, 1000);

    const timeoutId = setTimeout(() => {
      let newRetryCount = retries + 1;
      const currentUrl = window.location.pathname;
      const newUrl = `${currentUrl}?retries=${newRetryCount}`;
      window.location.href = newUrl;
    }, 5000);

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [retries]);

  return (
    <Layout>
      {/* <img className="w-full" src="/microphone.png" alt="Microphone"/> */}
      <h3 className="headers">Error</h3>
      <hr className="linebreaks" />

      <Result
        status={title}
        title={description}
        subTitle={`${
          retries < 3 && exceptionType === EXCEPTION_TYPES["SERVER_ERROR"]
            ? `Don't worry, we will reload the page for you. Reloading in ${counter} seconds...`
            : "Please comeback later."
        }`}
      />
    </Layout>
  );
};

export default ExceptionPage;
