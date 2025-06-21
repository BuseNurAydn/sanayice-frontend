import { Routes, Route, Navigate} from 'react-router-dom';
import CustomerLayout from '../layouts/CustomerLayout/CustomerLayout';
import HomePage from '../pages/customer/HomePage';
import ProductDetail from '../pages/customer/ProductDetail'; 
import ElectronicPage from '../pages/customer/CategoryProductsPage';
import FavoritePage from '../pages/customer/FavoritePage'; 
import CartPage from '../pages/customer/CartPage';
import Contact from '../pages/public/Contact';
import AboutUs from '../pages/public/AboutUs';
import { accountRoutes } from "../routes/AccountRoutes";
import CheckoutPage from '../pages/customer/CheckoutPage';
import Profile from '../pages/customer/AccountPage/Profile';
import CategoryProductsPage from '../pages/customer/CategoryProductsPage';

const CustomerRoutes = () => {
    return (
        <Routes>
            <Route element={<CustomerLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="product/:id" element={<ProductDetail />} /> 
                <Route path="favorite" element={<FavoritePage />} /> 
                <Route  path="category/:id" element={<CategoryProductsPage />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="contact" element={<Contact />}></Route>
                <Route path="checkout" element={<CheckoutPage />}></Route>
                <Route path="profile" element={<Profile />} />
                <Route path="about_us" element={<AboutUs />} />
            {accountRoutes}
            </Route> 
            
        </Routes>
    );
};

export default CustomerRoutes;
