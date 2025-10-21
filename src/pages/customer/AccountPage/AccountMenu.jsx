import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../../store/authSlice";
import { clear } from "../../../store/cartSlice";
import { clearFavorites } from "../../../store/favoritesSlice";
import { Link, useNavigate } from "react-router-dom";
import {FaUser,FaRegUser} from "react-icons/fa";
import { BsChatSquareDots } from "react-icons/bs";
import { TfiPackage } from "react-icons/tfi";
import { FiStar } from "react-icons/fi";
import { LuCircleUserRound, LuLogOut } from "react-icons/lu";
import { SlLocationPin } from "react-icons/sl";

const menuItems = [
  { path: "/hesabim/profilim", label: "Profil Bilgilerim", icon: <FaRegUser /> },
  { path: "/hesabim/siparislerim", label: "Tüm Siparişlerim", icon: <TfiPackage /> },
  { path: "/hesabim/adreslerim", label: "Adres Bilgilerim", icon: <SlLocationPin /> },
  { path: "/hesabim/degerlendirmelerim", label: "Değerlendirmelerim", icon: <FiStar /> },
  { path: "/hesabim/takip-edilenler", label: "Takip Edilenler", icon: <LuCircleUserRound /> },
  { path: "/hesabim/destek-sikayet", label: "Destek ve Şikayet", icon: <BsChatSquareDots /> },
];

const AccountMenu = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("pendingFavoriteItem");
    localStorage.removeItem("pendingCartItem");
    dispatch(clear());
    dispatch(clearFavorites());
    dispatch(logout());
    setOpen(false);
    navigate("/");
  };

  const toggleMenu = () => setOpen((prev) => !prev);

  // Eğer kullanıcı giriş yapmadıysa
  if (!user) {
    return (
      <button
        className="md:bg-black md:hover:bg-gray-800 text-white md:px-4 md:py-2 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 flex items-center gap-x-2"
        onClick={() => navigate("/giris-kaydol/giris-yap")}
      >
        <FaUser className="text-lg text-orange-600 md:text-white w-4 h-4" />
        <span className="hidden md:inline">Giriş / Kayıt Ol</span>
      </button>
    );
  }

  return (
    <div
      className="relative z-20"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Hesabım butonu */}
      <Link
        to="/hesabim"
        onClick={toggleMenu}
        className="md:bg-[var(--color-dark-blue)] rounded-lg md:px-4 md:py-2 text-white transition-transform duration-200 hover:scale-105 flex items-center gap-x-2"
      >
        <FaUser className="text-lg text-orange-600 md:text-white w-4 h-4" />
        <span className="hidden md:inline-block">Hesabım</span>
      </Link>

      {/* Menü dropdown */}
      {open && (
        <div className="absolute right-0 top-full w-52 bg-white border border-gray-200 shadow-lg rounded p-4 z-50">
          <p className="text-lg text-[var(--color-dark-orange)] text-center break-words">{user.name}</p>
          <hr className="my-2 text-gray-400" />

          <div className="text-sm flex flex-col gap-1">
            {menuItems.map(({ path, label, icon }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setOpen(false)}
                className="flex items-center gap-x-3 py-1 hover:text-orange-600 transition-colors"
              >
                {icon}
                {label}
              </Link>
            ))}
          </div>

          <button
            onClick={handleLogout}
            type="button"
            className="flex items-center gap-x-3 py-1 mt-2 text-sm hover:text-orange-600 transition-colors"
          >
            <LuLogOut />
            Çıkış Yap
          </button>
        </div>
      )}
    </div>
  );
};

export default AccountMenu;
