import { useState, useRef, useEffect } from "react";
import { Link } from 'react-router-dom'
import Slider from "react-slick";
import ProductCard from "../../components/ProductCard";
import { getProducts } from "../../services/productsService";
import { brands, cards1, cards2} from './data/products';
import { fetchCategories } from "../../services/categoryService";
import CategoriesSection from '../../components/CategoriesSection';

const settings = {
  dots: true,
  arrows: false,
  infinite: true,
  speed: 300,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
};

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const brandsScrollRef = useRef(null);
  const featuredScrollRef = useRef(null);
  const discountedScrollRef = useRef(null);
  const newProductsScrollRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

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
    <div className=" bg-gray-50">
      {/*Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />*/}
      <nav className="bg-white shadow border-b relative">
        <div className="container mx-auto px-6">
          {/* Menü Satırı */}
          <div className="flex space-x-8 py-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="relative"
                onMouseEnter={() => setActiveCategory(category.id)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <Link to={`/category/${category.id}`} className="text-sm font-semibold text-gray-800 hover:text-orange-600 transition">
                  {category.name}
                </Link>

                {/* Açılan Panel */}
                {activeCategory === category.id && category.subcategories?.length > 0 && (
                  <div className="absolute left-0 top-full mt-4 bg-white shadow-xl border-gray-200 rounded-b-xl w-[800px] px-6 py-5 z-50 animate-fade-in">

                    {/* Alt Kategoriler */}
                    <div className="grid grid-cols-4 gap-3">
                      {category.subcategories.map((sub) => (
                        <Link
                          key={sub.id}
                          to={`/subcategory/${sub.id}`}
                          className="text-sm text-gray-600 hover:text-orange-500 transition"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-8 px-4">
        <section className="flex flex-col md:flex-row gap-6 pb-8">
          {/* Sol Slider */}
          <div className="w-full md:w-1/2">
            <Slider {...settings}>
              {cards1.map((card, index) => (
                <div key={index}>
                  <div className="bg-white shadow rounded-xl overflow-hidden">
                    <img src={card.image} alt={card.title} className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <h4 className="text-md font-bold mb-2">{card.title}</h4>
                      <p className="text-sm text-gray-600">{card.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>

          {/* Sağ Slider */}
          <div className="w-full md:w-1/2">
            <Slider {...settings}>
              {cards2.map((card, index) => (
                <div key={index}>
                  <div className="bg-white shadow rounded-xl overflow-hidden">
                    <img src={card.image} alt={card.title} className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <h4 className="text-md font-bold mb-2">{card.title}</h4>
                      <p className="text-sm text-gray-600">{card.desc}</p>
                    </div>
                  </div>
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
