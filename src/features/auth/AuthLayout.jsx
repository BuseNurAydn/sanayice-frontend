import { useLocation } from "react-router-dom";
import AuthTabs from "../auth/AuthTabs";
import SellerAuthTabs from "../auth/SellerAuthTabs"; // 👈 ekledik
import sanayice from "../../assets/png/sanayice.png";

const AuthLayout = ({ children }) => {
  const location = useLocation();

  const isSellerRoute = location.pathname.startsWith("/giris-kaydol/satici");
  const isSellerSignUp = location.pathname === "/giris-kaydol/satici/uye-ol";
  const hideTabs = false; // Satıcıda da tab olacak

  return (
    <div className="min-h-screen flex items-center flex-col scrollbar-custom overflow-y-auto">
      <img src={sanayice} alt="Logo" className="w-1/2 md:w-1/6 pt-4" />

      <div className="bg-[var(--color-white)] rounded-lg shadow-lg border border-gray-50 custom-font w-full max-w-sm md:max-w-md mt-8 z-10 relative items-center ">
        {!hideTabs && (
          isSellerRoute ? <SellerAuthTabs /> : <AuthTabs />
        )}

      {/**  {isSellerSignUp && (
          <div className="w-full text-center py-6 font-semibold text-xl md:text-2xl text-[var(--color-light-orange)]">
            Satıcı Kayıt
            <div className="border-b border-gray-200 pt-4"></div>
          </div>
        )}*/} 

        <div>{children}</div>
      </div>

      <footer className="text-black font-light custom-font mt-9 text-sm text-center">
        ©Copyright 2025 Sanayice Tüm Hakları Saklıdır
      </footer>
    </div>
  );
};

export default AuthLayout;
