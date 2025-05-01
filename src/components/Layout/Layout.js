import "./Layout.css";
import "bootstrap/dist/css/bootstrap.css";
import Footer from "../Footer/Footer";
import MarketingBanner from "../Banner/MarketingBanner";
import { useNavigate } from "react-router-dom";

function Layout({ children }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/`);
  };

  return (
    <div className="Layout">
      <div className="headbar" id="headbar-element">
        <div
          className="headbar-title"
          style={{ cursor: "pointer" }}
          onClick={handleClick}
        >
          PDF extraction
        </div>
      </div>
      <div className="main-page-banner">
        <div className="marketing-banner" id="marketing-banner-element">
          <MarketingBanner />
        </div>
      </div>
      <div className="main-page">{children}</div>
      <Footer />
    </div>
  );
}

export default Layout;
