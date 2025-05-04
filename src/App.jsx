import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DripCityLandingPage from './Home';
import Products from './Product';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DripCityLandingPage />} />
        <Route path="/products" element={<Products />} />
      </Routes>
    </Router>
  );
}

export default App;