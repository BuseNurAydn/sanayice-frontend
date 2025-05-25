import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/seller/Dashboard';
import Products from '../pages/seller/Products/Products';
import AddProduct from '../pages/seller/Products/AddProduct'
import EditProduct from '../pages/seller/Products/EditProduct'
import Orders from '../pages/seller/Orders';
import SellerLayout from '../layouts/SellerLayout/SellerLayout';
import Categories from '../pages/seller/Categories/Categories';
import AddCategory from '../pages/seller/Categories/AddCategory';
import RoleProtectedRoute from '../components/RoleProtectedRoute';

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
                    path="products/edit"
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
