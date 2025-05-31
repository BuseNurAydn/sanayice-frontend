import { Outlet,Navigate, useLocation} from "react-router-dom";
import Sidebar from "../../../pages/customer/AccountPage/Sidebar";


function Account() {
   const location = useLocation();

   if (location.pathname === '/account') {
    return <Navigate to="/account/orders" replace />;
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto flex gap-8 p-4 pt-8">
      {/* Sol taraf: Sidebar */}
      <Sidebar />

      {/* Sağ taraf: İçerik */}
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}

export default Account;




