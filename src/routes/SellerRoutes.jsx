import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/seller/Dashboard';
import Products from '../pages/seller/Products/Products';
import AddProduct from '../pages/seller/Products/AddProduct'
import EditProduct from '../pages/seller/Products/EditProduct'
import Orders from '../pages/seller/Orders';
import SellerLayout from '../layouts/SellerLayout/SellerLayout';
import Categories from '../pages/seller/Categories/Categories';
import Store from '../pages/seller/Store';
import AddCategory from '../pages/seller/Categories/AddCategory';
import RoleProtectedRoute from '../components/RoleProtectedRoute';
import SellerProfile from '../pages/seller/SellerProfile';
import SellerVerification from '../pages/seller/SellerVerification';
import BannerManagement from '../pages/seller/BannerManagement';
import CampaignCouponManagement from '../pages/seller/CampaignCouponManagement';
import SupportManagerDashboard from '../pages/seller/SupportManagerDashboard';
import SellerCampaignOverview from '../pages/seller/SellerCampaignOverview';
import SellerCampaignManagement from '../pages/seller/SellerCampaignManagement';
import SellerDocumentUpload from '../pages/seller/SellerDocumentUpload';
import AddBrand from '../pages/seller/Brand/AddBrand';
import BrandList from '../pages/seller/Brand/BrandList';
import ProductApproval from '../pages/seller/ProductApproval';

const SellerRoutes = () => {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <RoleProtectedRoute allowedRoles={['ROLE_SELLER', 'ROLE_MANAGER']}>
                        <SellerLayout />
                    </RoleProtectedRoute>
                }
            >
                {/* Yalnızca ROLE_SELLER */}
                <Route
                    path="yonetim-paneli"
                    element={
                        <RoleProtectedRoute allowedRoles={['ROLE_SELLER']}>
                            <Dashboard />
                        </RoleProtectedRoute>
                    }
                />
                <Route
                    path="magazam"
                    element={
                        <RoleProtectedRoute allowedRoles={['ROLE_SELLER']}>
                            <Store />
                        </RoleProtectedRoute>
                    }
                />
                <Route
                    path="urunlerim"
                    element={
                        <RoleProtectedRoute allowedRoles={['ROLE_SELLER']}>
                            <Products />
                        </RoleProtectedRoute>
                    }
                />
                <Route
                    path="urun/ekleme"
                    element={
                        <RoleProtectedRoute allowedRoles={['ROLE_SELLER']}>
                            <AddProduct />
                        </RoleProtectedRoute>
                    }
                />
                <Route
                    path="urun/duzenleme/:id"
                    element={
                        <RoleProtectedRoute allowedRoles={['ROLE_SELLER']}>
                            <EditProduct />
                        </RoleProtectedRoute>
                    }
                />
                <Route
                    path="siparislerim"
                    element={
                        <RoleProtectedRoute allowedRoles={['ROLE_SELLER']}>
                            <Orders />
                        </RoleProtectedRoute>
                    }
                />
                <Route
                    path="satici-profil"
                    element={
                        <RoleProtectedRoute allowedRoles={['ROLE_SELLER','ROLE_MANAGER']}>
                            <SellerProfile />
                        </RoleProtectedRoute>
                    }
                />
                <Route
                    path="satici-kupon"
                    element={
                        <RoleProtectedRoute allowedRoles={['ROLE_SELLER']}>
                            <SellerCampaignManagement />
                        </RoleProtectedRoute>
                    }
                />
                <Route
                    path="dogrulama"
                    element={
                        <RoleProtectedRoute allowedRoles={['ROLE_SELLER']}>
                            <SellerDocumentUpload />
                        </RoleProtectedRoute>
                    }
                />


                {/* ROLE_MANAGER */}
                <Route
                    path="satici-dogrulama"
                    element={
                        <RoleProtectedRoute allowedRoles={['ROLE_MANAGER']}>
                            <SellerVerification />
                        </RoleProtectedRoute>
                    }
                />
                <Route
                    path="slider-yonetimi"
                    element={
                        <RoleProtectedRoute allowedRoles={['ROLE_MANAGER']}>
                            <BannerManagement />
                        </RoleProtectedRoute>
                    }
                />
                  <Route
                    path="kampanya-kupon-yonetimi"
                    element={
                        <RoleProtectedRoute allowedRoles={['ROLE_MANAGER']}>
                            <CampaignCouponManagement />
                        </RoleProtectedRoute>
                    }
                />
                
                  <Route
                    path="satici-kupon-kampanya-yonetimi"
                    element={
                        <RoleProtectedRoute allowedRoles={['ROLE_MANAGER']}>
                            <SellerCampaignOverview />
                        </RoleProtectedRoute>
                    }
                />
                {/** 
                 <Route
                    path="add_brand"
                    element={
                        <RoleProtectedRoute allowedRoles={['ROLE_MANAGER']}>
                            <AddBrand />
                        </RoleProtectedRoute>
                    }
                />
                <Route
                    path="brand_list"
                    element={
                        <RoleProtectedRoute allowedRoles={['ROLE_MANAGER']}>
                            <BrandList />
                        </RoleProtectedRoute>
                    }
                />*/}
                <Route
                    path="urun-kontrol"
                    element={
                        <RoleProtectedRoute allowedRoles={['ROLE_MANAGER']}>
                            <ProductApproval />
                        </RoleProtectedRoute>
                    }
                />
                <Route
                    path="destek-yonetimi"
                    element={
                        <RoleProtectedRoute allowedRoles={['ROLE_MANAGER']}>
                            <SupportManagerDashboard />
                        </RoleProtectedRoute>
                    }
                />


                {/* ROLE_MANAGER */}
                <Route
                    path="kategoriler"
                    element={
                        <RoleProtectedRoute allowedRoles={['ROLE_MANAGER']}>
                            <Categories />
                        </RoleProtectedRoute>
                    }
                />
                <Route
                    path="kategori/ekleme"
                    element={
                        <RoleProtectedRoute allowedRoles={['ROLE_MANAGER']}>
                            <AddCategory />
                        </RoleProtectedRoute>
                    }
                />
                
            </Route>
        </Routes>

    );
};

export default SellerRoutes;
