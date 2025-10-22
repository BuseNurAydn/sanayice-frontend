import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SellerRoutes from './routes/SellerRoutes';
import AuthRoutes from './routes/AuthRoutes';
import CustomerRoutes from './routes/CustomerRoutes';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect ,useState} from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { setCredentials, logout } from './store/authSlice'; 
import ScrollToTop from "./components/ScrollToTop";
import ScrollToTopButton from "./components/ScrollToTopButton";
function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
   const role = useSelector((state) => state.auth.user?.role);

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

    setLoading(false);
  }, [dispatch]);

  if (loading) return null;

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/*" element={<CustomerRoutes />} />
        {role && <Route path="/satici/*" element={<SellerRoutes />} />}
        <Route path="/giris-kaydol/*" element={<AuthRoutes />} />
        
      </Routes>

      <ScrollToTopButton />
    </Router>
  );
}
export default App;
