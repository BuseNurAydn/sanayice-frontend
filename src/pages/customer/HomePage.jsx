import { useState, useRef } from "react";
import {Link} from 'react-router-dom'
import Slider from "react-slick";
import ProductCard from "../../components/ProductCard";
import {brands,categories,cards1,cards2,featuredProducts,discountedProducts,newProducts,categoryCards} from './data/products';

const  settings = {
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

      <nav className="bg-white border-b px-6 py-4">
        <div className="flex gap-6 overflow-x-auto scrollbar-hide justify-center">
          {categories.map((cat, i) => (
            <Link key={i} to="/electronic" className="font-medium text-gray-700 hover:text-orange-600 px-6 py-2 rounded-lg hover:bg-orange-50 transition-all duration-200 whitespace-nowrap">
              {cat}
            </Link>
          ))}
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
                  background: `linear-gradient(135deg, ${[
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
