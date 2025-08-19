import { useState, useRef, useEffect } from "react";
import { Link } from 'react-router-dom'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ProductCard from "../../components/ProductCard";
import { getProducts } from "../../services/productsService";
import { fetchActiveBrands } from "../../services/brandservice"; 
import { fetchCategories } from "../../services/categoryService";
import { getAllPublicBanners } from "../../services/bannerService";
import CategoriesSection from '../../components/CategoriesSection';
import AddSlider from "../../components/addSlider";

const NextArrow = ({ onClick }) => (
  <div
    onClick={onClick}
    className="absolute right-2 top-1/2 transform -translate-y-1/2 
               bg-white/70 hover:bg-white rounded-full p-2 cursor-pointer shadow-md"
  >
    <FaChevronRight className="text-lg text-orange-500" />
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div
    onClick={onClick}
    className="absolute left-2 top-1/2 transform -translate-y-1/2 
               bg-white/70 hover:bg-white rounded-full p-2 cursor-pointer shadow-md z-10"
  >
    <FaChevronLeft className="text-lg text-orange-500" />
  </div>
);

const HomePage = () => {
  const brandsScrollRef = useRef(null);
  const featuredScrollRef = useRef(null);
  const discountedScrollRef = useRef(null);
  const newProductsScrollRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]); // Brands state
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [banners, setBanners] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Dummy banner listesi 
  const leftBanners = [
    { imageUrl: "https://images.hepsiburada.net/banners/s/1/640-200/gra-199064-slider133997371828354751.jpg/format:webp" },
    { imageUrl: "https://images.hepsiburada.net/banners/s/1/640-200/gra-199031-slider133997241731061103.jpg/format:webp" },
    { imageUrl: "https://images.hepsiburada.net/banners/s/1/640-200/gra-199480-slider133995577722430043.jpg/format:webp" },
    { imageUrl: "https://images.hepsiburada.net/banners/s/1/640-200/gra-199000-slider-1133995369139444842.jpg/format:webp" },
  ];

  const rightBanners = [
    { imageUrl: "https://images.hepsiburada.net/banners/s/1/640-200/gra-199064-slider133997371828354751.jpg/format:webp" },
    { imageUrl: "https://images.hepsiburada.net/banners/s/1/640-200/gra-199031-slider133997241731061103.jpg/format:webp" },
    { imageUrl: "" },
    { imageUrl: "" },
  ];

  // Sayaç 
  const [leftIndex, setLeftIndex] = useState(1);
  const [rightIndex, setRightIndex] = useState(1);

  const leftSettings = {
    dots: false,
    infinite: leftBanners.length > 1,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    afterChange: (current) => setLeftIndex(current + 1),
    responsive: [
      {
        breakpoint: 1024, // 1024px altı
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 600, // 600px altı
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: true,
          infinite: true,
        },
      },
    ],
  };

  const rightSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    afterChange: (current) => setRightIndex(current + 1),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: true,
          infinite: true,
        },
      },
    ],
  };


  // GET CATEGORIES
  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (err) {
        setError(err.message || "Bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  // GET PRODUCTS
  useEffect(() => {
    getProducts()
      .then(data => {
        setProducts(data);
      })
      .catch(error => {
        console.error("Hata:", error);
      });
  }, []);

  // GET BRANDS
  useEffect(() => {
    const loadBrands = async () => {
      try {
        const data = await fetchActiveBrands();
        setBrands(data);
      } catch (error) {
        console.error("Markalar yüklenemedi:", error);
        setError("Markalar yüklenemedi");
      }
    };
    loadBrands();
  }, []);

  // GET BANNERS
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
      <nav className="bg-white shadow-md border-b relative hidden md:block">
        <div className="container mx-auto md:px-0 2xl:px-32">
          {/* Menü Satırı */}
          <div className="flex flex-wrap justify-start py-5">
            {categories.map((category) => (
              <div
                key={category.id}
                className="relative group"
                onMouseEnter={() => setActiveCategory(category.id)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <Link
                  to={`/category/${category.id}`}
                  className="text-sm font-medium text-gray-700 hover:text-orange-600 transition-all duration-300 py-2 px-4 rounded-lg hover:bg-orange-50 relative flex items-center gap-1 "
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
                  <div className="absolute left-0 top-full bg-white shadow-2xl border border-gray-200 rounded-2xl min-w-[320px] py-5 px-6 z-50 animate-dropdown">
                    <div className="space-y-1">
                      {category.subcategories.map((sub) => (
                        <Link
                          key={sub.id}
                          to={`/category/${category.id}`}
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
      <style>{`
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
          <div className="relative w-full md:w-[620px]">
            <Slider {...leftSettings}>
              {leftBanners.map((banner, i) => (
                <div key={i}>
                  <img
                    src={banner.imageUrl}
                    alt={`Banner ${i}`}
                    className="w-full h-auto md:h-[264px] object-cover rounded-md"
                  />
                </div>
              ))}
            </Slider>

            {/* Sayaç kutusu */}
            <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-0.5 rounded-md text-xs">
              {leftIndex} / {leftBanners.length}
            </div>
          </div>

          {/* Sağ Slider */}
          <div className="relative w-full md:w-[620px]">
            <Slider {...rightSettings}>
              {rightBanners.map((banner, i) => (
                <div key={i} className="border border-gray-200 rounded-lg">
                  <img
                    src={banner.imageUrl}
                    alt={`Banner ${i}`}
                    className="w-full h-auto md:h-[264px] object-cover rounded-md"
                  />
                </div>
              ))}
            </Slider>

            {/* Sayaç kutusu */}
            <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-0.5 rounded-md text-xs">
              {rightIndex} / {rightBanners.length}
            </div>
          </div>
        </section>

        {/*
        {/* Markalar 
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-lg md:text-2xl text-gray-900">Popüler Markalar</h2>
            <button className="text-[var(--color-dark-orange)] font-semibold">Tümünü Gör →</button>
          </div>
          <ScrollSection scrollRef={brandsScrollRef}>
            {brands.map((brand) => (
              <div
                key={brand.id}
                className="bg-white border border-gray-300 rounded-xl shadow-sm flex flex-col items-center min-w-[160px] p-6 hover:shadow-md transition-all duration-300 cursor-pointer group"
              >
                <div className="w-24 h-24 flex items-center justify-center bg-gray-50 rounded-full mb-4 border group-hover:bg-gray-100 transition-colors duration-200 overflow-hidden">
                  {brand.imageUrl ? (
                    <img
                      src={brand.imageUrl}
                      alt={brand.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-gray-600 font-bold text-lg">
                      {brand.name.charAt(0)}
                    </span>
                  )}
                </div>
                <span className="font-medium text-gray-700 text-sm text-center">
                  {brand.name}
                </span>
              </div>
            ))}
          </ScrollSection>
        </section>
        */}


        {/* Öne Çıkan Ürünler */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-lg md:text-2xl text-gray-900">Öne Çıkan Ürünler</h2>
            <button className="text-[var(--color-dark-orange)] font-semibold">Tümünü Gör →</button>
          </div>
          <ScrollSection scrollRef={featuredScrollRef}>
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ScrollSection>

          {/* Reklam Alanı */}
          <AddSlider />
        </section>

        {/* İndirimli Ürünler */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-lg md:text-2xl text-gray-900">🔥 Süper İndirimler</h2>
              <p className="text-gray-600 text-sm">Sınırlı süre için özel fiyatlar</p>
            </div>
            <button className="text-[var(--color-dark-orange)] font-semibold">Tümünü Gör →</button>
          </div>
          <ScrollSection scrollRef={discountedScrollRef}>
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ScrollSection>

          {/* Reklam Alanı */}
          <AddSlider />
        </section>

        {/* Yeni Ürünler */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-lg md:text-2xl text-gray-900">✨ Yeni Gelenler</h2>
              <p className="text-gray-600 text-sm">En son çıkan ürünler</p>
            </div>
            <button className="text-[var(--color-dark-orange)] font-semibold">Tümünü Gör →</button>
          </div>
          <ScrollSection scrollRef={newProductsScrollRef}>
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ScrollSection>

          {/* Reklam Alanı */}
          <AddSlider />
        </section>

         {/* Yeni Ürünler */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-lg md:text-2xl text-gray-900">Elektrik ve Elektronik Malzemeleri</h2>
             
            </div>
            <button className="text-[var(--color-dark-orange)] font-semibold">Tümünü Gör →</button>
          </div>
          <ScrollSection scrollRef={newProductsScrollRef}>
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ScrollSection>

          {/* Reklam Alanı */}
          <AddSlider />
        </section>

        {/*Kategori Kartları */}
        <CategoriesSection categories={categories} />

        ,
        <div className="bg-white py-6">
          <div className="max-w-8xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">

            {/* Güvenli Alışveriş */}
            <div className="flex flex-col items-center gap-2">
              <div className="text-purple-600 text-3xl">
                {/* İkon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2l4-4" />
                </svg>
              </div>
              <h4 className="font-bold text-gray-900">Güvenli Alışveriş</h4>
              <p className="text-gray-600 text-sm">İyzico ile birlikte güvenli ödeme</p>
            </div>

            {/* Kolay İade */}
            <div className="flex flex-col items-center gap-2">
              <div className="text-purple-600 text-3xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v6h6M20 20v-6h-6" />
                </svg>
              </div>
              <h4 className="font-bold text-gray-900">Kolay İade</h4>
              <p className="text-gray-600 text-sm">14 gün içinde ücretsiz iade imkanı</p>
            </div>

            {/* Ücretsiz Kargo */}
            <div className="flex flex-col items-center gap-2">
              <div className="text-purple-600 text-3xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18v10H3V10z" />
                </svg>
              </div>
              <h4 className="font-bold text-gray-900">Ücretsiz Kargo</h4>
              <p className="text-gray-600 text-sm">200 TL ve üzeri ücretsiz kargo</p>
            </div>

            {/* Hızlı Teslimat */}
            <div className="flex flex-col items-center gap-2">
              <div className="text-purple-600 text-3xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h18M3 6h18M3 18h18" />
                </svg>
              </div>
              <h4 className="font-bold text-gray-900">Hızlı Teslimat</h4>
              <p className="text-gray-600 text-sm">Güvenilir ve hızlı satıcılarla hızlı teslim</p>
            </div>

          </div>
        </div>

      </main>

      <style>{`
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