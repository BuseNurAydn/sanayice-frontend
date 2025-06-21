import { useState,useEffect } from "react";
import { fetchFavorites, removeFavorites} from "../../services/favoritesService";
import { addToCart } from "../../services/cartService";
import { useDispatch ,useSelector} from "react-redux";
import { toast } from "react-toastify";

const renderStars = (rating) => {
  const safeRating = Math.max(0, Math.min(5, Math.floor(Number(rating) || 0)));
  const halfStar = Number(rating) % 1 >= 0.5;
  const emptyStars = 5 - safeRating - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      {[...Array(safeRating)].map((_, i) => (
        <svg key={`full-${i}`} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
        </svg>
      ))}

      {halfStar && (
        <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0v15z"/>
        </svg>
      )}

      {[...Array(emptyStars)].map((_, i) => (
        <svg key={`empty-${i}`} className="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
        </svg>
      ))}
    </div>
  );
};
const FavoritePage = () => {
  const [favorites, setFavorites] = useState([]);
  const dispatch = useDispatch();
  const { items} = useSelector(state => state.favorites);

  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

const handleRemoveFavorite = async (productId) => {
  try {
    await dispatch(removeFavorites(productId)).unwrap(); // Favoriden çıkar
    toast.info('Favorilerden çıkarıldı!');
    await dispatch(fetchFavorites()); // Listeyi güncelle
  } catch (err) {
    console.error("Silme işlemi başarısız:", err);
  }
};

//sepete ekleme
  const handleAddToCart = async (productId) => {

  try {
    await dispatch(addToCart({ productId, quantity: 1 })).unwrap();
    toast.success("Ürün sepete eklendi");
  } catch (err) {
    toast.error(err?.message || "Sepete eklenemedi.");
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <main className="flex-1 container mx-auto px-6 py-12">
        {/* Başlık Bölümü */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Favorilerim</h1>
          <p className="text-gray-600 text-lg">Beğendiğiniz ürünler burada</p>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-pink-400 mx-auto mt-4 rounded-full"></div>
        </div>

        {items.length === 0 ? (
          <div className="bg-white p-16 rounded-2xl shadow-lg text-center max-w-md mx-auto">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Henüz favori ürününüz yok</h3>
            <p className="text-gray-500">Beğendiğiniz ürünleri favorilere ekleyerek buradan kolayca erişebilirsiniz.</p>
          </div>
        ) : (
          <div className="grid gap-8 max-w-6xl mx-auto">
            {items.map(item => (
              <div
                key={item.productId}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <div className="flex flex-col lg:flex-row">
                  {/* Ürün Görseli */}
                  <div className="relative lg:w-80 h-80 lg:h-auto bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-8">
                    <img 
                      src={item.additionalImages[0]} 
                      alt={item.name} 
                      className="object-contain max-h-48 max-w-48 group-hover:scale-105 transition-transform duration-300" 
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {item?.badge && (
                        <span className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg">
                          {item?.badge}
                        </span>
                      )}
                      {item?.discount && (
                        <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg">
                          %{item?.discount} İNDİRİM
                        </span>
                      )}
                    </div>

                    {/* Favori Çıkar Butonu */}
                    <button className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group/btn">
                      <svg className="w-5 h-5 text-red-500 group-hover/btn:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>

                  {/* Ürün Bilgileri */}
                  <div className="flex-1 p-8 flex flex-col justify-between">
                    <div className="space-y-4">
                      {/* Marka */}
                      <div className="inline-block">
                        <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          {item.brand}
                        </span>
                      </div>

                      {/* Ürün Adı */}
                      <h2 className="text-2xl font-bold text-gray-800 leading-tight">
                        {item.name}
                      </h2>

                      {/* Rating */}
                      <div className="flex items-center gap-3">
                        {renderStars(item.rating)}
                        <span className="text-gray-600 text-sm font-medium">
                          {item.rating} ({item.reviewCount} değerlendirme)
                        </span>
                      </div>

                      {/* Fiyat */}
                      <div className="flex items-baseline gap-3">
                        <span className="text-3xl font-bold text-orange-600">
                          ₺{item.price.toLocaleString()}
                        </span>
                        {item.oldPrice && (
                          <span className="text-lg text-gray-400 line-through">
                            ₺{item.oldPrice.toLocaleString()}
                          </span>
                        )}
                      </div>

                      {/* Stok Durumu */}
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${item.stockQuantity > 0 ? "bg-green-500" : "bg-red-500"}`}></div>
                        <span className={`text-sm font-medium ${item.stockQuantity > 0 ? "text-green-600" : "text-red-600"}`}>
                          {item.stockQuantity > 0 ? `Stokta (${item.stockQuantity} adet)` : "Stokta Yok"}
                        </span>
                      </div>
                    </div>

                    {/* Aksiyon Butonları */}
                    <div className="flex flex-col sm:flex-row gap-4 mt-8">
                      <button
                        onClick={() => handleAddToCart(item.id)}
                         className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-4 px-8 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                        <div className="flex items-center justify-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 2.5M7 13l2.5 2.5" />
                          </svg>
                          Sepete Ekle
                        </div>
                      </button>
                      
                      <button
                     onClick={() => handleRemoveFavorite(item.id)}
                      className="sm:w-auto border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 py-4 px-8 rounded-xl font-semibold transition-all duration-300">
                        Favoriden Çıkar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
export default FavoritePage;