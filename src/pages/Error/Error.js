import React, { useContext } from "react";
import Layout from "../../components/Layout/Layout";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    // console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Render any custom fallback UI
      return (
        <Layout>
          <div>
            <h1>Something went wrong.</h1>
            {/* Optionally, display more details about the error. */}
            {
              <details>
                {this.state.errorInfo &&
                  this.state.errorInfo.componentStack.toString()}
              </details>
            }
          </div>
        </Layout>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
