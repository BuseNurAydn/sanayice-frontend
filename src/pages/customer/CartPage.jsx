import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { changeQuantity, removeCart, clearCart } from "../../services/cartService";
import { useNavigate, Link } from "react-router-dom";
import { FaRegTrashCan } from "react-icons/fa6";
import { toast } from "react-toastify";
import ProductCard from "../../components/ProductCard";
import { MdAddShoppingCart } from "react-icons/md";
import { generateProductUrl } from "../../utils/urlHelpers"; 

const dummyRelatedProducts = [
  { id: 101, name: "Gaming Mouse", brand: "Logitech", price: 899, imageUrls: ["/images/mouse.png"], category: "Elektronik" },
  { id: 102, name: "Mekanik Klavye", brand: "Razer", price: 1499, imageUrls: ["/images/keyboard.png"], category: "Elektronik" },
  { id: 103, name: "Kulaklık", brand: "SteelSeries", price: 1299, imageUrls: ["/images/headset.png"], category: "Elektronik" },
  { id: 104, name: "Laptop Standı", brand: "Xiaomi", price: 499, imageUrls: ["/images/stand.png"], category: "Aksesuar" },
  { id: 105, name: "Akıllı Kamera", brand: "Xiaomi", price: 1000, imageUrls: ["/images/kamera.png"], category: "Elektronik" },
];

// Sepet Öğesi Bileşeni
const CartItemCard = ({ item, dispatch }) => {

  // Adet Değiştirme
  const handleChangeQuantity = (newQuantity) => {
    if (newQuantity < 1) return;
    dispatch(changeQuantity({ itemId: item.id, quantity: newQuantity }));
  };

  // Sepetten Silme
  const handleRemove = () => {
    dispatch(removeCart(item.id));
    toast.info("Ürün sepetten kaldırıldı.");
  };

  // Ürün detayına gitme
  const productUrl = generateProductUrl({ id: item.productId, name: item.productName });

  return (
    <div className="flex bg-white rounded-lg shadow-sm p-4 border border-gray-100 mb-4 transition-all duration-300 hover:shadow-md">
      {/* Görsel */}
      <Link to={productUrl} className="flex-shrink-0 w-24 h-24 mr-4 border border-gray-100 rounded-lg overflow-hidden">
        <img
          src={item.productImageUrl}
          alt={item.productName}
          className="w-full h-full object-contain p-1"
        />
      </Link>

      {/* Bilgiler ve Kontroller */}
      <div className="flex flex-col justify-between flex-grow">
        <div className="flex justify-between items-start">
          <div>
            <Link to={productUrl} className="text-base font-semibold text-gray-800 hover:text-orange-600 transition-colors line-clamp-2">
              {item.productName}
            </Link>
            <p className="text-xs text-gray-500 mt-1">{item.productBrand}</p>
          </div>

          {/* Silme Butonu */}
          <button
            onClick={handleRemove}
            className="text-gray-400 hover:text-red-500 p-1 transition-colors flex-shrink-0"
            title="Sepetten Sil"
          >
            <FaRegTrashCan className="w-5 h-5" />
          </button>
        </div>

        {/* Adet Kontrol ve Fiyat */}
        <div className="flex justify-between items-end mt-2">
          {/* Adet Kontrol */}
          <div className="flex items-center gap-1 border border-gray-300 rounded-lg w-max shadow-sm">
            <button
              onClick={() => handleChangeQuantity(item.quantity - 1)}
              disabled={item.quantity <= 1}
              className={`text-lg font-bold w-8 h-8 rounded-l-lg transition-colors ${item.quantity <= 1 ? 'text-gray-400' : 'text-gray-700 hover:bg-gray-100'}`}
              aria-label="Azalt"
            >
              −
            </button>
            <span className="w-8 text-center font-semibold text-sm text-gray-700 select-none">
              {item.quantity}
            </span>
            <button
              onClick={() => handleChangeQuantity(item.quantity + 1)}
              className="text-lg font-bold w-8 h-8 rounded-r-lg text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Arttır"
            > +
            </button>
          </div>

          {/* Toplam Fiyat */}
          <p className="text-xl font-bold text-orange-600">
            {(item.unitPrice * item.quantity).toLocaleString()} TL
          </p>
        </div>
      </div>
    </div>
  );
};

// Özet Kartı Bileşeni 
const SummaryCard = ({ cartItems, getTotal, handleCheckout, dispatch }) => {
  const total = getTotal();

  const handleClearCart = () => {
    dispatch(clearCart());
    toast.success("Sepetiniz temizlendi.");
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl sticky top-4 border border-gray-100">
      <h3 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-300 pb-3">Sipariş Özeti</h3>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Ürün Toplamı ({cartItems.length})</span>
          <span className="font-medium text-gray-700">{total.toLocaleString()} TL</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Kargo Ücreti</span>
          <span className="text-green-600 font-bold">Ücretsiz</span> {/* Varsayım */}
        </div>
        <div className="flex justify-between pt-3 border-t border-dashed border-gray-300 mt-4">
          <span className="text-lg font-bold text-gray-800">Toplam Tutar</span>
          <span className="text-xl font-extrabold text-orange-600">{total.toLocaleString()} TL</span>
        </div>
      </div>

      <button
        onClick={handleCheckout}
        className="w-full mt-6 py-3 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-all duration-300 shadow-lg cursor-pointer"
      >
        Sepeti Onayla ({total.toLocaleString()} TL)
      </button>

      <button
        onClick={handleClearCart}
        className="w-full mt-3 py-2 border border-red-200 text-red-500 font-medium rounded-lg hover:bg-red-50 transition-colors duration-300 text-sm cursor-pointer"
      >
        Tüm Sepeti Temizle
      </button>

      <Link to="/" className="w-full mt-3 block text-center text-sm text-gray-500 border-gray-400 hover:border-orange-500 border py-2 rounded-lg hover:text-orange-500 transition-colors">
        Alışverişe Devam Et
      </Link>
    </div>
  );
};

// --- Ana Bileşen ---
const CartPage = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const suggestedScrollRef = useRef(null);

  const getTotal = () =>
    cartItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

  const handleCheckout = () => {
    navigate("/siparis-tamamla");
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
  const NavButton = ({ direction, onClick, disabled = false }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`absolute ${direction === 'left' ? 'left-2' : 'right-2'} top-1/2 transform -translate-y-1/2 
        w-10 h-10 bg-white shadow-xl rounded-full flex items-center justify-center z-10
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange-50 hover:shadow-2xl hover:scale-105'}
        transition-all duration-200 border border-gray-200 group`}
    >
      {direction === 'left' ? (
        <svg width={18} height={18} fill="none" stroke="currentColor" className="text-gray-600 group-hover:text-orange-600">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 18l-6-6 6-6" />
        </svg>
      ) : (
        <svg width={18} height={18} fill="none" stroke="currentColor" className="text-gray-600 group-hover:text-orange-600">
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
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {children}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        
        {/* Başlık Bölümü */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center">
            Sepetim ({cartItems.length} ürün)
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-red-400 to-orange-400 mx-auto mt-4 rounded-full"></div>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl shadow-lg text-center max-w-sm mx-auto flex flex-col gap-4 mt-20 border border-gray-100">
            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto">
              <MdAddShoppingCart className="w-10 h-10 text-orange-500" />
            </div>
            <h3 className="text-gray-700">Sepetinizde ürün bulunmamaktadır.</h3>
            <Link 
              to="/"
              className="flex items-center justify-center bg-orange-500 hover:bg-orange-600 p-3 rounded-lg font-medium text-sm text-white gap-2 transition-colors"
            >
              Alışverişe Başla
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            
            {/* Sol Blok: Sepet Öğeleri */}
            <div className="flex-1 lg:w-2/3">
              {cartItems.map((item) => (
                <CartItemCard key={item.id} item={item} dispatch={dispatch} />
              ))}
            </div>

            {/* Sağ Blok: Özet Kartı */}
            <div className="lg:w-1/3">
              <SummaryCard 
                cartItems={cartItems} 
                getTotal={getTotal} 
                handleCheckout={handleCheckout} 
                dispatch={dispatch} 
              />
            </div>
          </div>
        )}

        {/* Önerilen Ürünler */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">İlginizi Çekebilecek Ürünler</h3>
          <ScrollSection scrollRef={suggestedScrollRef}>
            {dummyRelatedProducts.map((item) => (
              // ProductCard'ın yüksekliğini sınırla
              <div key={item.id} className="flex-shrink-0 w-56"> 
                <ProductCard product={item} />
              </div>
            ))}
          </ScrollSection>
        </div>
        
      </main>
    </div>
  );
};
export default CartPage;