import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../src/assets/png/Logo2.png";

const Header = ({ searchQuery, setSearchQuery }) => {
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
        <img
            src={Logo}
            alt="Logo"
            className="rounded-lg object-contain cursor-pointer"
            onClick={() => navigate('/')}
        />
        </div>

      <div className="flex-1 max-w-2xl mx-6">
        <div className="relative">
          <input
            className="w-full border border-gray-200 rounded-xl px-5 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition-all duration-200"
            placeholder="Ürün, kategori veya marka ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8" strokeWidth="2"/>
            <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative bg-gray-100 hover:bg-gray-200 p-3 rounded-xl transition-colors duration-200">
          <svg width={20} height={20} fill="none" stroke="currentColor" className="text-gray-700">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" strokeWidth="2"/>
            <line x1="3" y1="6" x2="21" y2="6" strokeWidth="2"/>
            <path d="M16 10a4 4 0 0 1-8 0" strokeWidth="2"/>
          </svg>
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
        </button>

        {/* Favoriler Butonu */}
        <button
          className="relative bg-gray-100 hover:bg-gray-200 p-3 rounded-xl transition-colors duration-200"
          onClick={() => navigate("/favorite")}
        >
          <svg width={20} height={20} fill="none" stroke="currentColor" className="text-gray-700">
            <path 
              d="M10 18l-1.45-1.32C4.4 12.36 2 10.28 2 7.5 2 5.42 3.42 4 5.5 4c1.54 0 3.04 1.04 3.57 2.36h1.87C13.46 5.04 14.96 4 16.5 4 18.58 4 20 5.42 20 7.5c0 2.78-2.4 4.86-6.55 9.18L10 18z"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">2</span>
        </button>

        <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200 transform hover:scale-105">
          Sepetim
        </button>
        <button
            className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200"
            onClick={() => navigate("/auth/login")}
            >
            Giriş / Kayıt
            </button>
      </div>
    </header>
  );
};

export default Header;
