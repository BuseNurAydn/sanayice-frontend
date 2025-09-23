import { useState, useRef, useEffect } from "react";
import { Link } from 'react-router-dom'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ProductCard from "../../components/ProductCard";
import { getProducts, getProductsByCategoryId } from "../../services/productsService";
import { fetchActiveBrands } from "../../services/brandservice";
import { fetchCategories } from "../../services/categoryService";
import { getAllPublicBanners } from "../../services/bannerService";
import CategoriesSection from '../../components/CategoriesSection';
import CategorySection from '../../components/CategorySection';
import AddSlider from "../../components/addSlider";
import Discover from "../../components/Discover";
import CategoriesMenu from "../../components/CategoriesMenu";
import HeaderCategories from "../../components/HeaderCategories";
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

  const [leftBanners, setLeftBanners] = useState([]);
  const [rightBanners, setRightBanners] = useState([]);

  
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
           infinite: leftBanners.length > 1,
          dots: false,
        },
      },
      {
        breakpoint: 600, // 600px altı
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: true,
           infinite: leftBanners.length > 1,
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
        const categoryData = await fetchCategories();
        // Her kategori için ürünleri çektim
        const categoriesWithProducts = await Promise.all(
          categoryData.map(async (cat) => {
            try {
              const products = await getProductsByCategoryId(cat.id);
              return { ...cat, products, banners: [] }; 
            } catch {
              return { ...cat, products: [], banners: [] };
            }
          })
        );

        setCategories(categoriesWithProducts);
      } catch (err) {
        console.error("Kategori veya ürünler yüklenemedi:", err);
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
        console.log(data)
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

      // İlk 4 sol slider, sonraki 4 sağ slider
      setLeftBanners(data.slice(0, 4));
      setRightBanners(data.slice(4, 8));
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
        transition-all duration-200 border border-gray-200 group hidden md:flex`}
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

  if (loading) return <div className="text-center py-20">Yükleniyor...</div>;
  return (
    <div className="bg-gray-50">
     <HeaderCategories />
          {/* diğer nav linkleri */}
        
      
   <div className="bg-white">
      <Discover />
   </div>
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

        {/* Her kategori bölümü için */}
        {categories.map((category) => (
          <CategorySection key={category.id} category={category} />
        ))}


        {/*Kategori Kartları */}
      {/**  <CategoriesSection categories={categories} /> */} 

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