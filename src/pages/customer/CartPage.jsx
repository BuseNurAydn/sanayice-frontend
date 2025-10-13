import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { changeQuantity, removeCart, clearCart } from "../../services/cartService";
import { useNavigate, Link } from "react-router-dom";
import { FaRegTrashCan } from "react-icons/fa6";
import { toast } from "react-toastify";
import ProductCard from "../../components/ProductCard";
import { MdAddShoppingCart } from "react-icons/md";

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


const CartPage = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const suggestedScrollRef = useRef(null);

  const getTotal = () =>
    cartItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

  const handleCheckout = () => {
    // Checkout sayfasına yönlendirme
    navigate("/siparis-tamamla");
  };

  const handleContinueShopping = () => {
    navigate("/");
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Başlık Bölümü */}
        <div className="text-center mb-12">

          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            Sepetim ({cartItems.length} ürün)
          </h1>

          <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-pink-400 mx-auto mt-4 rounded-full"></div>
        </div>
        {cartItems.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl shadow-lg text-center max-w-sm mx-auto flex flex-col gap-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.293 2.707A1 1 0 007 17h10m-4 4a1 1 0 100-2 1 1 0 000 2zm-6 0a1 1 0 100-2 1 1 0 000 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Henüz sepetinizde ürün yok</h3>
            <p className="text-gray-500 text-sm">Beğendiğiniz ürünleri sepete ekleyerek kolayca sipariş verebilirsiniz.</p>

            <Link 
               to="/"
               className="flex items-center justify-center bg-[var(--color-light-orange)] hover:bg-[var(--color-dark-orange)] p-2 rounded-lg font-medium text-sm text-white gap-2"

            >
             <MdAddShoppingCart className="text-xl " /> Alışverişe Devam Et
             </Link>
          </div>
        ) : (
          cartItems.map((item) => (
            <div
              key={item.id}
              className="flex max-w-5xl mx-auto flex-col md:flex-row border border-gray-300 rounded-lg p-4 mb-4 relative"
            >
              {/* Sol: Görsel */}
              <div className="w-full md:w-28 h-28 flex items-center justify-center mb-4 md:mb-0 md:mr-4">
                <img
                  src={item.productImageUrl}
                  alt={item.productName}
                  className="w-24 h-24 object-cover border border-gray-100"
                />
              </div>

              {/* Sağ: Bilgiler ve Fiyat */}
              <div className="flex flex-col w-full">
                <h2 className="text-lg font-semibold text-gray-800">{item.productName}</h2>
                <p className="text-sm text-gray-500">{item.productBrand}</p>

                {/* Alt: Adet kontrol + Fiyat & Silme */}
                <div className="flex justify-between items-center mt-4 flex-wrap gap-4">
                  {/* Adet Kontrol */}
                  <div className="flex items-center gap-4 border border-[var(--color-dark-orange)] rounded-lg w-max px-2 py-1 shadow">
                    <button
                      onClick={() => {
                        if (item.quantity > 1) {
                          dispatch(changeQuantity({ itemId: item.id, quantity: item.quantity - 1 }));
                        }
                      }}
                      className="flex items-center justify-center"
                      aria-label="Azalt"
                    >
                      <span className="text-2xl font-bold select-none">−</span>
                    </button>

                    <span className="w-8 text-center font-semibold text-gray-700 select-none">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => {
                        dispatch(changeQuantity({ itemId: item.id, quantity: item.quantity + 1 }));
                      }}
                      className="flex items-center justify-center"
                      aria-label="Arttır"
                    >
                      <span className="text-2xl font-bold select-none">+</span>
                    </button>
                  </div>

                  {/* Fiyat & Silme */}
                  <div className="flex flex-col gap-2 items-end">
                    <p className="text-orange-600 font-bold text-md">
                      {(item.unitPrice * item.quantity).toLocaleString()} TL
                    </p>
                    <button
                      onClick={() => {
                        dispatch(removeCart(item.id));
                        toast.info("Ürün silindi");
                      }}
                      className="text-red-500 hover:text-red-700 underline text-sm"
                    >
                      <FaRegTrashCan />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}

        {/* Toplam */}
        {cartItems.length > 0 && (
          <>
            <div className="mt-6 text-right text-xl font-bold text-gray-800">
              Toplam: {getTotal().toLocaleString()} TL
            </div>

            {/* Butonlar */}
            <div className="flex justify-end gap-4 mt-6 md:flex-row flex-col">
              <button
                onClick={handleContinueShopping}
                className="px-4 py-2 border border-gray-400 rounded hover:bg-gray-200 cursor-pointer"
              >
                Alışverişe Devam Et
              </button>
              <button
                onClick={handleCheckout}
                className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 cursor-pointer"
              >
                Alışverişi Tamamla
              </button>
              <button
                onClick={() => {
                  dispatch(clearCart());
                  toast.success("Sepet temizlendi");
                }}
                className="px-4 py-2 border bg-red-600 hover:bg-red-700 text-white rounded cursor-pointer"
              >
                Sepeti Sil
              </button>
            </div>
          </>
        )}

        {/* Önerilen Ürünler */}
       <div className="mt-12">
          <h3 className="text-xl font-bold mb-6">Önerilen Ürünler</h3>
          <ScrollSection scrollRef={suggestedScrollRef}>
            {dummyRelatedProducts.map((item) => (
             <div key={item.id} className="flex-shrink-0 min-w-[224px] max-h-[330px]"> 
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