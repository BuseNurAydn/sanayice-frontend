import { Routes, Route} from 'react-router-dom';
import CustomerLayout from '../layouts/CustomerLayout/CustomerLayout';
import HomePage from '../pages/customer/HomePage';
import ProductDetail from '../pages/customer/ProductDetail'; 
import FavoritePage from '../pages/customer/FavoritePage'; 
import CartPage from '../pages/customer/CartPage';
import Contact from '../pages/public/Contact';
import AboutUs from '../pages/public/AboutUs';
import { accountRoutes } from "../routes/AccountRoutes";
import CheckoutPage from '../pages/customer/CheckoutPage';
import Profile from '../pages/customer/AccountPage/Profile';
import CategoryProductsPage from '../pages/customer/CategoryProductsPage';
import CategoriesPage from '../pages/customer/CategoriesPage';
import PrivacyPolicy from '../pages/public/PrivacyPolicy';
import ReturnPolicy from '../pages/public/ReturnPolicy';
import TermsOfUse from '../pages/public/TermsOfUse';
import SellerPage from '../pages/customer/SellerPage';

const CustomerRoutes = () => {
    return (
        <Routes>
            <Route element={<CustomerLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="product/:id" element={<ProductDetail />} /> 
                <Route path="favorite" element={<FavoritePage />} /> 
                <Route path="category/:id" element={<CategoryProductsPage type="category"  />} />
                <Route path="subcategory/:id" element={<CategoryProductsPage type="subcategory" />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="contact" element={<Contact />}></Route>
                <Route path="checkout" element={<CheckoutPage />}></Route>
                <Route path="profile" element={<Profile />} />
                <Route path="about_us" element={<AboutUs />} />
                <Route path="privacy_policy" element={<PrivacyPolicy />} />
                <Route path="return_policy" element={<ReturnPolicy />} />
                <Route path="terms_of_use" element={<TermsOfUse />} />
                <Route path="categories" element={<CategoriesPage />} />
                 <Route path="satici/:id" element={<SellerPage/>} />


            {accountRoutes}
            </Route> 
            
        </Routes>
    );
};

export default CustomerRoutes;
