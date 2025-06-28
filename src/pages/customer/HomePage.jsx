import { useState, useRef, useEffect } from "react";
import { Link } from 'react-router-dom'
import Slider from "react-slick";
import ProductCard from "../../components/ProductCard";
import { getProducts } from "../../services/productsService";
import { brands, cards1, cards2 } from './data/products';
import { fetchCategories } from "../../services/categoryService";
import { getAllPublicBanners } from "../../services/bannerService";
import CategoriesSection from '../../components/CategoriesSection';


const HomePage = () => {
  const brandsScrollRef = useRef(null);
  const featuredScrollRef = useRef(null);
  const discountedScrollRef = useRef(null);
  const newProductsScrollRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [banners, setBanners] = useState([]);

  const settings = {
  dots: true,
  arrows: false,
  infinite: banners.length > 1, // 1'den fazlaysa döngü yapsın
  speed: 300,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
};

  //GET CATEGORİES
  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      try {
        const data = await fetchCategories();
        setCategories(data);
        console.log("Kategoriler:", data)
      } catch (err) {
        setError(err.message || "Bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  //GET PRODUCTS
  useEffect(() => {
    getProducts()
      .then(data => {
        setProducts(data);
      })
      .catch(error => {
        console.error("Hata:", error);
      });
  }, []);

  //GET BANNERS
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const data = await getAllPublicBanners();
        setBanners(data);
      } catch (error) {
        console.error("Bannerlar yüklenemedi:", error.message);
      }
    };

    fetchBanners();
  }, []);

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
    <div className="bg-gray-50">
      {/*Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />*/}
      <nav className="bg-white shadow-md border-b relative">
        <div className="container mx-auto px-6">
          {/* Menü Satırı */}
          <div className="flex justify-center space-x-12 py-5">
            {categories.map((category) => (
              <div
                key={category.id}
                className="relative group"
                onMouseEnter={() => setActiveCategory(category.id)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <Link 
                  to={`/category/${category.id}`} 
                  className="text-sm font-semibold text-gray-700 hover:text-orange-600 transition-all duration-300 py-2 px-4 rounded-lg hover:bg-orange-50 relative flex items-center gap-1"
                >
                  {category.name}
                  {category.subcategories?.length > 0 && (
                    <svg 
                      className="w-3 h-3 transition-transform duration-300 group-hover:rotate-180" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                  <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-orange-600 transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
                </Link>
  
                {/* Alt Kategoriler Dropdown */}
                {activeCategory === category.id && category.subcategories?.length > 0 && (
                  <div className="absolute left-0 top-full mt-3 bg-white shadow-2xl border border-gray-200 rounded-2xl min-w-[320px] py-5 px-6 z-50 animate-dropdown">
                    <div className="space-y-1">
                      {category.subcategories.map((sub, index) => (
                        <Link
                          key={sub.id}
                          to={`/subcategory/${sub.id}`}
                          className="flex items-center gap-3 text-sm text-gray-700 hover:text-orange-600 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 px-4 py-3 rounded-xl transition-all duration-300 group"
                        >
                          <div className="w-2 h-2 bg-orange-200 rounded-full group-hover:bg-orange-500 transition-colors duration-300"></div>
                          <span className="font-medium">{sub.name}</span>
                          <svg 
                            className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      ))}
                    </div>
                    
                    {/* Dropdown Arrow */}
                    <div className="absolute -top-2 left-8 w-4 h-4 bg-white border-t border-l border-gray-200 rotate-45"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </nav>
  
      {/* CSS Animasyonları */}
      <style jsx>{`
        @keyframes dropdown {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-dropdown {
          animation: dropdown 0.3s ease-out forwards;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <main className="max-w-7xl mx-auto py-8 px-4">
        <section className="flex flex-col md:flex-row gap-6 pb-8">
          {/* Sol Slider */}
          <div className="w-full md:w-1/2">
            <Slider {...settings}>
              {banners.map((banner, index) => (
                <div key={index}>
                  <a
                    href={banner.linkUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                  <div className="bg-white shadow rounded-xl overflow-hidden">
                    <img src={banner.imageUrl} className="w-full h-48 object-cover" />
                    {/** 
                    <div className="p-4">
                      <h4 className="text-md font-bold mb-2">{banner.title}</h4>
                      <p className="text-sm text-gray-600">{banner.description}</p>
                    </div>*/}
                  </div>
                  </a>
                </div>
              ))}
            </Slider>
          </div>

          {/* Sağ Slider */}
          <div className="w-full md:w-1/2">
            <Slider {...settings}>
              {banners.map((banner, index) => (
                <div key={index}>
                  <a
                    href={banner.linkUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                  <div className="bg-white shadow rounded-xl overflow-hidden">
                    <img src={banner.imageUrl} className="w-full h-48 object-cover" />
                  </div>
                  </a>
                </div>
              ))}
            </Slider>
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
              <div key={i} className="bg-white border border-gray-300 rounded-xl shadow-sm flex flex-col items-center min-w-[140px] p-5 hover:shadow-md transition-all duration-300 cursor-pointer group">
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
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
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
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
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
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ScrollSection>
        </section>

        {/*Kategori Kartları */}
        <CategoriesSection categories={categories} />
      </main>

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

export default HomePage;
