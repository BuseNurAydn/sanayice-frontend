import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/Header";
import Footer from './../../layouts/SellerLayout/Footer';
import ProductCard from "../../components/ProductCard";

const similarProducts = [
  { name: "Dyson V15", price: 8500, oldPrice: 12000, discount: 30, image: "/products/dyson.png" },
  { name: "PlayStation Portal", price: 8500, image: "/products/psportal.png", badge: "YENİ" },
  { name: "Steam Deck OLED", price: 18000, image: "/products/steamdeck.png", badge: "POPÜLER" },
  { name: "Braun Epilator", price: 800, oldPrice: 1200, discount: 33, image: "/products/braun.png" },
  { name: "Apple Watch S9", price: 15000, oldPrice: 18000, badge: "YENİ", image: "/products/applewatch.png" },
  { name: "Karcher Basınçlı Yıkama", price: 2800, oldPrice: 4000, discount: 30, image: "/products/karcher.png" },
  { name: "Tefal Cookware Set", price: 1200, oldPrice: 1800, discount: 33, image: "/products/tefal.png" },
];

const DUMMY_PRODUCTS = [
  {
    id: "1",
    name: "iPhone 15 Pro Max",
    images: [
      "/products/iphone15pro.png",
      "/products/iphone15pro2.png",
      "/products/iphone15pro3.png",
    ],
    price: 65000,
    oldPrice: 75000,
    badge: "YENİ",
    discount: 13,
    stock: 8,
    brand: "Apple",
    category: "Akıllı Telefon",
    sku: "IP15PM-256-BLU",
    rating: 4.8,
    reviewCount: 127,
    description: "Apple'ın en yeni amiral gemisi iPhone 15 Pro Max, gelişmiş A17 Pro çip, profesyonel kamera sistemi ve premium titanium tasarımı ile teknolojinin zirvesini temsil ediyor.",
    features: [
      "6.7 inç Super Retina XDR OLED ekran (2796 × 1290)",
      "A17 Pro çip, 6 çekirdekli CPU ve 6 çekirdekli GPU",
      "Pro kamera sistemi: 48MP Ana + 12MP Ultra Geniş + 12MP Telefoto",
      "256GB, 512GB ve 1TB depolama seçenekleri",
      "USB-C konektör, Face ID, Dynamic Island",
      "Titanium çerçeve, IP68 su geçirmezlik",
      "5G bağlantı, MagSafe kablosuz şarj"
    ],
    specifications: {
      "Ekran": "6.7 inç Super Retina XDR OLED",
      "İşlemci": "Apple A17 Pro",
      "RAM": "8GB",
      "Depolama": "256GB",
      "Kamera": "48MP + 12MP + 12MP",
      "Batarya": "4441 mAh",
      "İşletim Sistemi": "iOS 17"
    },
    reviews: [
      { 
        user: "Mehmet Demir", 
        rating: 5, 
        comment: "Gerçekten harika bir telefon! Kamera kalitesi ve performans mükemmel.",
        date: "15 Mart 2024"
      },
      { 
        user: "Ayşe Kaya", 
        rating: 4, 
        comment: "Fiyatı yüksek ama kalite buna değer. Özellikle fotoğraf çekme deneyimi çok iyi.",
        date: "8 Mart 2024"
      },
      { 
        user: "Can Özkan", 
        rating: 5, 
        comment: "A17 Pro çip gerçekten çok hızlı. Oyun performansı ve günlük kullanımda hiç sorun yok.",
        date: "2 Mart 2024"
      }
    ],
    shipping: {
      free: true,
      fastDelivery: true,
      estimatedDays: "1-2 iş günü"
    },
    warranty: "2 yıl Apple garantisi",
    returnPolicy: "14 gün ücretsiz iade"
  }
];

const ProductDetail = () => {
  const { id } = useParams();
  const product = DUMMY_PRODUCTS.find(p => p.id === id) || DUMMY_PRODUCTS[0];
  const [sliderIndex, setSliderIndex] = useState(0);
  const [favorite, setFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  const handleAddToCart = () => {
    alert(`${quantity} adet ${product.name} sepete eklendi!`);
  };

  const handleBuyNow = () => {
    alert("Hemen satın al işlemi başlatılıyor...");
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
          </svg>
        ))}
        {hasHalfStar && (
          <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
            <defs>
              <linearGradient id="half">
                <stop offset="50%" stopColor="currentColor"/>
                <stop offset="50%" stopColor="transparent"/>
              </linearGradient>
            </defs>
            <path fill="url(#half)" d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
          </svg>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <svg key={i} className="w-5 h-5 text-gray-300 fill-current" viewBox="0 0 20 20">
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="text-sm text-gray-600">
            <span className="hover:text-orange-600 cursor-pointer">Ana Sayfa</span>
            <span className="mx-2">/</span>
            <span className="hover:text-orange-600 cursor-pointer">{product.category}</span>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Sol: Görseller */}
          <div className="space-y-4">
            {/* Ana görsel */}
            <div className="relative bg-white rounded-2xl p-8 shadow-sm border">
              <div className="aspect-square flex items-center justify-center">
                <img
                  src={product.images[sliderIndex]}
                  alt={product.name}
                  className="max-w-full max-h-full object-contain transition-all duration-300"
                />
              </div>
              
              {/* Slider okları */}
              {product.images.length > 1 && (
                <>
                  <button
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110"
                    onClick={() =>
                      setSliderIndex((prev) =>
                        prev === 0 ? product.images.length - 1 : prev - 1
                      )
                    }
                  >
                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110"
                    onClick={() =>
                      setSliderIndex((prev) =>
                        prev === product.images.length - 1 ? 0 : prev + 1
                      )
                    }
                  >
                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>

            {/* Küçük görseller */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSliderIndex(idx)}
                  className={`flex-shrink-0 w-20 h-20 bg-white rounded-xl border-2 overflow-hidden transition-all duration-200 ${
                    sliderIndex === idx 
                      ? "border-orange-500 shadow-md" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} ${idx + 1}`}
                    className="w-full h-full object-contain p-2"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Sağ: Ürün Bilgileri */}
          <div className="space-y-6">
            {/* Başlık ve Favori */}
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">{product.brand}</p>
                <h1 className="text-3xl font-bold text-gray-900 leading-tight">{product.name}</h1>
                <p className="text-sm text-gray-500 mt-1">SKU: {product.sku}</p>
              </div>
              <button
                onClick={() => setFavorite(!favorite)}
                className={`p-3 rounded-full border-2 transition-all duration-200 ${
                  favorite
                    ? "bg-red-50 border-red-200 text-red-500"
                    : "bg-white border-gray-200 text-gray-400 hover:border-gray-300 hover:text-red-400"
                }`}
              >
                <svg className="w-6 h-6" fill={favorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            {/* Değerlendirme */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {renderStars(product.rating)}
                <span className="font-semibold text-gray-900">{product.rating}</span>
              </div>
              <span className="text-gray-500">({product.reviewCount} değerlendirme)</span>
            </div>

            {/* Fiyat */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center gap-4 mb-2">
                {product.oldPrice && (
                  <span className="text-xl text-gray-400 line-through">
                    ₺{product.oldPrice.toLocaleString()}
                  </span>
                )}
                <span className="text-3xl font-bold text-orange-600">
                  ₺{product.price.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-3">
                {product.discount && (
                  <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full font-bold">
                    %{product.discount} İNDİRİM
                  </span>
                )}
                {product.badge && (
                  <span className="bg-green-500 text-white text-sm px-3 py-1 rounded-full font-bold">
                    {product.badge}
                  </span>
                )}
              </div>
            </div>

            {/* Stok Durumu */}
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? `Stokta (${product.stock} adet)` : 'Stokta yok'}
              </span>
            </div>

            {/* Miktar ve Butonlar */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="font-medium text-gray-700">Miktar:</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-gray-100 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 min-w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-2 hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
                >
                  Sepete Ekle
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="flex-1 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
                >
                  Hemen Al
                </button>
              </div>
            </div>

            {/* Kargo ve Garanti Bilgileri */}
            <div className="bg-green-50 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-green-800 font-medium">Ücretsiz kargo</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-green-800">Hızlı teslimat: {product.shipping.estimatedDays}</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-green-800">{product.warranty}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detay Sekmeleri */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="border-b">
            <div className="flex">
              {["description", "specifications", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-4 font-semibold transition-colors ${
                    activeTab === tab
                      ? "text-orange-600 border-b-2 border-orange-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab === "description" && "Açıklama"}
                  {tab === "specifications" && "Özellikler"}
                  {tab === "reviews" && "Değerlendirmeler"}
                </button>
              ))}
            </div>
          </div>

          <div className="p-8">
            {activeTab === "description" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-4">Ürün Açıklaması</h3>
                  <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-3">Öne Çıkan Özellikler</h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "specifications" && (
              <div>
                <h3 className="text-xl font-bold mb-4">Teknik Özellikler</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="border-b border-gray-200 pb-3">
                      <dt className="font-semibold text-gray-900 mb-1">{key}</dt>
                      <dd className="text-gray-600">{value}</dd>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Müşteri Değerlendirmeleri</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {renderStars(product.rating)}
                      <span className="font-semibold">{product.rating}</span>
                    </div>
                    <span className="text-gray-500">({product.reviewCount} değerlendirme)</span>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {product.reviews.map((review, idx) => (
                    <div key={idx} className="border-b border-gray-200 pb-6 last:border-b-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{review.user}</h4>
                          <p className="text-sm text-gray-500">{review.date}</p>
                        </div>
                        {renderStars(review.rating)}
                      </div>
                      <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>



      <Footer />
    </div>
  );
};

export default ProductDetail;