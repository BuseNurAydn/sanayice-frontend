import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from '../../../store/authSlice';
import { clear } from '../../../store/cartSlice';
import { clearFavorites } from '../../../store/favoritesSlice';
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { FiStar } from "react-icons/fi";
import { FaRegUser } from "react-icons/fa6";
import { LuCircleUserRound } from "react-icons/lu";
import { BsChatSquareDots } from "react-icons/bs";
import { TfiPackage } from "react-icons/tfi";
import { SlLocationPin } from "react-icons/sl";

const Sidebar = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const menuItems = [
    { to: "profilim", label: "Hesap Bilgilerim", icon: <FaRegUser /> },
    { to: "siparislerim", label: "Siparişlerim", icon: <TfiPackage /> },
    { to: "adreslerim", label: "Adres Bilgilerim", icon: <SlLocationPin /> },
    { to: "degerlendirmelerim", label: "Değerlendirmelerim", icon: <FiStar /> },
    { to: "takip-edilenler", label: "Takip Ettiklerim", icon: <LuCircleUserRound /> },
    { to: "destek-sikayet", label: "Destek ve Şikayet", icon: <BsChatSquareDots /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("pendingFavoriteItem");
    localStorage.removeItem("pendingCartItem");
    dispatch(clear());
    dispatch(clearFavorites());
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col md:w-64 w-full md:min-h-screen">
      {/* Kullanıcı Bilgisi */}
      <div className="flex items-center justify-center gap-3 mb-4 md:mb-6 w-full">
        <FaUserCircle className="text-orange-600 text-2xl md:text-3xl" />
        <p className="text-gray-800 font-bold md:text-lg break-words block flex-1">
          {user?.name || "Kullanıcı Adı"}
        </p>
        {/* Mobil Çıkış İkonu */}
        <button
          onClick={handleLogout}
          className="block md:hidden text-red-500 hover:text-red-700 transition-colors ml-auto"
          aria-label="Çıkış Yap"
        >
          <FaSignOutAlt className="w-5 h-5" />
        </button>
      </div>

      <div className="w-full h-[1px] bg-gray-200 mb-4 md:mb-6" />

      {/* MENÜLER: Mobil Kart (Grid), Masaüstü Dikey (Flex/Col) */}
      <ul className="grid grid-cols-3 gap-3 md:flex md:flex-col md:space-y-3 w-full">
        {menuItems.map((item) => (
          <li key={item.to} className="w-full">
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                // Mobil Kart Stili
                `flex flex-col items-center justify-center h-full p-2 rounded-md transition-all duration-200 text-xs md:text-base border border-gray-200 bg-gray-50 hover:bg-orange-100 
                  ${
                // Aktif Mobil Kart Stili
                isActive
                  ? "text-orange-600 font-semibold shadow-inner border-orange-300 bg-orange-50"
                  : "text-gray-700"
                }

                  // Masaüstü (md:) Listeleme Stili - Mobil stilleri ezer
                  md:flex-row md:justify-start md:p-3 md:bg-white md:border-0
                  md:hover:bg-orange-50 md:text-gray-700
                  ${
                // Aktif Masaüstü Listeleme Stili
                isActive
                  ? "md:bg-orange-300 md:text-orange-600 md:font-semibold md:shadow-sm"
                  : "md:text-gray-700"
                }
                `
              }
            >
              {/* İkon - Mobil ve Masaüstü için farklı boyut/margin */}
              <span className="text-xl mb-1 md:text-lg md:mr-4">
                {item.icon}
              </span>

              {/* Mobil Label*/}
              <span className="block md:hidden leading-tight text-center whitespace-normal">
                {item.label}
              </span>

              {/* Masaüstü Label (Tek Satır) */}
              <span className="hidden md:inline">{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Çıkış Butonu (Sadece Masaüstü) */}
      <div className="hidden md:block w-full mt-auto">
        <div className="w-full h-[1px] bg-gray-200 mt-4 md:mt-6 mb-2 md:mb-4" />
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-4 p-3 rounded-md text-red-500 hover:bg-red-50 transition-all duration-200 font-medium text-base w-full"
        >
          <FaSignOutAlt />
          <span>Çıkış Yap</span>
        </button>
      </div>
    </div>
  );
};
export default Sidebar;