import { useState, useRef } from "react";
import Footer from './../../layouts/SellerLayout/Footer';

import Header from "../../components/Header";
import ProductCard from "../../components/ProductCard";

const categories = [
  "Elektronik", "Ev & Yaşam", "Yapı Market", "Ofis", "Kırtasiye", "Otomotiv", "Hobi", "Moda", "Spor", "Kozmetik"
];

const brands = [
  { name: "Apple", logo: "/brands/apple.png" },
  { name: "Samsung", logo: "/brands/samsung.png" },
  { name: "Siemens", logo: "/brands/siemens.png" },
  { name: "Bosch", logo: "/brands/bosch.png" },
  { name: "Arçelik", logo: "/brands/arcelik.png" },
  { name: "Vestel", logo: "/brands/vestel.png" },
  { name: "LG", logo: "/brands/lg.png" },
  { name: "Sony", logo: "/brands/sony.png" }
];

const featuredProducts = [
  { id: 1, name: "iPhone 15 Pro Max", price: 65000, oldPrice: 75000, image: "/products/iphone15pro.png", badge: "YENİ" },
  { id: 2, name: "MacBook Air M3", price: 42000, oldPrice: 48000, image: "/products/macbookair.png", badge: "İNDİRİM" },
  { id: 3, name: "AirPods Pro 2", price: 9500, oldPrice: 12000, image: "/products/airpodspro.png", badge: "POPÜLER" },
  { id: 4, name: "Samsung S24 Ultra", price: 58000, oldPrice: 65000, image: "/products/s24ultra.png", badge: "YENİ" },
  { id: 5, name: "iPad Pro", price: 35000, oldPrice: 42000, image: "/products/ipadpro.png", badge: "İNDİRİM" },
  { id: 6, name: "Apple Watch S9", price: 15000, oldPrice: 18000, image: "/products/applewatch.png", badge: "POPÜLER" }
];
const discountedProducts = [
  { name: "Dyson V15", price: 8500, oldPrice: 12000, discount: 30, image: "/products/dyson.png" },
  { name: "Philips Airfryer", price: 2100, oldPrice: 3000, discount: 30, image: "/products/airfryer.png" },
  { name: "Tefal Cookware Set", price: 1200, oldPrice: 1800, discount: 33, image: "/products/tefal.png" },
  { name: "Braun Epilator", price: 800, oldPrice: 1200, discount: 33, image: "/products/braun.png" },
  { name: "Karcher Basınçlı Yıkama", price: 2800, oldPrice: 4000, discount: 30, image: "/products/karcher.png" },
  { name: "Bosch Vidalama Seti", price: 450, oldPrice: 650, discount: 31, image: "/products/bosch-tools.png" }
];

const newProducts = [
  { name: "Steam Deck OLED", price: 18000, image: "/products/steamdeck.png", isNew: true },
  { name: "PlayStation Portal", price: 8500, image: "/products/psportal.png", isNew: true },
  { name: "Meta Quest 3", price: 22000, image: "/products/quest3.png", isNew: true },
  { name: "Nintendo Switch OLED", price: 12000, image: "/products/switch.png", isNew: true },
  { name: "Asus ROG Ally", price: 25000, image: "/products/rogally.png", isNew: true },
  { name: "Framework Laptop", price: 45000, image: "/products/framework.png", isNew: true }
];

const categoryCards = [
  {
    title: "Elektronik",
    description: "Teknoloji Ürünleri",
    image: "/categories/elektronik.png",
    productCount: "2.500+ Ürün"
  },
  {
    title: "Ev & Yaşam",
    description: "Ev Eşyaları",
    image: "/categories/ev-yasam.png",
    productCount: "5.200+ Ürün"
  },
  {
    title: "Yapı Market",
    description: "İnşaat & Bahçe",
    image: "/categories/yapi-market.png",
    productCount: "8.100+ Ürün"
  },
  {
    title: "Moda & Giyim",
    description: "Kıyafet & Aksesuar",
    image: "/categories/moda.png",
    productCount: "3.800+ Ürün"
  },
  {
    title: "Spor & Outdoor",
    description: "Spor Malzemeleri",
    image: "/categories/spor.png",
    productCount: "1.900+ Ürün"
  },
  {
    title: "Otomotiv",
    description: "Araç Aksesuarları",
    image: "/categories/otomotiv.png",
    productCount: "4.600+ Ürün"
  }
];



const CustomerDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const brandsScrollRef = useRef(null);
  const featuredScrollRef = useRef(null);
  const discountedScrollRef = useRef(null);
  const newProductsScrollRef = useRef(null);

  const scroll = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = 280;
      ref.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const NavButton = ({ direction, onClick, disabled = false }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`absolute ${direction === 'left' ? 'left-2' : 'right-2'} top-1/2 transform -translate-y-1/2 
        w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center z-10
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange-50 hover:shadow-xl hover:scale-105'}
        transition-all duration-200 border border-gray-200 group`}
    >
      {direction === 'left' ? (
        <svg width={20} height={20} fill="none" stroke="currentColor" className="text-gray-600 group-hover:text-orange-600">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 18l-6-6 6-6" />
        </svg>
      ) : (
        <svg width={20} height={20} fill="none" stroke="currentColor" className="text-gray-600 group-hover:text-orange-600">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 18l6-6-6-6" />
        </svg>
      )}
    </button>
  );

  const ScrollSection = ({ children, scrollRef }) => (
    <div className="relative">
      <NavButton direction="left" onClick={() => scroll(scrollRef, 'left')} />
      <NavButton direction="right" onClick={() => scroll(scrollRef, 'right')} />
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {children}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <nav className="bg-white border-b px-6 py-4">
        <div className="flex gap-6 overflow-x-auto scrollbar-hide justify-center">
          {categories.map((cat, i) => (
            <button key={i} className="font-medium text-gray-700 hover:text-orange-600 px-4 py-2 rounded-lg hover:bg-orange-50 transition-all duration-200 whitespace-nowrap">
              {cat}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4">
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <div className="lg:col-span-2 rounded-2xl overflow-hidden h-64 shadow-lg relative flex items-center bg-gradient-to-r from-orange-400 via-red-500 to-pink-500">
            <div className="absolute inset-0 bg-black bg-opacity-20" />
            <div className="relative z-10 px-8">
              <h2 className="text-4xl font-bold text-white mb-3">Büyük Kampanya!</h2>
              <p className="text-white text-lg mb-4">Tüm elektronik ürünlerde %40'a varan indirimler</p>
              <button className="bg-white text-orange-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors duration-200">
                Fırsatları Keşfet
              </button>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden h-64 shadow-lg relative flex items-center bg-gradient-to-br from-blue-600 to-purple-700">
            <div className="absolute inset-0 bg-black bg-opacity-20" />
            <div className="relative z-10 px-6 text-center">
              <h3 className="text-2xl font-bold text-white mb-2">Ücretsiz Kargo</h3>
              <p className="text-white text-sm mb-3">150₺ ve üzeri alışverişlerde</p>
              <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors duration-200">
                Detaylar
              </button>
            </div>
          </div>
        </section>

        {/* Markalar */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-2xl text-gray-900">Popüler Markalar</h2>
            <button className="text-orange-600 hover:text-orange-700 font-semibold">Tümünü Gör →</button>
          </div>
          <ScrollSection scrollRef={brandsScrollRef}>
            {brands.map((brand, i) => (
              <div key={i} className="bg-white border rounded-xl shadow-sm flex flex-col items-center min-w-[140px] p-5 hover:shadow-md transition-all duration-300 cursor-pointer group">
                <div className="w-16 h-16 flex items-center justify-center bg-gray-50 rounded-full mb-3 border group-hover:bg-gray-100 transition-colors duration-200">
                  <span className="text-gray-600 font-bold text-sm">{brand.name.charAt(0)}</span>
                </div>
                <span className="font-medium text-gray-700 text-sm">{brand.name}</span>
              </div>
            ))}
          </ScrollSection>
        </section>

        {/* Öne Çıkan Ürünler */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-2xl text-gray-900">Öne Çıkan Ürünler</h2>
            <button className="text-orange-600 hover:text-orange-700 font-semibold">Tümünü Gör →</button>
          </div>
          <ScrollSection scrollRef={featuredScrollRef}>
            {featuredProducts.map((product, i) => (
              <ProductCard key={i} product={product} />
            ))}
          </ScrollSection>
        </section>

        {/* İndirimli Ürünler */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-2xl text-gray-900">🔥 Süper İndirimler</h2>
              <p className="text-gray-600 text-sm">Sınırlı süre için özel fiyatlar</p>
            </div>
            <button className="text-red-600 hover:text-red-700 font-semibold">Tümünü Gör →</button>
          </div>
          <ScrollSection scrollRef={discountedScrollRef}>
            {discountedProducts.map((product, i) => (
              <ProductCard key={i} product={product} showDiscount={true} />
            ))}
          </ScrollSection>
        </section>

        {/* Yeni Ürünler */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-2xl text-gray-900">✨ Yeni Gelenler</h2>
              <p className="text-gray-600 text-sm">En son çıkan ürünler</p>
            </div>
            <button className="text-purple-600 hover:text-purple-700 font-semibold">Tümünü Gör →</button>
          </div>
          <ScrollSection scrollRef={newProductsScrollRef}>
            {newProducts.map((product, i) => (
              <ProductCard key={i} product={product} />
            ))}
          </ScrollSection>
        </section>

        {/* Kategori Kartları */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-2xl text-gray-900">Kategoriler</h2>
            <button className="text-orange-600 hover:text-orange-700 font-semibold">Tümünü Gör →</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryCards.map((category, i) => (
              <div
                key={i}
                className="relative rounded-2xl overflow-hidden h-48 shadow-lg group cursor-pointer transform hover:scale-105 transition-all duration-300"
                style={{
                  background: `linear-gradient(135deg, ${
                    [
                      'rgb(59, 130, 246), rgb(37, 99, 235)',
                      'rgb(34, 197, 94), rgb(22, 163, 74)',
                      'rgb(168, 85, 247), rgb(147, 51, 234)',
                      'rgb(236, 72, 153), rgb(219, 39, 119)',
                      'rgb(251, 191, 36), rgb(249, 115, 22)',
                      'rgb(99, 102, 241), rgb(79, 70, 229)'
                    ][i % 6]
                  })`
                }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-all duration-300" />
                <div className="relative z-10 p-6 flex flex-col h-full justify-end">
                  <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">{category.title}</h3>
                  <p className="text-white text-sm mb-2 opacity-90">{category.description}</p>
                  <p className="text-white text-xs opacity-75 mb-3">{category.productCount}</p>
                  <button className="w-fit px-4 py-2 bg-white bg-opacity-20 backdrop-blur-sm hover:bg-opacity-30 rounded-lg text-white font-semibold text-sm transition-all duration-200 border border-white border-opacity-30">
                    Keşfet →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default CustomerDashboard;
