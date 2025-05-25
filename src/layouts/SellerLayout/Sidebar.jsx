import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsChevronDoubleRight, BsChevronDoubleLeft } from "react-icons/bs";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { BsFileBarGraphFill, BsHandbagFill } from "react-icons/bs";
import { AiFillProduct } from "react-icons/ai";
import { BiSolidCategory } from "react-icons/bi";
import { FaPlus } from "react-icons/fa6";
import { GiHamburgerMenu } from "react-icons/gi";
import { useSelector } from "react-redux";

const menuItems = [
  {
    label: "Satış Yönetim Paneli",
    to: "/seller/dashboard",
    icon: <BsFileBarGraphFill className="w-6 h-6" />,
  },
  {
    label: "Siparişler",
    to: "/seller/orders",
    icon: <BsHandbagFill className="w-6 h-6" />,
  },
  {
    label: "Ürünler",
    to: "/seller/products",
    icon: <AiFillProduct className="w-6 h-6" />,
    subMenu: [
      {
        label: "Ürün Ekleme",
        to: "/seller/products/add",
        icon: <FaPlus className="w-5 h-5" />,
      }   
    ],
  },
  {
    label: "Kategoriler",
    to: "/seller/categories",
    icon: <BiSolidCategory className="w-6 h-6" />,
    subMenu: [
      {
        label: "Kategori Ekleme",
        to: "/seller/categories/add",
        icon: <FaPlus className="w-5 h-5" />,
        
      }   
    ],
  },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [openSubMenus, setOpenSubMenus] = useState({});
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();
  const role = useSelector((state) => state.auth.user?.role);

  const toggleSubMenu = (label) => {
    setOpenSubMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  // Role göre filtreleme
  const filteredMenuItems = menuItems.filter((item) => {
    if (role === "ROLE_SELLER") {
      return item.label !== "Kategoriler";
    } else if (role === "ROLE_MANAGER") {
      return item.label === "Kategoriler";
    } else {
      // Diğer roller için hepsi görsün
      return true;
    }
  });

  return (
    <>
      {/* Mobil Buton */}
      <button
        className="md:hidden absolute top-4 left-6 z-50 text-2xl text-gray-700"
        onClick={() => setIsMobileOpen(true)}
      >
        <GiHamburgerMenu />
      </button>

      {/* Sidebar */}
      <aside
        className={`${collapsed ? "w-[80px]" : "w-[240px]"
          } bg-gray-200 p-4 min-h-screen overflow-y-auto fixed top-0 left-0 z-40 transition-transform duration-300
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:block`}
      >
        {/* Kapatma X butonu sadece mobilde */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:block text-gray-600 text-xl ml-auto"
            aria-label={collapsed ? "Sidebar aç" : "Sidebar kapat"}
          >
            {collapsed ? <BsChevronDoubleRight /> : <BsChevronDoubleLeft />}
          </button>
          {!collapsed && (
            <button
              className="md:hidden text-gray-600 text-lg absolute top-4 right-4 z-50"
              onClick={() => setIsMobileOpen(false)}
            >
              X
            </button>
          )}
        </div>
       <nav className="flex flex-col space-y-4 pt-8 md:pt-0">
          {filteredMenuItems.map(({ label, to, icon, subMenu }) => {
            const isOpen = openSubMenus[label];
            const hasSubMenu = !!subMenu;

            return (
              <div key={label} className="flex flex-col">
                <Link
                  to={to}
                  onClick={(e) => {
                    if (hasSubMenu) {
                      e.preventDefault();
                      toggleSubMenu(label);
                      navigate(to);
                      if (window.innerWidth < 768) {
                        setIsMobileOpen(false); // mobilde menüyü kapat
                      }
                    } else {
                      if (window.innerWidth < 768) {
                        setIsMobileOpen(false); // mobilde menüyü kapat
                      }
                    }
                  }}
                  className="hover:bg-gray-300 p-2 rounded flex items-center gap-2 w-full"
                  title={collapsed ? label : ""}
                >
                  {icon}
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left">{label}</span>
                      {hasSubMenu &&
                        (isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />)}
                    </>
                  )}
                </Link>

                {/* Alt Menü */}
                {hasSubMenu && isOpen && (
                  <div
                    className={`flex flex-col space-y-2 mt-2 ${collapsed ? "ml-2" : "ml-6"
                      }`}
                  >
                    {subMenu.map(({ label: subLabel, to: subTo, icon: subIcon }) => (
                      <Link
                        key={subLabel}
                        to={subTo}
                        onClick={() => {
                          if (window.innerWidth < 768) {
                            setIsMobileOpen(false); // mobilde menüyü kapat
                          }
                        }}
                        className={`hover:bg-gray-300 p-2 rounded text-sm ${collapsed ? "text-[10px]" : ""
                          }`}
                        title={collapsed ? subLabel : ""}
                      >
                        {!collapsed ? subLabel : subIcon}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
};
export default Sidebar;
