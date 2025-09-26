import {Route} from 'react-router-dom';
import Account from "../pages/customer/AccountPage/Account";
import Orders from "../pages/customer/AccountPage/Orders";
import Reviews from "../pages/customer/AccountPage/Reviews";
import Addresses from "../pages/customer/AccountPage/Addresses";
import SupportAndComplaint from '../pages/customer/AccountPage/SupportAndComplaint';
import CustomerProfile from '../pages/customer/AccountPage/Profile'
import FollowingList from '../pages/customer/AccountPage/FollowingList';
import DeliveredOrderDetailPage from "../pages/customer/AccountPage/DeliveredOrderDetailPage";
import CargoTracking from '../pages/customer/AccountPage/CargoTracking';

export const accountRoutes = (
  <Route path="hesabim" element={<Account />}>
    <Route path="siparislerim" element={<Orders />} />
    <Route path="siparislerim/:id" element={<DeliveredOrderDetailPage />} />
    <Route path="degerlendirmelerim" element={<Reviews />} />
    <Route path="adreslerim" element={<Addresses />} />
    <Route path="profilim" element={<CustomerProfile />} />
    <Route path="destek-sikayet" element={<SupportAndComplaint/>} />
    <Route path="takip-edilenler" element={<FollowingList />} />
   
  </Route>
);
