// src/pages/customer/Store.jsx
import { useState, useEffect } from 'react';
import { FaStore, FaMapMarkerAlt, FaPhone, FaEnvelope, FaSearch, FaFilter } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // Ürün detayına gitmek için

const Store = () => {
  // Örnek mağaza ve ürün verileri (gerçek uygulamada API'den çekilir)
  const [storeInfo, setStoreInfo] = useState({
    id: "seller-123",
    name: "Sanayice Teknoloji Mağazası",
    description: "En yeni elektronik ürünler ve teknolojik aksesuarlar.",
    logo: "https://via.placeholder.com/150/0000FF/FFFFFF?text=StoreLogo", // Örnek logo
    banner: "https://via.placeholder.com/1200x300/FFA500/FFFFFF?text=StoreBanner", // Örnek banner
    address: "Örnek Mah. Örnek Cad. No:123, İzmir",
    phone: "+90 232 123 45 67",
    email: "info@sanayicetechnology.com",
    categories: ["Akıllı Telefonlar", "Bilgisayarlar", "Aksesuarlar", "Ses Sistemleri"]
  });

  const [products, setProducts] = useState([
    { id: "p1", name: "iPhone 15 Pro", price: 55000, imageUrl: "https://via.placeholder.com/300/FF5733/FFFFFF?text=iPhone15", category: "Akıllı Telefonlar" },
    { id: "p2", name: "Samsung Galaxy Book", price: 38000, imageUrl: "https://via.placeholder.com/300/33FF57/FFFFFF?text=Laptop", category: "Bilgisayarlar" },
    { id: "p3", name: "AirPods Max", price: 12000, imageUrl: "https://via.placeholder.com/300/3357FF/FFFFFF?text=Headphones", category: "Aksesuarlar" },
    { id: "p4", name: "PlayStation 5 Pro", price: 22000, imageUrl: "https://via.placeholder.com/300/FF33A1/FFFFFF?text=PS5", category: "Oyun Konsolları" },
    { id: "p5", name: "Xiaomi Mi TV 55", price: 15000, imageUrl: "https://via.placeholder.com/300/A133FF/FFFFFF?text=TV", category: "Ses Sistemleri" },
    { id: "p6", name: "HP Spectre x360", price: 42000, imageUrl: "https://via.placeholder.com/300/33A1FF/FFFFFF?text=Laptop", category: "Bilgisayarlar" },
    { id: "p7", name: "JBL Flip 6", price: 3000, imageUrl: "https://via.placeholder.com/300/FF8C33/FFFFFF?text=Speaker", category: "Ses Sistemleri" },
    { id: "p8", name: "Apple Watch Series 9", price: 14000, imageUrl: "https://via.placeholder.com/300/8C33FF/FFFFFF?text=Smartwatch", category: "Aksesuarlar" },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tüm Kategoriler');
  const [filteredProducts, setFilteredProducts] = useState(products);

  // Ürünleri filtreleme
  useEffect(() => {
    let currentProducts = products;

    if (selectedCategory !== 'Tüm Kategoriler') {
      currentProducts = currentProducts.filter(product => product.category === selectedCategory);
    }

    if (searchTerm) {
      currentProducts = currentProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredProducts(currentProducts);
  }, [searchTerm, selectedCategory, products]);

  // Orders bileşeninizdeki boxStyle'a benzer bir stil
  const boxStyle = 'border border-gray-200 p-6 rounded-lg shadow-sm bg-white';
  const inputStyle = 'border-gray-200 outline-none border px-3 py-2 rounded-lg bg-gray-50';

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Mağaza Bannerı */}
      <div className="relative w-full h-64 bg-cover bg-center" style={{ backgroundImage: `url(${storeInfo.banner})` }}>
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4">
          <div className="text-white text-center">
            {storeInfo.logo && (
              <img src={storeInfo.logo} alt={`${storeInfo.name} Logo`} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white shadow-lg" />
            )}
            <h1 className="text-4xl font-bold">{storeInfo.name}</h1>
            <p className="text-lg mt-2">{storeInfo.description}</p>
          </div>
        </div>
      </div>

      {/* Mağaza Bilgileri ve İletişim */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className={`${boxStyle} mb-8`}>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Mağaza Bilgileri</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <p className="flex items-center gap-2"><FaMapMarkerAlt className="text-[var(--color-orange)]" /> Adres: {storeInfo.address}</p>
            <p className="flex items-center gap-2"><FaPhone className="text-[var(--color-orange)]" /> Telefon: {storeInfo.phone}</p>
            <p className="flex items-center gap-2"><FaEnvelope className="text-[var(--color-orange)]" /> E-posta: {storeInfo.email}</p>
          </div>
        </div>

        {/* Ürün Filtreleri ve Arama */}
        <div className={`${boxStyle} flex flex-col md:flex-row gap-4 mb-8`}>
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Ürün ara..."
              className={`w-full pl-10 pr-4 ${inputStyle}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <div className="relative">
            <select
              className={`w-full pl-10 pr-4 ${inputStyle} appearance-none`}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="Tüm Kategoriler">Tüm Kategoriler</option>
              {storeInfo.categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Ürünler Grid */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Ürünlerimiz ({filteredProducts.length})</h2>
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Link to={`/seller_product/${product.id}`} key={product.id} className="block group">
                <div className={`${boxStyle} p-4 flex flex-col items-center text-center hover:shadow-lg transition-shadow duration-300`}>
                  <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-contain mb-4 rounded-md" />
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[var(--color-orange)] transition-colors duration-200 line-clamp-2">{product.name}</h3>
                  <p className="text-gray-500 text-sm mt-1">{product.category}</p>
                  <p className="text-xl font-bold text-[var(--color-orange)] mt-3">₺{product.price.toLocaleString()}</p>
                  <button className="mt-4 bg-[var(--color-orange)] text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors duration-200 text-sm w-full">
                    Ürünü Görüntüle
                  </button>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className={`${boxStyle} text-center py-12`}>
            <p className="text-gray-500 text-lg">Aradığınız kriterlere uygun ürün bulunamadı.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Store;