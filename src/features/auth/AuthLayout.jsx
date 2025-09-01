import AuthTabs from '../auth/AuthTabs';
import sanayice from "../../assets/png/sanayice.png"
import { useLocation } from "react-router-dom";

const AuthLayout = ({ children }) => {
    const location = useLocation();

  // Satıcı kayıt sayfası dışında tabları göster
  const isSellerSignUp = location.pathname === "/auth/signUp/seller";
  const hideTabs = isSellerSignUp;

  return (
    <div className="min-h-screen flex items-center flex-col scrollbar-custom overflow-y-auto">
      
       {/*<div className='bg-[var(--color-dark-orange)] h-[300px] w-full flex justify-center items-center pb-16'>  </div>*/}
     <img src={sanayice} alt="Logo" className=' w-1/2 md:w-1/6 pt-4'/>
     
      {/* Beyaz içerik kutusu */}
      <div className="bg-[var(--color-white)] rounded-lg shadow-lg border border-gray-50 custom-font w-[1091px] max-w-sm md:max-w-md mt-8 z-10 relative items-center">
       {!hideTabs && <AuthTabs />}
        
        {isSellerSignUp && (
          <div className="w-full text-center py-6 font-semibold text-xl md:text-2xl text-[var(--color-light-orange)]">
            Satıcı Kayıt
            <div className='border-b border-gray-200 pt-4'></div>
          </div>
        )}
        <div className="">
          {children}
        </div>
      </div>

      {/* Footer */}
      <footer className=" text-black font-light custom-font mt-9 text-sm text-center">
        ©Copyright 2025 Sanayice Tüm Hakları Saklıdır
      </footer>
    </div>
  );
};

export default AuthLayout;
