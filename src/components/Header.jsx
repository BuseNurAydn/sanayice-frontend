import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { useDispatch } from "react-redux";
import Logo from "../../src/assets/png/Logo2.png";
import { FaShoppingCart } from "react-icons/fa";
import { RxTriangleDown, RxTriangleUp } from "react-icons/rx";
import AccountMenu from "../pages/customer/AccountPage/AccountMenu";
import { useEffect, useState } from 'react'
import { fetchCart, addToCart } from "../services/cartService";
import { toast } from "react-toastify"
import { fetchFavorites, addToFavorites } from "../services/favoritesService";

const Header = ({ categories = [] }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false); // Hamburger menü durumu


  const [shouldRenderMenu, setShouldRenderMenu] = useState(false); // Menü DOM'da mı
  const [menuVisible, setMenuVisible] = useState(false);           // Menü görünür mü (translate-x-0)
  
  const [expanded, setExpanded] = useState(null);
  const favoriteItems = useSelector(state => state.favorites.items);
  const favoriteCount = favoriteItems.length;
  const cartItems = useSelector((state) => state.cart.items);
  const totalQuantity = Array.isArray(cartItems)
    ? cartItems.reduce((total, item) => total + item.quantity, 0)
    : 0;

  const searchHistory = [
    "elektrik tesisat malzemeleri",
    "hidrolik sistemler",
    "elektrik malzemeleri",
    "güvenlik alarm",
  ];

  const popularSearches = ["iphone 13", "klima", "stanley termos", "kamera"];

  useEffect(() => {
    dispatch(fetchFavorites());
    dispatch(fetchCart());
  }, [dispatch]);

  useEffect(() => {
    const pendingCartItem = localStorage.getItem("pendingCartItem");
    const pendingFavoriteItem = localStorage.getItem("pendingFavoriteItem");

    if (pendingCartItem) {
      const item = JSON.parse(pendingCartItem);
      dispatch(addToCart(item))
        .unwrap()
        .then(() => {
          toast.success("Ürün sepete eklendi");
          localStorage.removeItem("pendingCartItem");
          dispatch(fetchCart());
        });
    }
    if (pendingFavoriteItem) {
      const productId = Number(pendingFavoriteItem);
      dispatch(addToFavorites(productId))
        .unwrap()
        .then(() => {
          toast.success("Ürün favorilere eklendi");
          localStorage.removeItem("pendingFavoriteItem");
          dispatch(fetchFavorites());
        })
    }
  }, []);

  // Menü açılış animasyonu için efekt
  useEffect(() => {
    if (menuOpen) {
      setShouldRenderMenu(true);          
      setTimeout(() => {
        setMenuVisible(true);            
      }, 10);                           
    } else {
      setMenuVisible(false);           
      setTimeout(() => {
        setShouldRenderMenu(false);     
      }, 300);                        
    }
  }, [menuOpen]);

  return (
    <header className="bg-white shadow-sm py-4 sticky top-0 z-30">
      <div className="container mx-auto px-4 2xl:px-30 flex items-center justify-between">

        {/* Hamburger Menü (Mobilde) */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(true)}
            className="text-gray-700 focus:outline-none"
            aria-label="Mobil Menü Aç"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Logo */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <img
            src={Logo}
            alt="Logo"
            className="w-[160px] h-auto rounded-lg object-contain cursor-pointer"
            onClick={() => navigate('/')}
          />
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-full md:max-w-2xl mx-0 md:mx-6 w-full">
          <div className="flex items-center relative w-full md:max-w-2xl mx-0 md:mx-6">
            {/* Arama ikonu */}
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10 text-gray-700"
              onClick={() => {
                if (window.innerWidth < 768) {
                  setShowSuggestions(true);
                }
              }}
            >
              <svg
                className="w-5 h-5 md:w-6 md:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" strokeWidth="2" />
                <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>

            {/* Masaüstünde input */}
            <input
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              className="hidden md:block w-full border border-gray-200 rounded-xl px-4 py-2 pr-10 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition-all duration-200 text-base mr-2"
              placeholder="Ürün, kategori veya marka ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {showSuggestions && (
            <div className="absolute z-50 w-full md:w-2xl bg-white rounded-xl shadow-lg mt-2 p-4 space-y-4">
              {/* Geçmiş aramalar */}
              <div>
                <div className="flex justify-between items-center text-gray-600 text-xs md:text-sm font-medium mb-1">
                  <span>Geçmiş aramalarım</span>
                  <button className="text-red-500 text-xs">Temizle</button>
                </div>
                <ul className="text-gray-700 space-y-1 text-xs md:text-sm">
                  {searchHistory.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 cursor-pointer hover:text-orange-500"
                    >
                      <svg
                        width="16"
                        height="16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="8" cy="8" r="6" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Popüler aramalar */}
              <div>
                <div className="text-gray-600 text-xs md:text-sm font-medium mb-1">
                  Popüler aramalar
                </div>
                <div className="flex flex-wrap gap-2 text-xs md:text-sm">
                  {popularSearches.map((item, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 text-xs md:text-sm bg-gray-100 rounded-full cursor-pointer hover:bg-orange-100"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Favoriler, Sepet ve Hesap */}
        <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
          {/* Favoriler Butonu */}
          <button
            className="relative md:bg-gray-100 md:hover:bg-gray-200 p-2 md:p-3 rounded-xl transition-colors duration-200 transform hover:scale-105 cursor-pointer"
            onClick={() => navigate("/favorite")}
            aria-label="Favorilerim"
          >
            <svg
              width={20}
              height={20}
              fill="none"
              stroke="currentColor"
              className="text-gray-700"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 18l-1.45-1.32C4.4 12.36 2 10.28 2 7.5 2 5.42 3.42 4 5.5 4c1.54 0 3.04 1.04 3.57 2.36h1.87C13.46 5.04 14.96 4 16.5 4 18.58 4 20 5.42 20 7.5c0 2.78-2.4 4.86-6.55 9.18L10 18z" />
            </svg>
            {favoriteCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {favoriteCount}
              </span>
            )}
          </button>

          {/* Sepet Butonu */}
          <button
            onClick={() => navigate('/cart')}
            className="md:bg-orange-500 md:hover:bg-orange-600 text-white p-2 md:px-6 md:py-3 rounded-xl md:font-semibold font-medium transition-colors duration-200 transform hover:scale-105 relative flex items-center space-x-1 md:space-x-2 cursor-pointer "
            aria-label="Sepetim"
          >
            <FaShoppingCart className="md:mr-2 text-blue-700 md:text-white w-5 h-5" />
            <span className="hidden md:inline">Sepetim</span>
            {totalQuantity > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {totalQuantity}
              </span>
            )}
          </button>

          {/* Hesabım */}
          <div className="block">
            <AccountMenu />
          </div>
        </div>

        {/* Menü */}
        {shouldRenderMenu && (
          <>
            {/* Kapatmak için overlay */}
            <div
              className="fixed inset-0 bg-opacity-50 z-40"
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
            ></div>

            <nav
              className={`fixed top-0 left-0 w-64 h-full bg-white shadow-xl z-50 p-6 overflow-y-auto border-r border-gray-100 transform transition-transform duration-300
                ${menuVisible ? "translate-x-0" : "-translate-x-full"}
              `}
              aria-label="Mobil Kategori Menüsü"
            >
              {/* Kapat Butonu */}
              <button
                onClick={() => setMenuOpen(false)}
                className="mb-6 text-white bg-orange-500 hover:bg-orange-600 transition-colors duration-200 px-2 py-1 rounded-lg flex items-end gap-2 text-sm font-medium"
                aria-label="Menüyü Kapat"
              >
                ✕
              </button>

              {/* Kategori Listesi */}
              <ul className="space-y-4">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <div className="flex justify-between items-center py-2 px-1 rounded-lg hover:bg-orange-50 transition-colors duration-200 cursor-pointer">
                      <a
                        href={`/category/${cat.id}`}
                        className="text-gray-800 text-[10px] font-semibold"
                        onClick={() => setMenuOpen(false)}
                      >
                        {cat.name}
                      </a>

                      {/* Alt Kategori Toggle */}
                      {cat.subcategories?.length > 0 && (
                        <button
                          className="text-gray-400 hover:text-orange-500 transition-colors"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setExpanded((prev) => (prev === cat.id ? null : cat.id));
                          }}
                        >
                          {expanded === cat.id ? <RxTriangleUp /> : <RxTriangleDown />}
                        </button>
                      )}
                    </div>

                    {/* Alt Kategoriler */}
                    {expanded === cat.id && (
                      <ul className="ml-4 mt-2 space-y-2 border-l-2 border-orange-200 pl-4">
                        {cat.subcategories.map((sub) => (
                          <li key={sub.id}>
                            <a
                              href={`/category/${cat.id}`}
                              className="text-gray-600 hover:text-orange-500 text-xs font-medium block transition-colors duration-200"
                              onClick={() => setMenuOpen(false)}
                            >
                              {sub.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </>
        )}
      </div>
    </header>
  );
};
export default Header;
