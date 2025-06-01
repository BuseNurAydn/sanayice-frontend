import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SellerRoutes from './routes/SellerRoutes';
import AuthRoutes from './routes/AuthRoutes';
import CustomerRouters from './routes/CustomerRoutes';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
     <>
      {/* Diğer bileşenlerin */}
      <ToastContainer
        position="top-right"
        autoClose={3000}      // 3 saniye sonra kaybolur
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
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
    </>
  );
}

export default App;
