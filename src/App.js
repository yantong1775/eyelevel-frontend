import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing/Landing';

function App() {

  return (
        <Router>
          <Routes>
            <Route path="/" element={<Landing/>} />
          </Routes>
        </Router>
  );
}


export default App;
