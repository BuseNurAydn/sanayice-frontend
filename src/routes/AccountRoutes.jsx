import {Route} from 'react-router-dom';
import Account from "../pages/customer/AccountPage/Account";
import Orders from "../pages/customer/AccountPage/Orders";
import Reviews from "../pages/customer/AccountPage/Reviews";
import Addresses from "../pages/customer/AccountPage/Addresses";
import SupportAndComplaint from '../pages/customer/AccountPage/SupportAndComplaint';



export const accountRoutes = (
  <Route path="account" element={<Account />}>
    <Route path="orders" element={<Orders />} />
    <Route path="reviews" element={<Reviews />} />
    <Route path="addresses" element={<Addresses />} />
    <Route path="support_and_complaint" element={<SupportAndComplaint />} />

    
  </Route>
);
