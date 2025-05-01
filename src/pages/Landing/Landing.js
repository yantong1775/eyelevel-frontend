import "./Landing.css";
import "bootstrap/dist/css/bootstrap.css";
import Layout from "../../components/Layout/Layout";
import FileList from "../../components/FileList/FileList";

function Landing() {
  // const navigate = useNavigate();
  // const handleSubmit = () => {
  //   // Use this code to navigate or call backend
  //     //navigate(`/chat?query=${encodeURIComponent(searchQuery)}`);
  // };

  // Uncomment for production
  // if (Object.keys(data).length === 0) return <Layout><img className="w-full" src="/microphone.png"/></Layout>

  return (
    <Layout>
      {/* <img className="w-full" src="/microphone.png"></img> */}
      <div className="scrollable-content">
        <FileList />
      </div>
    </Layout>
  );
}

export default Landing;
