import { useState, useEffect } from 'react';
import { FaStore, FaMapMarkerAlt, FaEye, FaEnvelope, FaSearch, FaFilter } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // Ürün detayına gitmek için
import { getProducts } from "../../services/productsService";
import { fetchCategories } from '../../services/categoryService';
import { useSelector } from "react-redux";
import { getMyProfile } from '../../services/authService';
import { generateProductUrl } from '../../utils/urlHelpers';
const Store = () => {

  const [storeInfo, setStoreInfo] = useState({
    id: "seller-123",
    name: "Sanayice Teknoloji Mağazası",
    description: "En yeni elektronik ürünler ve teknolojik aksesuarlar.",
    address: "Örnek Mah. Örnek Cad. No:123, İzmir",
    phone: "+90 232 123 45 67",
    email: "info@sanayicetechnology.com",
    categories: ["Akıllı Telefonlar", "Bilgisayarlar", "Aksesuarlar", "Ses Sistemleri"]
  });

  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tüm Kategoriler');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const { user } = useSelector((state) => state.auth);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error("Kategoriler alınamadı:", error);
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

  useEffect(() => {
    if (user) {
      setStoreInfo((prev) => ({
        ...prev,
        name: user.name,
        email: user.email,
        phone: user.phone,

      }));
    }
  }, [user]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMyProfile();
        setStoreInfo(data);
        console.log(data)
      } catch (error) {
        console.error("Profil bilgisi alınamadı:", error);
      }
    };

    fetchProfile();
  }, []);

  // Ürünleri filtreleme
  useEffect(() => {
    let currentProducts = products;

    // Kategori seçimi varsa filtrele
    if (selectedCategory !== 'Tüm Kategoriler') {
      currentProducts = currentProducts.filter(product => {
        // product.category objesi mi, string mi kontrol et
        const categoryName = product.category?.name || product.category;
        return categoryName === selectedCategory;
      });
    }

    // Arama terimi varsa filtrele
    if (searchTerm) {
      currentProducts = currentProducts.filter(product =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(currentProducts);
  }, [searchTerm, selectedCategory, products]);


  // Orders bileşeninizdeki boxStyle'a benzer bir stil
  const boxStyle = 'border border-gray-200 p-6 rounded-lg shadow-sm bg-white';
  const inputStyle = 'border-gray-200 outline-none border px-3 py-2 rounded-lg bg-gray-50';

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
     {/* Banner */}
            <div className="relative w-full h-40 md:h-48 bg-cover bg-center">
                <div className="absolute inset-0 bg-[var(--color-dark-blue)] bg-opacity-40"></div>
            </div>

            {/* Profil Bilgileri */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
                {storeInfo&& (
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 -mt-12 sm:-mt-10">
                        <img
                            src={storeInfo.profileImageUrl}
                            alt={storeInfo.sellerName}
                            className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-white shadow-md"
                        />
                        <div className="flex-1 text-gray-900 text-center sm:text-left gap-6 mt-4 md:mt-10">
                            <h1 className="text-xl md:text-2xl font-bold">{storeInfo.companyName}</h1>
                            <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-2 text-sm text-gray-600">
                                <span className="bg-[var(--color-dark-orange)] text-white px-3 py-1 rounded-full font-semibold text-sm">{storeInfo.averageRating}</span>
                                <span>{storeInfo.followerCount} takipçi</span>
                                <span>{products.length} ürün</span>
                                <span>{storeInfo.ratingCount} değerlendirme</span>
                            </div>
                        </div>
                       
                    </div>
                )}
            </div>
      {/* Mağaza Bilgileri ve İletişim */}
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 mt-8">
        {/** 
        <div className={`${boxStyle} mb-8`}>
          <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">Mağaza Bilgileri</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            {/**  <p className="flex items-center gap-2"><FaMapMarkerAlt className="text-[var(--color-orange)]" /> Adres: {storeInfo.address || "Adres bilgisi bulunamadı."}</p>
            <p className="flex items-center gap-2"><FaPhone className="text-[var(--color-orange)]" /> Telefon:  {storeInfo.phone || "Telefon bilgisi bulunamadı."}</p>
            <p className="flex items-center gap-2"><FaEnvelope className="text-[var(--color-orange)]" /> E-posta: {storeInfo.email}</p>
          </div>
        </div>*/}

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
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
            <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Ürünler Grid */}
        <h2 className="text-xl md:text-xl font-semibold text-gray-800 mb-6">Ürünlerimiz ({filteredProducts.length})</h2>
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col"
              >
                {/* Ürün Resmi */}
                <div className="h-32 flex items-center justify-center p-4">
                  <img
                    src={product.imageUrls[0]}
                    alt={product.name}
                    className="h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Ürün Bilgileri */}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">
                    {product.name}
                  </h3>
                  <p className="text-gray-500 text-xs mb-2">{product.category}</p>

                  <p className="text-base font-bold text-[var(--color-orange)] mb-4">
                    {product.price.toLocaleString()} TL
                  </p>

                  <Link
                    to={generateProductUrl(product)}
                    className="flex items-center justify-center gap-2 mt-auto bg-[var(--color-orange)] text-white text-sm py-2 rounded-lg text-center font-medium hover:bg-[var(--color-dark-orange)] transition-colors"
                  >
                    <FaEye /> Ürünü Gör
                  </Link>
                </div>
              </div>
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