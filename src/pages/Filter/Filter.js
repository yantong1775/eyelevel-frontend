// This page can be used if a user tries to search for inappropriate terms
import { Result } from 'antd';
import Layout from '../../components/Layout/Layout';
import './Filter.css';
  
  const FilterPage = () => {
    
  
  return (
    <Layout>
      <h3 className="headers">Error | <a className="text-white" href="/">Go to Home Page</a></h3>
      <hr className="linebreaks"/>
      <Result
        status={"404"}
        title={"Content Not Available"}
        subTitle={"We're committed to creating a safe and respectful community for everyone. In line with this commitment, we do not allow searches or content related to pornography, explicit sexual themes, or hate speech on our platform. We appreciate your understanding and cooperation in helping us maintain a positive and inclusive environment.\n If you believe this message was shown in error, please feel free to reach out to our support team for assistance." 
        }
      />

    </Layout>
  );
};

export default FilterPage;
