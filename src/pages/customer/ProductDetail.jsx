import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { API_BASE } from "../../config";
import { useDispatch, useSelector } from "react-redux";
import { FaHeart, FaRegHeart, FaCreditCard, FaUserPlus, FaUserCheck } from "react-icons/fa";
import { GoChevronRight } from "react-icons/go";
import { MdAddShoppingCart } from "react-icons/md";
import { TiMessages } from "react-icons/ti";
import { addToCart } from "../../services/cartService";
import { toast } from "react-toastify";
import { setBuyNowItem } from "../../store/buyNowSlice";
import ProductCard from "../../components/ProductCard";
import { ReviewIcon } from "./ReviewIcon";
import { QuestionIcon } from "./QuestionIcon";
import { addToFavorites, fetchFavorites, removeFavorites } from "../../services/favoritesService";
import SellerQuestions from "../../components/SellerQuestions";
import { followSeller, isFollowingSeller, unfollowSeller, getSellerRatings } from "../../services/authService";
import { getProductQuestionsCount } from "../../services/productsService";

const dummyRelatedProducts = [
  {
    id: 101,
    name: "Gaming Mouse",
    brand: "Logitech",
    price: 899,
    imageUrls: ["/images/mouse.png"],
  },
  {
    id: 102,
    name: "Mekanik Klavye",
    brand: "Razer",
    price: 1499,
    imageUrls: ["/images/keyboard.png"],
  },
  {
    id: 103,
    name: "Kulaklık",
    brand: "SteelSeries",
    price: 1299,
    imageUrls: ["/images/headset.png"],
  },
  {
    id: 104,
    name: "Laptop Standı",
    brand: "Xiaomi",
    price: 499,
    imageUrls: ["/images/stand.png"],
  },
  {
    id: 105,
    name: "Kamera",
    brand: "Xiaomi",
    price: 1000,
    imageUrls: ["/images/kamera.png"],
  },
];


const ProductDetail = () => {
  const { brand, productSlug, id } = useParams();
  const [sliderIndex, setSliderIndex] = useState(0);
  const [favorite, setFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [product, setProduct] = useState({ reviews: [], });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([])
  const relatedScrollRef = useRef(null);
  const suggestedScrollRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const tabsRef = useRef(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [sellerReviews, setSellerReviews] = useState([]);
  const [sellerAverage, setSellerAverage] = useState(0);
  const [questionsCount, setQuestionsCount] = useState(0);

  const favorites = useSelector(state => state.favorites.items);
  const isFavorite = favorites.some(fav => fav.productId === product.id);
  const PRODUCTS_API = `${API_BASE}/products`;

  const images = product?.imageUrls || []; // imageUrls backend'den (array halinde)

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  //satıcının değerlendirmesi
  useEffect(() => {
    const fetchSellerRatings = async () => {
      if (!product?.sellerId) return;

      try {
        const data = await getSellerRatings(product.sellerId);
        setSellerReviews(data);

        // Ortalama puan
        const avg =
          data.length > 0
            ? data.reduce((acc, r) => acc + r.rating, 0) / data.length
            : 0;
        setSellerAverage(avg.toFixed(1));
      } catch (err) {
        console.error("Satıcı yorumları alınamadı:", err);
      }
    };

    fetchSellerRatings();
  }, [product?.sellerId]);

  // follow / unfollow toggle
  const handleFollowSeller = async (sellerId) => {
    if (!sellerId) {
      toast.error("Satıcı bilgisi bulunamadı!");
      return;
    }
    try {
      if (isFollowing) {
        // zaten takip ediliyorsa -> unfollow
        await unfollowSeller(sellerId);
        setIsFollowing(false);
        toast.info("Satıcı takipten çıkarıldı");
      } else {
        // takip edilmiyorsa -> follow
        await followSeller(sellerId);
        setIsFollowing(true);
        toast.success("Satıcı takip edildi");
      }
    } catch (err) {
      console.error("Takip toggle hatası:", err.message);
      toast.error(err.message || "Takip işlemi sırasında hata oluştu");
    }
  };

  useEffect(() => {
    const checkFollowing = async () => {
      if (!product?.sellerId) return;

      try {
        const result = await isFollowingSeller(product.sellerId);
        setIsFollowing(result); // true / false
      } catch (err) {
        console.error("Takip kontrolü hatası:", err);
      }
    };

    checkFollowing();
  }, [product?.sellerId]);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${PRODUCTS_API}/${id}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error("Ürün bulunamadı");
        const data = await response.json();
        setProduct(data);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${PRODUCTS_API}/${id}/reviews`);
        const data = await res.json();
        setReviews(data);
      } catch (err) {
        console.error("Yorumlar alınamadı:", err);
      }
    };

    fetchProduct();
    fetchReviews();
  }, [id]);

  //FAVORİLERE EKLEME
  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    const token = localStorage.getItem('token');

    if (!token) {
      // Giriş yoksa, sadece ürün id'sini string olarak sakla
      localStorage.setItem("pendingFavoriteItem", product.id.toString());
      toast.info("Lütfen giriş yapın!");
      navigate("/giris-kaydol/giris-yap");
      return;
    }
    setAdding(true);
    try {
      if (isFavorite) {
        await dispatch(removeFavorites(product.id)).unwrap();
        toast.success('Favorilerden çıkarıldı');
      } else {
        await dispatch(addToFavorites(product.id)).unwrap();
        toast.success('Favorilere eklendi!');
      }
      await dispatch(fetchFavorites()).unwrap();
    } catch {
      toast.error('Bir hata oluştu');
    } finally {
      setAdding(false);
    }
  };
//SEPETE EKLEME
  const handleAddToCart = async (e) => {
    e.stopPropagation();

    const token = localStorage.getItem("token");

    // Eğer kullanıcı giriş yapmamışsa
    if (!token) {
      // Ürünü localStorage'a geçici olarak kaydet
      localStorage.setItem(
        "pendingCartItem",
        JSON.stringify({ productId: product.id, quantity: 1 })
      );
      toast.info("Lütfen giriş yapın!");
      navigate("/giris-kaydol/giris-yap");
      return;
    }
    try {
      await dispatch(addToCart({ productId: product.id, quantity })).unwrap();
      toast('Sepete eklendi!');
    } catch (error) {
      console.error("Sepete ekleme hatası:", error);
      toast("Sepete eklenirken bir hata oluştu.");
    }
  };

  //SORU ADEDİ İÇİN
useEffect(() => {
  if (!id) return;

  const fetchQuestionsCount = async () => {
    try {
      const count = await getProductQuestionsCount(id); 
      setQuestionsCount(count);
    } catch (err) {
      console.error("Soru sayısı alınamadı:", err);
    }
  };

  fetchQuestionsCount();
}, [id]);

  const handleBuyNow = () => {
    dispatch(setBuyNowItem({ product, quantity }));
    navigate('/siparis-tamamla');
  };

  const htext = (text) => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };
  const scroll = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = 280;
      ref.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  
  if (loading) return <p>Yükleniyor...</p>;
  if (error) return <p>Hata: {error}</p>;
  if (!product) return <p>Ürün bulunamadı.</p>;

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;


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

  function renderStars(rating) {
    const fullStars = Math.max(0, Math.min(Math.floor(rating || 0), 5));
    const hasHalfStar = rating % 1 >= 0.5;

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        ))}
        {hasHalfStar && (
          <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
            <defs>
              <linearGradient id="half">
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="transparent" stopOpacity="1" />
              </linearGradient>
            </defs>
            <path fill="url(#half)" d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        )}
      </div>
    );
  }

  return (
    <div className=" bg-gray-50">

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <nav className="text-sm text-gray-600">
            <Link to="/" className="hover:text-orange-600 cursor-pointer text-sm">
              Ana Sayfa
            </Link>
            <span className="mx-2">/</span>
            <Link
              to={`/kategori/${product.categoryId}`}
              className="hover:text-orange-600 cursor-pointer text-xs"
            >
              {htext(product.categoryName)}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium text-xs">{product.name}</span>
          </nav>
        </div>
      </div>
      <main className="max-w-7xl mx-auto px-1 md:py-8 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr_300px] gap-2 mb-8">
          {/* Sol: Görseller */}
          <div className="space-y-4 px-4">
            {/* Ana görsel + slider */}
            <div className="relative bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-300 max-w-xs md:max-w-md">
              <div className="aspect-square flex items-center justify-center">
                {images?.length > 0 ? (
                  <img
                    src={images[sliderIndex]}
                    alt={product?.name || "Ürün resmi"}
                    className="max-w-[50%] max-h-[50%] object-contain transition-all duration-300"
                  />
                ) : (
                  <div>Resim bulunamadı.</div>
                )}
              </div>

              {/* Slider okları */}
              {images?.length > 1 && (
                <>
                  <button className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110"
                    onClick={() => setSliderIndex((prev) => prev === 0 ? images.length - 1 : prev - 1)}
                  >
                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110"
                    onClick={() => setSliderIndex((prev) => prev === images.length - 1 ? 0 : prev + 1)}
                  >
                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>

            {/* Alt küçük görseller */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images?.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSliderIndex(idx)}
                  className={`flex-shrink-0 w-20 h-20 bg-white rounded-xl border-2 overflow-hidden transition-all duration-200 ${sliderIndex === idx
                    ? "border-orange-500 shadow-md"
                    : "border-gray-200 hover:border-gray-300"
                    }`}
                >
                  <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-contain p-2" />
                </button>
              ))}
            </div>
          </div>

          {/* orta: Ürün Bilgileri */}
          <div className="space-y-4 md:space-y-8 custom-font px-4 md:px-0 ">
            {/* Başlık ve Favori */}
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[var(--color-orange)] font-semibold mb-2">{product.brand}</p>
                <h1 className="text-md md:text-lg font-bold text-gray-900 leading-tight">{product.name}</h1>
                {/*<p className="text-sm text-gray-500 mt-1">SKU: {product?.sku}</p>*/}
              </div>
            </div>

            {/* Değerlendirme */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {renderStars(averageRating)}
                <span className="font-semibold text-gray-900">{averageRating.toFixed(1)}</span>
              </div>
              <span className="text-gray-500">({reviews.length} değerlendirme)</span>
            </div>

            {/* Fiyat */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center gap-4 mb-2">
                {product?.oldPrice && (
                  <span className="text-xl text-gray-400 line-through">
                    {product?.oldPrice.toLocaleString()} TL
                  </span>
                )}
                <span className="text-3xl font-bold text-[var(--color-dark-blue)]"> {product?.price.toLocaleString()} TL </span>
              </div>
              <div className="flex items-center gap-3">
                {product?.discount && (
                  <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full font-bold">
                    %{product?.discount} İNDİRİM
                  </span>
                )}
                {product?.badge && (
                  <span className="bg-green-500 text-white text-sm px-3 py-1 rounded-full font-bold">
                    {product?.badge}
                  </span>
                )}
              </div>
            </div>

            {/* Miktar ve Butonlar */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <label className="font-medium text-gray-700">Miktar:</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-gray-100 hover:text-[var(--color-dark-orange)] text-xl transition-colors cursor-pointer"
                  > - </button>
                  <span className="px-4 py-2 min-w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                    className="px-3 py-2 hover:bg-gray-100 hover:text-[var(--color-dark-orange)] text-xl  transition-colors cursor-pointer"
                  >
                    +
                  </button>

                </div>
              </div> 

              {/* Stok Durumu */}
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${product?.stockQuantity > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className={`font-medium ${product?.stockQuantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product?.stockQuantity > 0 ? `Stokta (${product?.stockQuantity} adet)` : 'Stokta yok'}
                </span>
              </div>
               
              {/**Mobil */}
              <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 flex flex-row gap-2 z-50 md:hidden">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stockQuantity === 0}
                  className="flex-1 flex items-center justify-center gap-1 md:gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white py-1 px-2 md:py-2 md:px-4 rounded-xl md:font-semibold md:text-lg text-sm transition-all duration-200 transform cursor-pointer"
                >
                  <MdAddShoppingCart className="text-2xl" /> Sepete Ekle
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={product.stockQuantity === 0}
                  className="flex-1 flex items-center justify-center gap-1 md:gap-2 bg-[var(--color-dark-blue)] hover:bg-gray-800 disabled:bg-gray-400 text-white  py-2 px-3 md:py-2 md:px-4 rounded-xl md:font-semibold md:text-lg text-sm transition-all duration-200 transform cursor-pointer"
                >
                  <FaCreditCard className="text-lg" /> Hemen Al
                </button>
                <button
                  onClick={handleFavoriteClick}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer hover:bg-orange-50 ${favorite
                    ? "bg-red-50 border-red-200 text-red-500"
                    : "bg-white border-gray-200 text-gray-400 hover:border-gray-300 hover:text-red-400"
                    }`}
                >
                  {isFavorite ? (
                    <FaHeart className="text-orange-500" />
                  ) : (
                    <FaRegHeart className="text-gray-400 hover:text-orange-500" />
                  )}
                </button>
              </div>

         {/**Desktop */}
            </div>
                 <div className="gap-4 hidden md:flex">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stockQuantity === 0}
                  className="flex-1 flex items-center justify-center gap-1 md:gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white py-1 px-2 md:py-2 md:px-4 rounded-xl md:font-semibold md:text-lg text-sm transition-all duration-200 transform cursor-pointer"
                >
                  <MdAddShoppingCart className="text-2xl" /> Sepete Ekle
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={product.stockQuantity === 0}
                  className="flex-1 flex items-center justify-center gap-1 md:gap-2 bg-[var(--color-dark-blue)] hover:bg-gray-800 disabled:bg-gray-400 text-white  py-2 px-3 md:py-2 md:px-4 rounded-xl md:font-semibold md:text-lg text-sm transition-all duration-200 transform cursor-pointer"
                >
                  <FaCreditCard className="text-lg" /> Hemen Al
                </button>
                <button
                  onClick={handleFavoriteClick}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer hover:bg-orange-50 ${favorite
                    ? "bg-red-50 border-red-200 text-red-500"
                    : "bg-white border-gray-200 text-gray-400 hover:border-gray-300 hover:text-red-400"
                    }`}
                >
                  {isFavorite ? (
                    <FaHeart className="text-orange-500" />
                  ) : (
                    <FaRegHeart className="text-gray-400 hover:text-orange-500" />
                  )}
                </button>
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
                <span className="text-green-800">
                  Hızlı teslimat: {product?.shipping?.estimatedDays ?? "bilgi yok"}
                </span>
              </div>

              {/** 
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-green-800">{product?.warranty}</span>
            </div>*/}
            </div>
            {/* Ürün Bilgileri */}
            {product?.highlightedFeatures?.length > 0 && (
              <div className="m-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Ürün Bilgileri</h4>
                <div className="flex flex-wrap gap-2">
                  {product.highlightedFeatures.map((feature, idx) => (
                    <span
                      key={idx}
                      className="bg-orange-50 text-gray-800 text-sm px-3 py-2 rounded-md"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* Sağ: Satıcı Kartı */}
          <div className="relative px-4">
            <div className="bg-white rounded-xl shadow-lg border border-orange-200 p-4 space-y-4">

              {/* Mağazaya Git Butonu */}
              <Link
                to={`/magaza/${product.sellerId}`}
                className="absolute -top-5 left-1/2 -translate-x-1/2 bg-orange-500 text-white px-5 py-2 rounded-full font-semibold text-sm shadow-md hover:bg-orange-600 transition flex items-center justify-center gap-1"
              >
                Mağazaya Git <GoChevronRight />
              </Link>

              {/* Mağaza Adı ve Puan */}
              <div className="flex items-center justify-between gap-4 mt-6 bg-orange-50 p-4 rounded-lg">
                <div className="flex flex-col">
                  <h3 className="text-lg font-bold text-gray-900">
                    {product.sellerCompanyName || "Mağaza Adı"}
                  </h3>
                  <p className="text-sm text-gray-600">{sellerReviews.length} değerlendirme</p>
                </div>

                <div className="flex items-center gap-1 bg-green-100 px-3 py-1 rounded-full">
                  <span className="text-sm font-semibold text-green-700">
                    {Number(sellerAverage || 0).toFixed(1)}
                  </span>
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                </div>
              </div>

              {/* Takip Et */}
              <button
                onClick={() => handleFollowSeller(product.sellerId)}
                disabled={!product?.sellerId}
                className={`flex items-center justify-center gap-2 w-full py-2 text-sm font-medium rounded-lg transition cursor-pointer
                  ${isFollowing ? "bg-gray-100 text-gray-700" : "bg-orange-50 hover:text-orange-600 hover:bg-orange-100"}`}
              >
                {isFollowing ? (
                  <FaUserCheck className="text-lg text-green-600" />
                ) : (
                  <FaUserPlus className="text-lg text-gray-600 hover:text-orange-600" />
                )}
                {isFollowing ? "Takip Ediliyor" : "Takip Et"}
              </button>

              {/* Satıcıya Sor */}
              <button
                onClick={() => {
                  setActiveTab("qa");
                  setTimeout(() => {
                    tabsRef.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }, 150);
                }}
                className="flex items-center justify-center gap-2 w-full py-2 text-sm font-medium rounded-lg bg-gray-50 hover:bg-gray-100 transition hover:text-orange-600 cursor-pointer"
              >
                <TiMessages className="text-lg text-gray-600 hover:text-orange-600" /> Satıcıya Sor
              </button>

            </div>
          </div>

        </div>

        {/* Detay Sekmeleri */}
        <div className="px-4">
          <div
            ref={tabsRef}
            className="scroll-target bg-white rounded-2xl shadow-sm border border-gray-300 overflow-hidden"
          >
            {/* Tab Butonları */}
            <div className="border-b border-gray-300">
              <div className="flex overflow-x-auto no-scrollbar">
                {["description", "specifications", "reviews", "qa"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-shrink-0 px-4 md:px-8 py-3 md:py-4 font-semibold transition-colors ${activeTab === tab
                      ? "text-orange-600 border-b-2 border-orange-600"
                      : "text-gray-600 hover:text-gray-900"
                      }`}
                  >
                    {tab === "description" && "Açıklama"}
                    {tab === "specifications" && "Özellikler"}
                    {tab === "reviews" && (
                      <ReviewIcon count={reviews?.length || 0} />
                    )}
                     {tab === "qa" && <QuestionIcon count={questionsCount} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab İçeriği */}
            <div className="px-4 md:p-8">
              {activeTab === "description" && (
                <div className="space-y-6 py-8">
                  <div>
                    <h3 className="text-lg md:text-xl font-bold mb-4">
                      Ürün Açıklaması
                    </h3>
                    <p className="text-gray-700 leading-relaxed mb-6">
                      {product.description}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-md md:text-lg font-semibold mb-3">
                      Öne Çıkan Özellikler
                    </h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {product.highlightedFeatures.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <svg
                            className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === "specifications" && (
                <div className="space-y-6 py-8">
                  <h3 className="text-lg md:text-xl font-bold mb-4">
                    Teknik Özellikler
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(product.technicalSpecifications).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="border-b border-gray-200 pb-3"
                        >
                          <dt className="font-semibold text-gray-900 mb-1">
                            {key}
                          </dt>
                          <dd className="text-gray-600">{value}</dd>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="space-y-6 py-8">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                    <h3 className="text-lg md:text-xl font-bold">
                      Müşteri Değerlendirmeleri
                    </h3>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {renderStars(product.rating)}
                        <span className="font-semibold">{product.rating}</span>
                      </div>
                      <span className="text-gray-500">
                        ({reviews.length} değerlendirme)
                      </span>
                    </div>
                  </div>

                  {reviews.length === 0 ? (
                    <p className="text-gray-500 italic">
                      Bu ürüne ait henüz bir değerlendirme yok.
                    </p>
                  ) : (
                    <div className="space-y-6">
                      {reviews.map((review, idx) => (
                        <div
                          key={idx}
                          className="border-b border-gray-200 pb-6 last:border-b-0"
                        >
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-3 gap-2">
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                {review.userName}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {new Date(
                                  review.createdAt
                                ).toLocaleDateString()}
                              </p>
                            </div>
                            {renderStars(review.rating)}
                          </div>
                          <p className="text-gray-700 leading-relaxed">
                            {review.comment}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "qa" && (
                <div className="space-y-6 py-8">
                  <SellerQuestions  productId={id} autoOpenForm={true} />
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Benzer Ürünler */}
        <div className="mt-12 p-4 md:px-4">
          <h3 className="text-xl font-bold mb-6">Buna bakanların aldıkları</h3>
          <ScrollSection scrollRef={relatedScrollRef}>
            {dummyRelatedProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </ScrollSection>
        </div>

        <div className="mt-12 p-4 md:px-4">
          <h3 className="text-xl font-bold mb-6">Bunlar da ilgini çekebilir</h3>
          <ScrollSection scrollRef={suggestedScrollRef}>
            {dummyRelatedProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </ScrollSection>

        </div>
      </main >
    </div >
  );
};
export default ProductDetail;