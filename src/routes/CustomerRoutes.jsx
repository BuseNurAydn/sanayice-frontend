import { Routes, Route, Navigate} from 'react-router-dom';
import CustomerLayout from '../layouts/CustomerLayout/CustomerLayout';
import HomePage from '../pages/customer/HomePage';
import ProductDetail from '../pages/customer/ProductDetail'; 
import ElectronicPage from '../pages/customer/ElectronicProductsPage';
import FavoritePage from '../pages/customer/FavoritePage'; 
import CartPage from '../pages/customer/CartPage';
import Contact from '../pages/public/Contact';
import { accountRoutes } from "../routes/AccountRoutes";

const CustomerRoutes = () => {
    return (
        <Routes>
            <Route element={<CustomerLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="product/:id" element={<ProductDetail />} /> 
                <Route path="favorite" element={<FavoritePage />} /> 
                <Route path="electronic" element={<ElectronicPage />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="contact" element={<Contact />}></Route>
            {accountRoutes}
            </Route> 
            
        </Routes>
    );
};

export default CustomerRoutes;
