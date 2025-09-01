import React from 'react'
import { Link, useLocation } from "react-router-dom";

const AuthTabs = () => {
 const location = useLocation();
  const isLogin = location.pathname === "/auth/login";

  return (
    <div className="flex w-full rounded-t-lg overflow-hidden border-b border-neutral-300">
      <Link
        to="/auth/login"
        className={`w-1/2 text-center py-6 font-semibold text-lg md:text-xl transition-colors ${
          isLogin
            ? "bg-white text-[var(--color-light-orange)] border-b-2 border-[var(--color-light-orange)]"
            : "text-gray-400 hover:text-[var(--color-light-orange)]"
        }`}
      >
        Giriş Yap
      </Link>
      <Link
        to="/auth/signUp"
        className={`w-1/2 text-center py-6 font-semibold text-lg md:text-xl transition-colors ${
          !isLogin
             ? "bg-white text-[var(--color-light-orange)] border-b-2 border-[var(--color-light-orange)]"
            : "text-gray-400 hover:text-[var(--color-light-orange)]"
        }`}
      >
        Üye Ol
      </Link>
    </div>
  );
};

export default AuthTabs
