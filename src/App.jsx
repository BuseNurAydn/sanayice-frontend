import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SellerRoutes from './routes/SellerRoutes';
import AuthRoutes from './routes/AuthRoutes';
import CustomerRouters from './routes/CustomerRouters';


function App() {
  return (
    <Router>
      <Routes>

        {/* Müşteri panelleri */}
        <Route path="/*" element={<CustomerRouters />} />

        {/* Satıcı panelleri */}
        <Route path="/seller/*" element={<SellerRoutes />} />

        {/* Giriş ve kayıt sayfaları */}
        <Route path="/auth/*" element={<AuthRoutes />}/>
          
      </Routes>
    </Router>
  );
}

export default App;
