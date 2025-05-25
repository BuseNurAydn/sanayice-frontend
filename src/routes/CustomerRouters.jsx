import { Routes, Route } from 'react-router-dom';
import CustomerDashboard from '../pages/customer/CustomerDashboard';
import ProductDetail from '../pages/customer/ProductDetail'; 

import FavoritePage from '../pages/customer/FavoritePage'; 

const AdminRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<CustomerDashboard />} />
            <Route path="/product/:id" element={<ProductDetail />} /> 
            <Route path="/favorite" element={<FavoritePage />} /> 
        </Routes>
    );
};

export default AdminRoutes;
