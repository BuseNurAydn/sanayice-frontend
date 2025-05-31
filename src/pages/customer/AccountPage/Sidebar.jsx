import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaShoppingBag, FaMapMarkerAlt, FaStar } from "react-icons/fa";

const Sidebar = () => {
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();

    const menuItems = [
        { to: "orders", label: "Siparişlerim",icon: <FaShoppingBag />  },
        { to: "addresses", label: "Adres Bilgilerim",icon: <FaMapMarkerAlt /> },
        { to: "reviews", label: "Değerlendirmelerim",icon: <FaStar /> },
    ];

    return (
        <div className="w-64 bg-white shadow rounded">
            <p className="text-orange-600 font-semibold p-4 break-words">{user.name}</p> 
            <div className="w-full h-[1px] bg-gray-300 mb-4"></div>
            <ul className="space-y-4 p-2">
                {menuItems.map((item) => (
                    <li key={item.to}>
                        <NavLink
                            to={item.to}
                            className={({ isActive }) =>
                                `flex items-center gap-4 p-2 rounded hover:bg-orange-100 ${isActive ? "text-orange-600  font-semibold" : "text-gray-700"
                                }`
                            }
                        >
                            {item.icon}
                            {item.label}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </div>
    );
};
export default Sidebar;
