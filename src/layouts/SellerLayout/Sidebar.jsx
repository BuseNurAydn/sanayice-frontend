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
import { MdStorefront, MdVerifiedUser, MdViewCarousel, MdLocalOffer, MdSupport } from "react-icons/md";

const menuItems = [
  {
    label: "Satış Yönetim Paneli",
    to: "/seller/dashboard",
    icon: <BsFileBarGraphFill />,
  },
  {
    label: "Mağazam",
    to: "/seller/store",
    icon: <MdStorefront />,
  },
  {
    label: "Siparişler",
    to: "/seller/orders",
    icon: <BsHandbagFill />,
  },
  {
    label: "Ürünler",
    to: "/seller/products",
    icon: <AiFillProduct />,
    subMenu: [
      {
        label: "Ürün Ekleme",
        to: "/seller/products/add",
        icon: <FaPlus />,
      }
    ],
  },
  {
    label: "Satıcı Doğrulama",
    to: "/seller/seller-verification",
    icon: <MdVerifiedUser />,
  },
  {
    label: "Kategoriler",
    to: "/seller/categories",
    icon: <BiSolidCategory />,
    subMenu: [
      {
        label: "Kategori Ekleme",
        to: "/seller/categories/add",
        icon: <FaPlus />,
      }
    ],
  },
  {
    label: "Banner Yönetimi",
    to: "/seller/banner_management",
    icon: <MdViewCarousel />,
  },
  {
    label: "Kupon Ve Kampanya Yönetimi",
    to: "/seller/coupon_campaign_management",
    icon: <MdLocalOffer />,
  },
  {
    label: "Destek Ve Geri Bildirim Yönetimi",
    to: "/seller/support_management",
    icon: <MdSupport />,
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
      return item.label !== "Kategoriler" && item.label !== "Satıcı Doğrulama" && 
             item.label !== "Banner Yönetimi" && item.label !== "Kupon Ve Kampanya Yönetimi" && item.label !== "Destek Ve Geri Bildirim Yönetimi";
    } else if (role === "ROLE_MANAGER") {
      return item.label === "Satıcı Doğrulama" || item.label === "Kategoriler" || 
             item.label === "Banner Yönetimi" || item.label === "Kupon Ve Kampanya Yönetimi" || item.label === "Destek Ve Geri Bildirim Yönetimi";
    } else {
      return true;
    }
  });

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200"
        onClick={() => setIsMobileOpen(true)}
      >
        <GiHamburgerMenu className="w-5 h-5 text-gray-700" />
      </button>

      {/* Sidebar */}
      <aside
        className={`${
          collapsed ? "w-20" : "w-64"
        } bg-gradient-to-b from-slate-50 to-slate-100 border-r border-slate-200 min-h-screen 
        overflow-y-auto fixed top-0 left-0 z-40 transition-all duration-300 ease-in-out shadow-lg
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:block`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-white/50">
          {!collapsed && (
            <h2 className="text-lg font-semibold text-slate-800 truncate">
              Yönetim Paneli
            </h2>
          )}
          
          {/* Toggle Button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex items-center justify-center w-8 h-8 rounded-lg 
            bg-slate-200 hover:bg-slate-300 text-slate-600 transition-colors duration-200"
            aria-label={collapsed ? "Sidebar aç" : "Sidebar kapat"}
          >
            {collapsed ? (
              <BsChevronDoubleRight className="w-4 h-4" />
            ) : (
              <BsChevronDoubleLeft className="w-4 h-4" />
            )}
          </button>

          {/* Mobile Close Button */}
          <button
            className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg 
            bg-slate-200 hover:bg-slate-300 text-slate-600 transition-colors duration-200"
            onClick={() => setIsMobileOpen(false)}
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1">
          {filteredMenuItems.map(({ label, to, icon, subMenu }) => {
            const isOpen = openSubMenus[label];
            const hasSubMenu = !!subMenu;

            return (
              <div key={label} className="space-y-1">
                {/* Main Menu Item */}
                <Link
                  to={to}
                  onClick={(e) => {
                    if (hasSubMenu) {
                      e.preventDefault();
                      toggleSubMenu(label);
                      navigate(to);
                    }
                    if (window.innerWidth < 768) {
                      setIsMobileOpen(false);
                    }
                  }}
                  className="group flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 
                  hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 
                  hover:shadow-sm active:scale-[0.98]"
                  title={collapsed ? label : ""}
                >
                  <div className="flex-shrink-0 text-slate-500 group-hover:text-blue-600 transition-colors duration-200">
                    {icon}
                  </div>
                  
                  {!collapsed && (
                    <>
                      <span className="flex-1 font-medium text-sm truncate">
                        {label}
                      </span>
                      {hasSubMenu && (
                        <div className="flex-shrink-0 text-slate-400 group-hover:text-blue-500 transition-colors duration-200">
                          {isOpen ? (
                            <IoIosArrowUp className="w-4 h-4" />
                          ) : (
                            <IoIosArrowDown className="w-4 h-4" />
                          )}
                        </div>
                      )}
                    </>
                  )}
                </Link>

                {/* Sub Menu */}
                {hasSubMenu && isOpen && !collapsed && (
                  <div className="ml-8 space-y-1 animate-fadeIn">
                    {subMenu.map(({ label: subLabel, to: subTo, icon: subIcon }) => (
                      <Link
                        key={subLabel}
                        to={subTo}
                        onClick={() => {
                          if (window.innerWidth < 768) {
                            setIsMobileOpen(false);
                          }
                        }}
                        className="group flex items-center gap-2 px-3 py-2 rounded-lg text-slate-600 
                        hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-200 
                        text-sm active:scale-[0.98]"
                        title={subLabel}
                      >
                        <div className="flex-shrink-0 text-slate-400 group-hover:text-emerald-600 transition-colors duration-200">
                          {subIcon}
                        </div>
                        <span className="font-medium truncate">{subLabel}</span>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Collapsed Sub Menu Indicator */}
                {hasSubMenu && collapsed && (
                  <div className="flex justify-center">
                    <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </>
  );
};

export default Sidebar;