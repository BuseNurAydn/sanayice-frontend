import AuthTabs from '../auth/AuthTabs';
import Logo from "../../assets/png/Logo.png"
import { useLocation } from "react-router-dom";

const AuthLayout = ({ children }) => {
    const location = useLocation();

  // Satıcı kayıt sayfası dışında tabları göster
  const isSellerSignUp = location.pathname === "/auth/signUp/seller";
  const hideTabs = isSellerSignUp;

  return (
    <div className="min-h-screen flex items-center flex-col">
      
       <div className='bg-[var(--color-dark-orange)] h-[300px] w-full flex justify-center items-center pb-16'>
          <img src={Logo} alt="Logo" className='w-3/4 md:w-auto'/>
       </div>

      {/* Beyaz içerik kutusu */}
      <div className="bg-[var(--color-white)] rounded-[2rem] shadow-lg w-[1091px] max-w-sm md:max-w-lg p-0 -mt-24 z-10 relative items-center">
       {!hideTabs && <AuthTabs />}
        
        {isSellerSignUp && (
          <div className="w-full text-center py-6 custom-font font-medium text-2xl">
            SATICI KAYIT
            <div className='border-b pt-4'></div>
          </div>
        )}
        <div className="">
          {children}
        </div>
      </div>

      {/* Footer */}
      <footer className=" text-black font-light custom-font mt-16 text-center">
        ©Copyright 2025 Sanayice Tüm Hakları Saklıdır
      </footer>
    </div>
  );
};

export default AuthLayout;
