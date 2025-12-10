import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaSearch, FaSortAmountDownAlt, FaRegHeart } from "react-icons/fa";
import { MdAddShoppingCart } from "react-icons/md";
import { FaTimesCircle } from "react-icons/fa"; 
import { fetchFavorites, removeFavorites } from "../../services/favoritesService";
import { addToCart } from "../../services/cartService";
import { generateProductUrl } from "../../utils/urlHelpers";
import { Link } from "react-router-dom";

const FavoriteProductCard = ({ product, handleRemoveFavorite, handleAddToCart }) => {
  const [adding, setAdding] = useState(false); // Sepete ekleme state

  const renderStars = (rating) => {
    const safeRating = Math.max(0, Math.min(5, Math.floor(Number(rating) || 0)));
    const fullStars = safeRating;
    const emptyStars = 5 - fullStars;

    return (
      <div className="flex items-center gap-1">
        {[...Array(fullStars)].map((_, i) => (
          <svg key={`full-${i}`} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        ))}
        {[...Array(emptyStars)].map((_, i) => (
          <svg key={`empty-${i}`} className="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 20 20">
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        ))}
      </div>
    );
  };

  // Sepete Ekleme Handler'ı
  const handleCartClick = async (e) => {
    e.stopPropagation();
    setAdding(true);
    await handleAddToCart(product.id);
    setAdding(false);
  };

  // Favoriden Çıkar Handler'ı
  const handleRemoveClick = (e) => {
    e.stopPropagation();
    handleRemoveFavorite(product.id);
  };

  // Ürün detay sayfasına yönlendirme
  const handleClick = () => {
     const productUrl = generateProductUrl(product);
     navigate(productUrl);  
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white border border-gray-200 rounded-xl shadow p-4 flex flex-col hover:shadow-lg transition-all duration-300 relative cursor-pointer"
    >

      {/* Favoriden Çıkar Butonu */}
      <button
        className="bg-orange-50 p-2 rounded-full z-10 absolute top-2 right-2 cursor-pointer text-orange-500 hover:text-orange-600 hover:bg-orange-100 transition-colors"
        onClick={handleRemoveClick}
        title="Favorilerden Çıkar"
      >
        <FaTimesCircle className="w-5 h-5" />
      </button>

      {/* Görsel Alanı */}
      <Link to={generateProductUrl(product)} className="block relative mb-3">
        <div className="h-40 w-full rounded-lg flex items-center justify-center">
          {product.imageUrls ? (
            <img src={product.imageUrls[0]} alt={product.name} className="w-2/3 h-full object-contain hover:scale-105 transition-transform duration-300" />
          ) : (
            <span className="text-gray-400 text-sm">Ürün Görseli</span>
          )}
        </div>
      </Link>

      {/* Bilgiler */}
      <div className="flex flex-col flex-1">
        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full self-start mb-2">
          {product.brand || 'Marka Bilgisi Yok'}
        </span>

        <h1 className="text-base font-semibold text-gray-800 flex-1 line-clamp-2 min-h-[3rem]">{product.name}
        </h1>

        {/* Rating */}
        <div className="flex items-center gap-1 my-2">
          {renderStars(product.rating)}
          <span className="text-gray-600 text-xs">({product.reviewCount || 0})</span>
        </div>

        {/* Fiyat */}
        <div className="flex flex-col gap-1 mb-3 mt-auto pt-2">
          {product.oldPrice && (
            <span className="text-gray-400 line-through text-sm">{product.oldPrice.toLocaleString()} TL</span>
          )}
          <span className="text-orange-600 font-bold text-xl">{product.price.toLocaleString()} TL</span>
        </div>

        {/* Sepete Ekle Butonu */}
        <button
          disabled={adding || product.stockQuantity === 0}
          className={`mt-3 w-full py-2 rounded font-medium text-sm transition-all duration-300 ${product.stockQuantity > 0
              ? "bg-orange-500 hover:bg-orange-600 text-white cursor-pointer transform hover:scale-[1.01]"
              : "bg-gray-400 text-white opacity-70 cursor-not-allowed"
            }`}
          onClick={handleCartClick}
        >
          {product.stockQuantity === 0 ? "Stokta Yok" : adding ? "Ekleniyor..." : <><MdAddShoppingCart className="inline-block mr-1 text-lg" /> Sepete Ekle</>}
        </button>
      </div>
    </div>
  );
};

// ANA BİLEŞEN: FavoritePage
const FavoritePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("dateDesc");
  const dispatch = useDispatch();
  const { items } = useSelector(state => state.favorites);

  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  // Favoriden Çıkarma İşlemi
  const handleRemoveFavorite = async (productId) => {
    try {
      await dispatch(removeFavorites(productId)).unwrap();
      toast.info('Favorilerden çıkarıldı!');
      dispatch(fetchFavorites()); // Listeyi güncelle
    } catch (err) {
      console.error("Silme işlemi başarısız:", err);
      toast.error('Favori silinirken bir hata oluştu.');
    }
  };

  // Sepete Ekleme İşlemi
  const handleAddToCart = async (productId) => {
    try {
      await dispatch(addToCart({ productId, quantity: 1 })).unwrap();
      toast.success("Ürün sepete eklendi");
    } catch (err) {
      toast.error(err?.message || "Sepete eklenemedi.");
    }
  };

  // Arama ve Sıralama Mantığı
  const filteredAndSortedItems = [...items]
    .filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "priceAsc":
          return a.price - b.price;
        case "priceDesc":
          return b.price - a.price;
        case "nameAsc":
          return a.name.localeCompare(b.name, 'tr', { sensitivity: 'base' });
        case "dateDesc":
        default:
          return b.id - a.id; // Varsayım: Yüksek ID = Yeni
      }
    });

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="flex-1 container mx-auto px-4 sm:px-6 py-12">

        {/* Başlık Bölümü */}
        <div className=" mb-10">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-2"> Favorilerim</h1>
          <p className="text-gray-600 text-base">
            Kaydettiğiniz {items.length} ürüne buradan kolayca erişebilirsiniz.
          </p>
        {/** <div className="w-32 h-1 bg-gradient-to-r from-red-400 to-orange-400  mt-4 rounded-full"></div>*/}
        </div>

        {/* Arama ve Sıralama Alanı */}
        <div className="mb-8 p-4 bg-white rounded-xl shadow-sm border border-gray-100 max-w-6xl">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">

            {/* Arama Çubuğu */}
            <div className="relative flex-1 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Favorilerinizde arama yapın..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 transition duration-150 outline-none"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            {/* Sıralama Seçeneği */}
            <div className="relative w-full sm:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg focus:ring-orange-500 focus:border-orange-500 transition duration-150 outline-none"
              >
                <option value="dateDesc">En Yeniler</option>
                <option value="priceAsc">Fiyat Artan</option>
                <option value="priceDesc">Fiyat Azalan</option>
                <option value="nameAsc">İsme Göre (A-Z)</option>
              </select>
              <FaSortAmountDownAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

          </div>
        </div>

        {/* Favori Ürün Kartları */}
        {items.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl shadow-xl text-center max-w-md mx-auto mt-16 border border-gray-100">
            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaRegHeart className="w-10 h-10 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-3">Favoriler Kutunuz Boş</h3>
            <p className="text-gray-500 text-md">
              Hemen beğendiğiniz ürünleri favorilere eklemeye başlayın.
            </p>
          </div>
        ) : filteredAndSortedItems.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md mx-auto mt-16">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Aramanızla Eşleşen Ürün Bulunamadı</h3>
            <p className="text-gray-500 text-sm">Lütfen arama teriminizi veya filtrelerinizi değiştirin.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-6 max-w-6xl ">
            {filteredAndSortedItems.map((item) => (
              <FavoriteProductCard
                key={item.id}
                product={item}
                handleRemoveFavorite={handleRemoveFavorite}
                handleAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
export default FavoritePage;