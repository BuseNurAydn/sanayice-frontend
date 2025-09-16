import { Outlet, Navigate, useLocation } from "react-router-dom";
import Sidebar from "../../../pages/customer/AccountPage/Sidebar";

function Account() {
  const location = useLocation();

  // Direkt /account yoluna gelindiyse orders sayfasına yönlendir
  if (location.pathname === '/hesabim') {
    return <Navigate to="/hesabim/siparislerim" replace />;
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto p-4 pt-8 flex flex-col md:flex-row gap-4">
      {/* Sidebar: mobilde üstte yatay, masaüstünde solda dikey */}
      <Sidebar />

      {/* İçerik alanı */}
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}

export default Account;




