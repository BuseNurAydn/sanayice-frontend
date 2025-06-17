import { NavLink } from "react-router-dom";
import { useSelector} from "react-redux";
import { FaShoppingBag, FaMapMarkerAlt, FaStar,FaUserCircle, FaSignOutAlt } from "react-icons/fa";

// Sidebar Component
const Sidebar = () => {
    const user = useSelector((state) => state.auth.user); //user bilgisini alıyoruz

    const menuItems = [
        { to: "orders", label: "Siparişlerim", icon: <FaShoppingBag /> },
        { to: "addresses", label: "Adres Bilgilerim", icon: <FaMapMarkerAlt /> },
        { to: "reviews", label: "Değerlendirmelerim", icon: <FaStar /> },
        { to: "support_and_complaint", label: "Destek ve Şikayet", icon: <FaStar /> },
    ];

    const handleLogout = () => {
        console.log("Kullanıcı çıkış yaptı");
    };

    return (
        <div className="w-64 min-h-screen bg-white shadow-lg rounded-lg p-6 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-6">
                <FaUserCircle className="text-orange-600 text-3xl" />
                <p className="text-gray-800 font-bold text-lg break-words">{user?.name || "Kullanıcı Adı"}</p>
            </div>
            <div className="w-full h-[1px] bg-gray-200 mb-6"></div>
            <ul className="space-y-3 flex-grow">
                {menuItems.map((item) => (
                    <li key={item.to}>
                        <NavLink
                            to={item.to}
                            className={({ isActive }) =>
                                `flex items-center gap-4 p-3 rounded-md transition-all duration-200
                                ${isActive ? "bg-orange-100 text-orange-700 font-semibold shadow-sm" : "text-gray-700 hover:bg-gray-50 hover:text-orange-600"}`
                            }
                        >
                            {item.icon}
                            <span className="text-base">{item.label}</span>
                        </NavLink>
                    </li>
                ))}
            </ul>
            <div className="w-full h-[1px] bg-gray-200 mt-6 mb-4"></div>
            <button
                onClick={handleLogout}
                className="flex items-center gap-4 p-3 rounded-md text-red-500 hover:bg-red-50 transition-all duration-200 font-medium"
            >
                <FaSignOutAlt />
                <span className="text-base">Çıkış Yap</span>
            </button>
        </div>
    );
};


export default Sidebar;