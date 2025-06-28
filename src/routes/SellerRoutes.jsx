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
                    path="dashboard"
                    element={
                        <RoleProtectedRoute allowedRoles={['ROLE_SELLER']}>
                            <Dashboard />
                        </RoleProtectedRoute>
                    }
                />
                <Route
                    path="store"
                    element={
                        <RoleProtectedRoute allowedRoles={['ROLE_SELLER']}>
                            <Store />
                        </RoleProtectedRoute>
                    }
                />
                <Route
                    path="products"
                    element={
                        <RoleProtectedRoute allowedRoles={['ROLE_SELLER']}>
                            <Products />
                        </RoleProtectedRoute>
                    }
                />
                <Route
                    path="products/add"
                    element={
                        <RoleProtectedRoute allowedRoles={['ROLE_SELLER']}>
                            <AddProduct />
                        </RoleProtectedRoute>
                    }
                />
                <Route
                    path="products/edit/:id"
                    element={
                        <RoleProtectedRoute allowedRoles={['ROLE_SELLER']}>
                            <EditProduct />
                        </RoleProtectedRoute>
                    }
                />
                <Route
                    path="orders"
                    element={
                        <RoleProtectedRoute allowedRoles={['ROLE_SELLER']}>
                            <Orders />
                        </RoleProtectedRoute>
                    }
                />
                <Route
                    path="seller_profile"
                    element={
                        <RoleProtectedRoute allowedRoles={['ROLE_SELLER','ROLE_MANAGER']}>
                            <SellerProfile />
                        </RoleProtectedRoute>
                    }
                />
                <Route
                    path="seller_campaign"
                    element={
                        <RoleProtectedRoute allowedRoles={['ROLE_SELLER']}>
                            <SellerCampaignManagement />
                        </RoleProtectedRoute>
                    }
                />
                <Route
                    path="vertification"
                    element={
                        <RoleProtectedRoute allowedRoles={['ROLE_SELLER']}>
                            <SellerDocumentUpload />
                        </RoleProtectedRoute>
                    }
                />


                {/* ROLE_MANAGER */}
                <Route
                    path="seller-verification"
                    element={
                        <RoleProtectedRoute allowedRoles={['ROLE_MANAGER']}>
                            <SellerVerification />
                        </RoleProtectedRoute>
                    }
                />
                <Route
                    path="banner_management"
                    element={
                        <RoleProtectedRoute allowedRoles={['ROLE_MANAGER']}>
                            <BannerManagement />
                        </RoleProtectedRoute>
                    }
                />
                  <Route
                    path="coupon_campaign_management"
                    element={
                        <RoleProtectedRoute allowedRoles={['ROLE_MANAGER']}>
                            <CampaignCouponManagement />
                        </RoleProtectedRoute>
                    }
                />
                
                  <Route
                    path="seller_coupon_campaign_management"
                    element={
                        <RoleProtectedRoute allowedRoles={['ROLE_MANAGER']}>
                            <SellerCampaignOverview />
                        </RoleProtectedRoute>
                    }
                />
                
                <Route
                    path="support_management"
                    element={
                        <RoleProtectedRoute allowedRoles={['ROLE_MANAGER']}>
                            <SupportManagerDashboard />
                        </RoleProtectedRoute>
                    }
                />


                {/* ROLE_MANAGER */}
                <Route
                    path="categories"
                    element={
                        <RoleProtectedRoute allowedRoles={['ROLE_MANAGER']}>
                            <Categories />
                        </RoleProtectedRoute>
                    }
                />
                <Route
                    path="categories/add"
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
