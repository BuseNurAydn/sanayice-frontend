import { useState } from "react";
import { Link } from "react-router-dom";

const CategoryMenu = ({ categories }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMobileCat, setActiveMobileCat] = useState(null);

  return (
    <>
      {/* Mobil Hamburger */}
      <button
        className="md:hidden p-2 text-gray-700"
        onClick={() => setMobileMenuOpen(true)}
        aria-label="Menüyü aç"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Masaüstü Menü */}
      <nav className="hidden md:flex space-x-6 justify-center bg-white py-3 shadow-sm border-b">
        {categories.map((cat) => (
          <div key={cat.id} className="relative group">
            <Link
              to={`/kategori/${cat.id}`}
              className="px-4 py-2 text-gray-700 hover:text-orange-600 transition"
            >
              {cat.name}
            </Link>
            {cat.subcategories?.length > 0 && (
              <div className="absolute left-0 top-full bg-white border rounded shadow-md mt-1 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity min-w-[180px] z-40">
                {cat.subcategories.map((sub) => (
                  <Link
                    key={sub.id}
                    to={`/kategori/${cat.id}`}
                    className="block px-4 py-2 hover:bg-orange-50 hover:text-orange-600"
                  >
                    {sub.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Mobil Menü - Slide-in */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-50 md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="font-bold text-lg">Kategoriler</h2>
          <button
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Menüyü kapat"
            className="p-2"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="p-4 overflow-y-auto h-[calc(100%-64px)]">
          {categories.map((cat) => (
            <div key={cat.id} className="mb-3">
              <button
                className="flex justify-between items-center w-full text-left px-3 py-2 font-medium text-gray-700 hover:bg-orange-50 rounded"
                onClick={() =>
                  setActiveMobileCat(activeMobileCat === cat.id ? null : cat.id)
                }
              >
                {cat.name}
                {cat.subcategories?.length > 0 && (
                  <svg
                    className={`w-5 h-5 transform transition-transform ${
                      activeMobileCat === cat.id ? "rotate-90" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </button>
              {activeMobileCat === cat.id && cat.subcategories?.length > 0 && (
                <div className="pl-6 mt-1 space-y-1">
                  {cat.subcategories.map((sub) => (
                    <Link
                      key={sub.id}
                      to={`/kategori/${cat.id}`}
                      className="block px-3 py-1 rounded hover:bg-orange-50 text-gray-600"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Koyu overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-40"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default CategoryMenu;
