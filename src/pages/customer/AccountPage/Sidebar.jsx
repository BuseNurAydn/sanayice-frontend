import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from '../../../store/authSlice';
import {clear} from '../../../store/cartSlice';
import { clearFavorites } from '../../../store/favoritesSlice';
import {FaShoppingBag,FaMapMarkerAlt,FaStar,FaUserCircle,FaSignOutAlt,FaUser} from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";

const Sidebar = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const menuItems = [
    { to: "profilim", label: "Profil Bilgilerim", icon: <FaUser /> },
    { to: "siparislerim", label: "Siparişlerim", icon: <FaShoppingBag /> },
    { to: "adreslerim", label: "Adres Bilgilerim", icon: <FaMapMarkerAlt /> },
    { to: "degerlendirmelerim", label: "Değerlendirmelerim", icon: <FaStar /> },
    { to: "takip-edilenler", label: "Takip Ettiklerim", icon: <FaUserCircle /> },
    { to: "destek-sikayet", label: "Destek ve Şikayet", icon: <FaMessage /> },
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
    <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col md:w-64 w-full md:min-h-screen items-center">
      {/* Kullanıcı Bilgisi */}
      <div className="flex items-center gap-3 mb-4 md:mb-6">
        <FaUserCircle className="text-orange-600 text-2xl md:text-3xl" />
        <p className="text-gray-800 font-bold text-lg break-words hidden md:block">
          {user?.name || "Kullanıcı Adı"}
        </p>
      </div>

      <div className="w-full h-[1px] bg-gray-200 mb-4 md:mb-6" />

      {/* Menüler */}
      <ul className="flex md:flex-col flex-row md:space-y-3 space-x-4 md:space-x-0 w-full justify-around md:justify-start">
        {menuItems.map((item) => (
          <li key={item.to} className="w-full">
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `flex items-center md:justify-start justify-center gap-2 md:gap-4 p-2 md:p-3 rounded-md transition-all duration-200 text-lg md:text-base ${
                  isActive
                    ? "bg-orange-100 text-orange-700 font-semibold shadow-sm"
                    : "text-gray-700 hover:bg-gray-50 hover:text-orange-600"
                }`
              }
            >
              {item.icon}
              <span className="hidden md:inline">{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="w-full h-[1px] bg-gray-200 mt-4 md:mt-6 mb-2 md:mb-4" />

      {/* Çıkış Butonu */}
      <button
        onClick={handleLogout}
        className="flex items-center justify-center md:justify-start gap-2 md:gap-4 p-2 md:p-3 rounded-md text-red-500 hover:bg-red-50 transition-all duration-200 font-medium text-lg md:text-base cursor-pointer"
      >
        <FaSignOutAlt />
        <span className="hidden md:inline">Çıkış Yap</span>
      </button>
    </div>
  );
};

export default Sidebar;

