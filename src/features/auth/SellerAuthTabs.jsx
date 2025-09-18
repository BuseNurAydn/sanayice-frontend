import { Link, useLocation } from "react-router-dom";

const SellerAuthTabs = () => {
  const location = useLocation();
  const isLogin = location.pathname === "/giris-kaydol/satici/giris-yap";

  return (
    <div className="flex w-full rounded-t-lg overflow-hidden border-b border-neutral-300">
      <Link
        to="/giris-kaydol/satici/giris-yap"
        className={`w-1/2 text-center py-6 font-semibold text-lg md:text-xl transition-colors ${
          isLogin
            ? "bg-white text-[var(--color-light-orange)] border-b-2 border-[var(--color-light-orange)]"
            : "text-gray-400 hover:text-[var(--color-light-orange)]"
        }`}
      >
        Satıcı Giriş
      </Link>
      <Link
        to="/giris-kaydol/satici/uye-ol"
        className={`w-1/2 text-center py-6 font-semibold text-lg md:text-xl transition-colors ${
          !isLogin
            ? "bg-white text-[var(--color-light-orange)] border-b-2 border-[var(--color-light-orange)]"
            : "text-gray-400 hover:text-[var(--color-light-orange)]"
        }`}
      >
        Satıcı Kayıt
      </Link>
    </div>
  );
};

export default SellerAuthTabs;

