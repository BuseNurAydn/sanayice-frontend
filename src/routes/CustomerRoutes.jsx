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
import CargoTracking from '../pages/customer/AccountPage/CargoTracking';

const CustomerRoutes = () => {
    return (
        <Routes>
            <Route element={<CustomerLayout />}>
                <Route path='/' element={<HomePage />} />
                <Route path="favorilerim" element={<FavoritePage />} /> 
                <Route path="kategori/:id" element={<CategoryProductsPage type="category"  />} />
                <Route path="alt-kategori/:id" element={<CategoryProductsPage type="subcategory" />} />
                <Route path="sepetim" element={<CartPage />} />
                <Route path="iletisim" element={<Contact />}></Route>
                <Route path="siparis-tamamla" element={<CheckoutPage />}></Route>
                <Route path="profilim" element={<Profile />} />
                <Route path="hakkimizda" element={<AboutUs />} />
                <Route path="gizlilik-politikasi" element={<PrivacyPolicy />} />
                <Route path="iptal-iade" element={<ReturnPolicy />} />
                <Route path="kullanim-sozlesmesi" element={<TermsOfUse />} />
                <Route path="kategoriler" element={<CategoriesPage />} />
                <Route path="magaza/:id" element={<SellerPage/>} />
                {/*<Route path=":brand/:productSlug-p-:id" element={<ProductDetail />} />*/}
                <Route path="urun/:id" element={<ProductDetail />} /> 
                <Route path="kargo-takip" element={<CargoTracking />} />
            {accountRoutes}
            </Route> 
            
        </Routes>
    );
};

export default CustomerRoutes;
