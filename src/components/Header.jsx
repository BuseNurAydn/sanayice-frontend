import { useNavigate, Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import { useDispatch } from "react-redux";
import sanayice from "../../src/assets/png/sanayice.png";
import { IoCartOutline } from "react-icons/io5";
import { MdOutlineStorefront } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa6";
import { RxTriangleDown, RxTriangleUp } from "react-icons/rx";
import AccountMenu from "../pages/customer/AccountPage/AccountMenu";
import { useEffect, useState } from 'react'
import { fetchCart, addToCart } from "../services/cartService";
import { toast } from "react-toastify"
import { fetchFavorites, addToFavorites } from "../services/favoritesService";
import { generateCategoryUrl, generateSubCategoryUrl } from "../utils/urlHelpers";
import { FaRegUser } from "react-icons/fa";

const Header = ({ categories = [] }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const user = useSelector(state => state.auth.user); // redux store

  const [shouldRenderMenu, setShouldRenderMenu] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

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
    <header className="bg-white shadow-sm">

      {/* 1. EN ÜST BAR: Giriş/Kayıt Ol ve Satıcı Ol Butonları */}
      {/* Kullanıcı giriş yapmamışsa hem mobilde hem masaüstünde görünüyor */}
      {!user && (
        <div className="bg-gray-100 border-b border-gray-200">
          <div className="container mx-auto max-w-7xl px-4 md:px-0 flex justify-end items-center py-2 gap-4">
            
            {/* Giriş / Kayıt Ol Butonu */}
            <button
              onClick={() => navigate("/giris-kaydol/giris-yap")}
              className="text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <FaRegUser className="w-4 h-4" />
              <span>Giriş / Üye Ol</span>
            </button>

            {/* Satıcı Ol / Giriş Butonu */}
            <button
              onClick={() => navigate('/giris-kaydol/satici/uye-ol')}
              className="text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors cursor-pointer flex items-center gap-1"
              aria-label="Satıcı Ol / Giriş"
            >
              <MdOutlineStorefront className="w-5 h-5" />
              <span>Satıcı Ol / Giriş</span>
            </button>

          </div>
        </div>
      )}
      
      {/* ANA HEADER : Logo, Favoriler, Sepet, Hesap/Giriş (Mobile: Menü, Logo, İkonlar) */}
      <div className="py-4">
        <div className="container mx-auto max-w-7xl px-4 md:px-0 flex items-center justify-between">

          {/* Hamburger Menü (Mobilde)*/}
          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
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
            <img
              src={sanayice}
              alt="Logo"
              className="h-14 w-auto cursor-pointer"
              onClick={() => navigate('/')}
            />
          </div>

          {/* Search Bar ( Masaüstü) */}
          <div className="flex-1 max-w-full md:max-w-2xl mx-0 md:mx-8 w-full hidden md:block">
            <div className="flex items-center relative w-full">
              {/* Arama ikonu */}
              <button
                className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10 text-gray-700"
              >
                <svg
                  className="w-6 h-6"
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
                className="w-full border border-gray-200 rounded-md px-4 py-2 pr-10 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition-all duration-200 text-base"
                placeholder="Ürün, kategori veya marka ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {showSuggestions && (
              <div className="absolute z-50 w-full md:w-[670px] bg-white rounded-xl shadow-lg mt-2 p-4 space-y-4">
                {/* Geçmiş aramalar */}
                <div>
                  <div className="flex justify-between items-center text-gray-600 text-sm font-medium mb-1">
                    <span>Geçmiş aramalarım</span>
                    <button className="text-red-500 text-xs">Temizle</button>
                  </div>
                  <ul className="text-gray-700 space-y-1 text-sm">
                    {searchHistory.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 cursor-pointer hover:text-orange-500"
                        onMouseDown={() => {setSearchQuery(item); setShowSuggestions(false);}}
                      >
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="8" cy="8" r="6" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Popüler aramalar */}
                <div>
                  <div className="text-gray-600 text-sm font-medium mb-1">
                    Popüler aramalar
                  </div>
                  <div className="flex flex-wrap gap-2 text-sm">
                    {popularSearches.map((item, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-gray-100 rounded-full cursor-pointer hover:bg-orange-100 text-xs"
                        onMouseDown={() => {setSearchQuery(item); setShowSuggestions(false);}}
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
          <div className="flex items-center md:gap-4 flex-shrink-0">
            {/* Favoriler Butonu */}
            <button
              className="relative md:bg-gradient-to-r from-red-400 to-orange-400 text-white p-2 md:px-4 md:py-2 rounded-md md:font-semibold font-medium transition-colors duration-200 transform hover:scale-105 cursor-pointer flex items-center space-x-1 md:space-x-2"
              onClick={() => navigate("/favorilerim")}
              aria-label="Favorilerim"
            >
              <FaRegHeart size={20} className="text-gray-800 md:text-white" />
              <span className="hidden md:inline">Favorilerim</span>
              {favoriteCount > 0 && (
                <span className="absolute -top-1 -right-1 md:-top-2 md:-right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {favoriteCount}
                </span>
              )}
            </button>

            {/* Sepet Butonu */}
            <button
              onClick={() => navigate('/sepetim')}
              className="md:bg-orange-500 md:hover:bg-orange-600 text-white p-2 md:px-4 md:py-2 rounded-md md:font-semibold font-medium transition-colors duration-200 transform hover:scale-105 relative flex items-center space-x-1 md:space-x-2 cursor-pointer"
              aria-label="Sepetim"
            >
              <IoCartOutline className="text-gray-800 w-6 h-6 stroke-[1.5] md:text-white" />
              <span className="hidden md:inline">Sepetim</span>
              {totalQuantity > 0 && (
                <span className="absolute -top-0 -right-0 md:-top-2 md:-right-2 bg-pink-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {totalQuantity}
                </span>
              )}
            </button>

            {/* Hesabım (Giriş Yapılmışsa - Masaüstü ve Mobil) */}
            {/* Kullanıcı giriş yapmışsa, AccountMenu (Hesabım) her iki yerde de görünür. */}
            {user && (
              <div className="block">
                <AccountMenu />
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* MOBİL ARAMA */}
      <div className="container mx-auto max-w-7xl px-4 pb-4 md:hidden">
        <div className="flex items-center relative w-full">
            {/* Arama ikonu */}
            <button
                className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10 text-gray-700"
                onClick={() => setShowSuggestions(true)}
            >
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <circle cx="11" cy="11" r="8" strokeWidth="2" />
                    <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
                </svg>
            </button>

            {/* Mobil input */}
            <input
                onFocus={() => setShowSuggestions(true)}
                className="w-full border border-gray-200 rounded-md px-4 py-2 pr-10 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition-all duration-200 text-sm"
                placeholder="Ürün, kategori veya marka ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            
            {/* Mobil Arama Önerileri (Input'a odaklanınca açılan full-screen menü) */}
            {showSuggestions && (
            <div className="fixed inset-0 top-0 z-40 bg-white md:hidden p-4 overflow-y-auto">
                <div className="flex items-center relative mb-4">
                    {/* Geri butonu */}
                    <button onClick={() => setShowSuggestions(false)} className="mr-2 text-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                    </button>
                 
                    <input
                      className="w-full border border-gray-300 rounded-md px-4 py-2 pr-10 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
                      placeholder="Ürün, kategori veya marka ara..."
                      autoFocus
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                     {/* Kapat butonu, menüden çıkmak için */}
                    <button
                        onClick={() => setShowSuggestions(false)}
                        className="absolute right-3 text-gray-400 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>
                
                {/* Geçmiş aramalar */}
                <div>
                  <div className="flex justify-between items-center text-gray-600 text-sm font-medium mb-2">
                    <span>Geçmiş aramalarım</span>
                    <button className="text-red-500 text-xs">Temizle</button>
                  </div>
                  <ul className="text-gray-700 space-y-2 text-sm">
                    {searchHistory.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 cursor-pointer hover:text-orange-500"
                        onClick={() => {setSearchQuery(item); setShowSuggestions(false);}}
                      >
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="8" cy="8" r="6" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Popüler aramalar */}
                <div className="mt-6">
                  <div className="text-gray-600 text-sm font-medium mb-2">
                    Popüler aramalar
                  </div>
                  <div className="flex flex-wrap gap-2 text-sm">
                    {popularSearches.map((item, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-gray-100 rounded-full cursor-pointer hover:bg-orange-100 text-xs"
                        onClick={() => {setSearchQuery(item); setShowSuggestions(false);}}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
            </div>
            )}
        </div>
      </div>

        {/* Mobil Kategori Menüsü (Hamburger) */}
        {shouldRenderMenu && (
          <>
            {/* Kapatmak için overlay */}
            <div
              className="fixed inset-0 bg-black/50 bg-opacity-50 z-40"
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
                      <Link
                        to={generateCategoryUrl(cat)}
                        onClick={() => setMenuOpen(false)}
                        className="text-gray-800 text-[12px] font-semibold"
                      >
                        {cat.name}
                      </Link>


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
                            <Link
                              to={generateSubCategoryUrl(sub, cat)}
                              onClick={() => setMenuOpen(false)}
                              className="text-gray-600 hover:text-orange-500 text-xs font-medium block transition-colors duration-200"
                            >
                              {sub.name}
                            </Link>

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
    </header>
  );
};
export default Header;