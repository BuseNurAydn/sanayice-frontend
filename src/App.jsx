import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import SellerRoutes from './routes/SellerRoutes';
import AuthRoutes from './routes/AuthRoutes';
import CustomerRouters from './routes/CustomerRoutes';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials, logout } from './store/authSlice'; 
import ScrollToTop from "./components/ScrollToTop";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      dispatch(setCredentials({
        token,
        user: JSON.parse(user)
      }));
    } else {
      dispatch(logout());
    }
  }, [dispatch]);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <Router>
        <ScrollToTop />
        <Routes>
          {/* Müşteri panelleri */}
          <Route path="/*" element={<CustomerRouters />} />

          {/* Satıcı panelleri */}
          <Route path="/satici/*" element={<SellerRoutes />} />

          {/* Giriş ve kayıt sayfaları */}
          <Route path="/giris-kaydol/*" element={<AuthRoutes />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
