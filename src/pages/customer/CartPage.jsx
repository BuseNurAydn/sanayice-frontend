import { useSelector, useDispatch } from "react-redux";
import { changeQuantity, removeCart, clearCart} from "../../services/cartService";
import { useNavigate } from "react-router-dom";
import { FaRegTrashCan } from "react-icons/fa6";
import { toast } from "react-toastify";

const CartPage = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getTotal = () =>
    cartItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

  const handleCheckout = () => {
    // Checkout sayfasına yönlendirme
    navigate("/checkout");
  };

  const handleContinueShopping = () => {
    navigate("/");
  };

  return (
   <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <main className="flex-1 container mx-auto px-6 py-12">
       {/* Başlık Bölümü */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Sepetim</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-pink-400 mx-auto mt-4 rounded-full"></div>
        </div>
      {cartItems.length === 0 ? (
        <div className="bg-white p-16 rounded-2xl shadow-lg text-center max-w-md mx-auto">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Henüz sepetinizde ürün yok</h3>
            <p className="text-gray-500">Beğendiğiniz ürünleri sepete ekleyerek kolayca sipariş verebilirsiniz.</p>
          </div>
      ) : (
        cartItems.map((item) => (
          <div
            key={item.id}
            className="flex border border-gray-300 rounded-lg p-4 mb-4 items-center relative"
          >
            {/* Sol: Görsel */}
            <div className="w-24 h-24 flex items-center justify-center mr-4">
              <img
                src={
                  item.additionalImages?.[0]
                    ? `/${item.additionalImages[0]}`
                    : "/no-image.png"
                }
                alt={item.productName}
                className="h-full border border-gray-300 object-contain"
              />
            </div>

            {/* Orta: Bilgiler */}
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-800">
                {item.productName}
              </h2>
              <p className="text-sm text-gray-500">{item.productBrand}</p>

              {/* Adet Kontrol */}
              <div className="flex items-center gap-4 mt-4 border border-[var(--color-dark-orange)] rounded-lg w-max px-2 py-1 shadow">
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
                  className=" flex items-center justify-center"
                  aria-label="Arttır"
                >
                  <span className="text-2xl font-bold select-none">+</span>
                </button>
              </div>

            </div>

            {/* Sağ: Fiyat ve Sil */}
            <div className="flex flex-col items-end space-y-2">
              <p className="text-orange-600 font-bold text-md">
                ₺{(item.unitPrice * item.quantity).toLocaleString()}
              </p>
              <button
                onClick={() => {
                  dispatch(removeCart(item.id)),
                    toast.info("Ürün silindi");
                }}
                className="text-red-500 hover:text-red-700 underline"
              >
                <FaRegTrashCan />
              </button>
            </div>
          </div>
        ))
      )}

      {/* Toplam */}
      {cartItems.length > 0 && (
        <>
          <div className="mt-6 text-right text-xl font-bold text-gray-800">
            Toplam: ₺{getTotal().toLocaleString()}
          </div>

          {/* Butonlar */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={handleContinueShopping}
              className="px-4 py-2 border border-gray-400 rounded hover:bg-gray-100"
            >
              Alışverişe Devam Et
            </button>
            <button
              onClick={handleCheckout}
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
            >
              Alışverişi Tamamla
            </button>
            <button
              onClick={() => {
                dispatch(clearCart());
                toast.success("Sepet temizlendi");
              }}
              className="px-4 py-2 border bg-red-600 text-white rounded"
            >
              Sepeti Sil
            </button>
          </div>
        </>
      )}
      </main>
    </div>
  );
};

export default CartPage;